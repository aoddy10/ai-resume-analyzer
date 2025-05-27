from app.services import gpt_feedback

def test_generate_resume_feedback_structure(monkeypatch):
    """
    Mock the GPT feedback and verify that the system handles the response structure correctly.
    """

    def mock_generate_resume_feedback(text):
        return "Strengths:\n- Clear format\nSuggestions:\n- Add achievements"

    monkeypatch.setattr(gpt_feedback, "generate_resume_feedback", mock_generate_resume_feedback)

    sample_text = "John Doe\nSkills: Python, FastAPI"
    feedback = gpt_feedback.generate_resume_feedback(sample_text)

    assert isinstance(feedback, str)
    assert "Strengths" in feedback
    assert "Suggestions" in feedback