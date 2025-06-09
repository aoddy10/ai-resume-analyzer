import os
from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import AsyncMock, patch, Mock
import pytest

client = TestClient(app)

def test_upload_resume_with_mock(client, mock_gpt):
    """
    Upload resume and expect mocked GPT feedback.
    """
    file_path = os.path.join(os.path.dirname(__file__), "sample_resume.pdf")
    with open(file_path, "rb") as f:
        response = client.post(
            "/api/upload",
            files={"file": ("sample_resume.pdf", f, "application/pdf")}
        )

    assert response.status_code == 200
    data = response.json()
    assert "resume_text" in data
    assert data["gpt_feedback"] == "Mocked GPT Feedback"

from app.routes.upload import upload_resume

@pytest.mark.asyncio
async def test_upload_resume():
    mock_pdf_parser = Mock()
    mock_pdf_parser.extract_text_from_pdf.return_value = "Mocked JD Text"

    mock_jd_matcher = AsyncMock()
    mock_jd_matcher.calculate_match_score.return_value = 85.0
    mock_jd_matcher.generate_gap_feedback.return_value = ["Suggestion 1", "Suggestion 2"]

    from fastapi import UploadFile
    from io import BytesIO

    mock_file = UploadFile(filename="mock_resume.pdf", file=BytesIO(b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF"))

    with patch("app.routes.upload.pdf_parser", mock_pdf_parser), \
         patch("app.services.jd_matcher", mock_jd_matcher):
        response = await upload_resume(mock_file)

        assert response["filename"] == "mock_resume.pdf"
        assert response["resume_text"] == "Mocked JD Text"
        assert "gpt_feedback" in response

def test_upload_resume_endpoint():
    files = {"file": ("resume.pdf", b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nstream\nValid Resume Content\nendstream\nendobj\n", "application/pdf")}

    response = client.post("/api/upload", files=files)
    assert response.status_code == 200
    assert "resume_text" in response.json()
    assert "gpt_feedback" in response.json()