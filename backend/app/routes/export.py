"""FastAPI router for exporting results"""

from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse, PlainTextResponse
from app.services.export_service import ExportService
from urllib.parse import unquote

router = APIRouter()

@router.get("/export/pdf")
def export_pdf(feedback: str = Query(...), match_score: float = Query(...)):
    """Return a PDF file with feedback"""
    feedback = unquote(feedback)
    pdf = ExportService.generate_pdf(feedback, match_score)
    return StreamingResponse(pdf, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=result.pdf"})

@router.get("/export/md")
def export_md(feedback: str = Query(...), match_score: float = Query(...)):
    """Return a Markdown file with feedback"""
    feedback = unquote(feedback)
    md = ExportService.generate_md(feedback, match_score)
    return PlainTextResponse(content=md, media_type="text/markdown", headers={"Content-Disposition": "attachment; filename=result.md"})
