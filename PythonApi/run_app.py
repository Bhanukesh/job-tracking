# run_app.py

import uvicorn
import os

if __name__ == "__main__":
    # Retrieve the PORT environment variable if it exists, otherwise default to 8000
    port = int(os.environ.get("PORT", 8000))

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        workers=1, # Single worker for file-based database with thread safety
        reload=False  # Set to False in production
    )
