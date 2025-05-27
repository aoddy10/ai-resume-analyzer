import os
from fastapi.testclient import TestClient
from app.main import app

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