#!/usr/bin/env python3
"""
Direct runner for the FastAPI backend.
Run this script from the backend directory.
"""

import sys
import os
import uvicorn

# Add the parent directory to path for imports
# This allows importing app.* without the 'backend' prefix
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[os.path.dirname(os.path.abspath(__file__))],
    )
