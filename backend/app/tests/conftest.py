import pytest
from fastapi.testclient import TestClient
from app.main import app
import app.services.gpt_feedback as gpt_module

@pytest.fixture(scope="module")
def client():
    """
    Fixture for reusable FastAPI TestClient.
    """
    return TestClient(app)

@pytest.fixture
def mock_gpt(monkeypatch):
    """
    Fixture to mock GPT feedback response to avoid real API call.
    """
    def fake_feedback(_):
        return "Mocked GPT Feedback"

    monkeypatch.setattr(gpt_module, "generate_resume_feedback", fake_feedback)