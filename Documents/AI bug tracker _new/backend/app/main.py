from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import hashlib
from datetime import datetime
from typing import List, Dict, Optional
import json

from app.utils.redaction import LogRedactor
from app.utils.database import Database
from app.utils.ai_analyzer import AIAnalyzer

# Initialize FastAPI app
app = FastAPI(title="AI Bug Tracker", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
db = Database(os.getenv("DATABASE_URL", "./logs.db"))
ai_analyzer = AIAnalyzer()
redactor = LogRedactor()

# Models
class UploadResponse(BaseModel):
    upload_id: int
    filename: str
    status: str
    is_duplicate: bool
    message: str

class UploadData(BaseModel):
    id: int
    filename: str
    upload_time: str
    file_size: int
    status: str
    severity: Optional[int] = None
    results: Optional[Dict] = None

# Routes

@app.get("/", tags=["Health"])
def root():
    """Health check endpoint."""
    return {"status": "ok", "service": "AI Bug Tracker API"}

@app.post("/upload", response_model=UploadResponse, tags=["Upload"])
async def upload_file(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    """
    Upload a log file for analysis.
    - Validates file type and size
    - Detects duplicates
    - Starts AI analysis in background
    """
    
    # Validate file type
    allowed_extensions = os.getenv("ALLOWED_EXTENSIONS", "log,txt,json").split(",")
    file_ext = file.filename.split(".")[-1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type .{file_ext} not allowed. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Read and validate file size
    max_size = int(os.getenv("MAX_FILE_SIZE", 5242880))  # 5MB
    content = await file.read()
    
    if len(content) > max_size:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds {max_size / (1024*1024):.0f}MB limit"
        )
    
    # Convert to string
    try:
        log_content = content.decode('utf-8', errors='ignore')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read file: {str(e)}")
    
    # Generate hash
    log_hash = AIAnalyzer.generate_hash(log_content)
    
    # Check for duplicates
    duplicate = db.get_upload_by_hash(log_hash)
    is_duplicate = duplicate is not None
    
    if is_duplicate:
        return UploadResponse(
            upload_id=duplicate['id'],
            filename=file.filename,
            status="duplicate",
            is_duplicate=True,
            message=f"Identical log already exists (ID: {duplicate['id']}). Using cached results."
        )
    
    # Add to database
    upload_id = db.add_upload(file.filename, log_hash, len(content))
    
    # Background task: redact and analyze
    background_tasks.add_task(
        process_log_analysis,
        upload_id=upload_id,
        log_content=log_content,
        log_hash=log_hash
    )
    
    return UploadResponse(
        upload_id=upload_id,
        filename=file.filename,
        status="pending",
        is_duplicate=False,
        message="File uploaded successfully. Analysis in progress..."
    )

def process_log_analysis(upload_id: int, log_content: str, log_hash: str):
    """Background task to process log analysis."""
    try:
        # Check cache first
        cached_response = db.get_cached_response(log_hash)
        if cached_response:
            analysis = cached_response
            db.update_upload(upload_id, "completed", analysis, analysis.get("severity_rating", 1))
            return
        
        # Redact sensitive data
        redacted_log, redaction_stats = redactor.redact(log_content)
        
        # Analyze with AI
        analysis = ai_analyzer.analyze_log(redacted_log)
        
        # Cache the response
        db.cache_response(log_hash, redacted_log, analysis)
        
        # Update database
        db.update_upload(upload_id, "completed", analysis, analysis.get("severity_rating", 1))
        
    except Exception as e:
        # Update with error status
        error_response = {
            "issue_type": "Analysis Failed",
            "root_cause": str(e),
            "suggested_fix": "Please check the log format and try again",
            "severity_rating": 0
        }
        db.update_upload(upload_id, "failed", error_response, 0)

@app.get("/uploads", response_model=List[UploadData], tags=["Dashboard"])
async def get_uploads():
    """Get all uploaded logs with their analysis status."""
    uploads = db.get_all_uploads()
    
    result = []
    for upload in uploads:
        upload_data = UploadData(
            id=upload['id'],
            filename=upload['filename'],
            upload_time=upload['upload_time'],
            file_size=upload['file_size'],
            status=upload['status'],
            severity=upload['severity'],
            results=json.loads(upload['results']) if upload['results'] else None
        )
        result.append(upload_data)
    
    return result

@app.get("/uploads/{upload_id}", tags=["Dashboard"])
async def get_upload_detail(upload_id: int):
    """Get detailed information about a specific upload."""
    upload = db.get_upload_by_id(upload_id)
    
    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")
    
    return {
        "id": upload['id'],
        "filename": upload['filename'],
        "upload_time": upload['upload_time'],
        "file_size": upload['file_size'],
        "status": upload['status'],
        "severity": upload['severity'],
        "results": json.loads(upload['results']) if upload['results'] else None
    }

@app.delete("/uploads/{upload_id}", tags=["Dashboard"])
async def delete_upload(upload_id: int):
    """Delete an upload record."""
    upload = db.get_upload_by_id(upload_id)
    
    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")
    
    db.delete_upload(upload_id)
    
    return {"message": "Upload deleted successfully", "upload_id": upload_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
