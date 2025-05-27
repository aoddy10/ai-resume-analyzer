from fastapi import APIRouter, UploadFile, File, Form
from app.services import pdf_parser, gpt_feedback, jd_matcher

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
    feedback = gpt_feedback.generate_resume_feedback(extracted_text)

    return {
        "filename": file.filename,
        "resume_text": extracted_text,
        "gpt_feedback": feedback
    }


@router.post("/match")
async def match_resume_to_jd(
    resume: UploadFile = File(...),
    jd_text: str = Form(...)
):
    """
    Upload resume + JD and return match score and improvement suggestions
    """
    resume_content = await resume.read()
    resume_text = pdf_parser.extract_text_from_pdf(resume_content)

    score = jd_matcher.calculate_match_score(resume_text, jd_text)
    suggestions = jd_matcher.generate_gap_feedback(resume_text, jd_text)

    return {
        "match_score": score,
        "suggestions": suggestions
    }