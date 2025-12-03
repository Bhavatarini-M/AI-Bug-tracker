import sqlite3
from datetime import datetime
from typing import List, Dict, Optional
import json

class Database:
    """SQLite database handler for logs and cache."""
    
    def __init__(self, db_path: str = "./logs.db"):
        self.db_path = db_path
        self.init_db()
    
    def get_connection(self):
        """Get database connection."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_db(self):
        """Initialize database schema."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Uploads table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS uploads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                original_hash TEXT UNIQUE NOT NULL,
                file_size INTEGER NOT NULL,
                upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'pending',
                results JSON,
                severity INTEGER,
                UNIQUE(original_hash)
            )
        ''')
        
        # Cache table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cache (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                log_hash TEXT UNIQUE NOT NULL,
                redacted_log TEXT NOT NULL,
                ai_response JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_upload(self, filename: str, hash_value: str, file_size: int) -> int:
        """Add new upload record."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO uploads (filename, original_hash, file_size, status)
            VALUES (?, ?, ?, 'pending')
        ''', (filename, hash_value, file_size))
        
        conn.commit()
        upload_id = cursor.lastrowid
        conn.close()
        
        return upload_id
    
    def get_upload_by_hash(self, hash_value: str) -> Optional[Dict]:
        """Check if log with same hash exists (duplicate)."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM uploads WHERE original_hash = ?', (hash_value,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return dict(row)
        return None
    
    def get_all_uploads(self) -> List[Dict]:
        """Get all uploads."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM uploads ORDER BY upload_time DESC')
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def get_upload_by_id(self, upload_id: int) -> Optional[Dict]:
        """Get specific upload by ID."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM uploads WHERE id = ?', (upload_id,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return dict(row)
        return None
    
    def update_upload(self, upload_id: int, status: str, results: Dict, severity: int):
        """Update upload with analysis results."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE uploads
            SET status = ?, results = ?, severity = ?
            WHERE id = ?
        ''', (status, json.dumps(results), severity, upload_id))
        
        conn.commit()
        conn.close()
    
    def delete_upload(self, upload_id: int):
        """Delete upload record."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM uploads WHERE id = ?', (upload_id,))
        
        conn.commit()
        conn.close()
    
    def get_cached_response(self, log_hash: str) -> Optional[Dict]:
        """Get cached AI response for similar log."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT ai_response FROM cache WHERE log_hash = ?
        ''', (log_hash,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return json.loads(row[0])
        return None
    
    def cache_response(self, log_hash: str, redacted_log: str, ai_response: Dict):
        """Cache AI response."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO cache (log_hash, redacted_log, ai_response)
                VALUES (?, ?, ?)
            ''', (log_hash, redacted_log, json.dumps(ai_response)))
            conn.commit()
        except sqlite3.IntegrityError:
            pass  # Already cached
        finally:
            conn.close()
