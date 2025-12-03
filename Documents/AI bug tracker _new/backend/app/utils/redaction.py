import re
from typing import Dict, Tuple

class LogRedactor:
    """
    Redacts sensitive information from logs before sending to AI.
    """
    
    # Regex patterns for different types of sensitive data
    PATTERNS = {
        'file_paths': r'([A-Za-z]:)?[\/\\]([A-Za-z0-9._-]+[\/\\])*[A-Za-z0-9._-]+',
        'ipv4': r'\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b',
        'ipv6': r'(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}',
        'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        'api_keys': r'(?:api[_-]?key|apikey|api_secret|secret_key|access_token|token)\s*[=:]\s*["\']?([A-Za-z0-9_\-\.]+)["\']?',
        'urls': r'https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&/=]*)',
        'usernames': r'(?:user|username|login|user_id|uid)\s*[=:]\s*["\']?([A-Za-z0-9_\-\.]+)["\']?',
        'passwords': r'(?:password|passwd|pwd|secret|pass)\s*[=:]\s*["\']?([^\s"\']+)["\']?',
        'timestamps': r'\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?',
        'credit_cards': r'\b(?:\d{4}[-\s]?){3}\d{4}\b',
        'phone_numbers': r'\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b',
    }

    REPLACEMENTS = {
        'file_paths': '[FILE_PATH_REDACTED]',
        'ipv4': '[IP_REDACTED]',
        'ipv6': '[IPv6_REDACTED]',
        'email': '[EMAIL_REDACTED]',
        'api_keys': '[API_KEY_REDACTED]',
        'urls': '[URL_REDACTED]',
        'usernames': '[USERNAME_REDACTED]',
        'passwords': '[PASSWORD_REDACTED]',
        'timestamps': '[TIMESTAMP_REDACTED]',
        'credit_cards': '[CC_REDACTED]',
        'phone_numbers': '[PHONE_REDACTED]',
    }

    @classmethod
    def redact(cls, text: str) -> Tuple[str, Dict[str, int]]:
        """
        Redacts sensitive information from text.
        Returns tuple of (redacted_text, statistics)
        """
        redacted_text = text
        stats = {}

        for key, pattern in cls.PATTERNS.items():
            matches = re.finditer(pattern, redacted_text, re.IGNORECASE)
            count = 0
            for match in matches:
                count += 1
            
            if count > 0:
                redacted_text = re.sub(pattern, cls.REPLACEMENTS[key], redacted_text, flags=re.IGNORECASE)
                stats[key] = count

        return redacted_text, stats

    @classmethod
    def get_redaction_report(cls, original: str, redacted: str) -> Dict:
        """
        Generates a report of what was redacted.
        """
        _, stats = cls.redact(original)
        return {
            'total_redactions': sum(stats.values()),
            'by_type': stats
        }
