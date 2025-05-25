from fastapi import APIRouter, UploadFile, File
from services import pdf_parser

router = APIRouter()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload a resume PDF and extract its text content using PyMuPDF.

    Parameters:
    - file (UploadFile): The uploaded resume file.

    Returns:
    - dict: Contains extracted text from the PDF.
    """
    content = await file.read()
    extracted_text = pdf_parser.extract_text_from_pdf(content)
    return {
        "filename": file.filename,
        "text": extracted_text
    }