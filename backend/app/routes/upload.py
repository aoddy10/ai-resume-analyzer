from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload a PDF resume file and return basic file metadata.

    Parameters:
    - file (UploadFile): The PDF file sent by the user.

    Returns:
    - dict: Dictionary containing filename and file size in bytes.
    """
    # Read the uploaded file content as bytes
    content = await file.read()

    # Return filename and size of the uploaded file
    return {
        "filename": file.filename,
        "size": len(content)
    }
