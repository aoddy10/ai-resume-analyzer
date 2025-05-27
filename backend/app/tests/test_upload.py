import os
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_upload_resume():
    """
    Test uploading a sample PDF resume and expect extracted text and GPT feedback.
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
    assert "gpt_feedback" in data