import hashlib
import os
from typing import Dict
from openai import OpenAI
import json

class AIAnalyzer:
    """OpenAI integration for log analysis."""
    
    def __init__(self, api_key: str = None, model: str = "gpt-4o"):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model = model
        self.client = OpenAI(api_key=self.api_key)
    
    @staticmethod
    def generate_hash(text: str) -> str:
        """Generate SHA-256 hash of text."""
        return hashlib.sha256(text.encode()).hexdigest()
    
    def analyze_log(self, redacted_log: str) -> Dict:
        """
        Analyze log using OpenAI.
        Returns: {issue_type, root_cause, suggested_fix, severity_rating, timestamp}
        """
        
        prompt = f"""Analyze the following error log and provide:
1. Issue Type (brief category)
2. Root Cause (detailed explanation)
3. Suggested Fix (actionable solution)
4. Severity Rating (1-5, where 5 is critical)

Respond in JSON format with keys: issue_type, root_cause, suggested_fix, severity_rating

Log:
{redacted_log}

Please provide only valid JSON without any markdown formatting or code blocks."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert debugging assistant. Analyze error logs and provide technical solutions in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            response_text = response.choices[0].message.content.strip()
            
            # Try to parse JSON response
            analysis = json.loads(response_text)
            
            # Ensure all required fields exist
            result = {
                "issue_type": analysis.get("issue_type", "Unknown"),
                "root_cause": analysis.get("root_cause", "Unable to determine"),
                "suggested_fix": analysis.get("suggested_fix", "No fix available"),
                "severity_rating": min(5, max(1, int(analysis.get("severity_rating", 2)))),
                "timestamp": None
            }
            
            return result
            
        except json.JSONDecodeError:
            return {
                "issue_type": "Parse Error",
                "root_cause": "Failed to parse AI response",
                "suggested_fix": "Check log format and try again",
                "severity_rating": 3,
                "timestamp": None
            }
        except Exception as e:
            return {
                "issue_type": "Analysis Error",
                "root_cause": str(e),
                "suggested_fix": "Check API key and try again",
                "severity_rating": 3,
                "timestamp": None
            }
