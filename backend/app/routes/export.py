"""FastAPI router for exporting results"""

from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse, PlainTextResponse
from app.services.export_service import ExportService
from urllib.parse import unquote
from pydantic import BaseModel

router = APIRouter()

class FeedbackRequest(BaseModel):
    resume_feedback: dict
    jdmatch_feedback: dict 
    match_score: float

@router.post("/export/pdf")
def export_pdf(feedback_request: FeedbackRequest):
    """Return a PDF file with feedback"""

    
    pdf = ExportService.generate_pdf(
        feedback_request.resume_feedback,
        feedback_request.jdmatch_feedback,
        feedback_request.match_score
    )
    return StreamingResponse(pdf, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=result.pdf"})

@router.post("/export/md")
def export_md(feedback_request: FeedbackRequest):
    """Return a Markdown file with feedback"""
    md = ExportService.generate_md(
        feedback_request.resume_feedback,
        feedback_request.jdmatch_feedback, 
        feedback_request.match_score
    )
    return PlainTextResponse(md, media_type="text/markdown")
