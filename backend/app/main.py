# FastAPI main app entry point

from fastapi import FastAPI
from app.routes import upload

app = FastAPI()

# Include the upload route under /api prefix
app.include_router(upload.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
