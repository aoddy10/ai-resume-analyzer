import pytest
from app.services import jd_matcher

def test_calculate_match_score_similarity():
    """
    Test that calculate_match_score returns a reasonable score based on similarity.
    """
    resume_text = "Experienced backend Python developer with FastAPI and REST API design."
    jd_text = "Hiring backend developers with strong Python and FastAPI experience."
    score = jd_matcher.calculate_match_score(resume_text, jd_text)

    assert isinstance(score, float)
    assert 0 <= score <= 100
    assert score > 35  # loosely similar text

def test_calculate_match_score_dissimilar():
    """
    Test score drops when resume and JD are unrelated.
    """
    resume_text = "Professional painter experienced with oil and acrylic."
    jd_text = "Looking for a machine learning engineer skilled in TensorFlow."
    score = jd_matcher.calculate_match_score(resume_text, jd_text)

    assert isinstance(score, float)
    assert 0 <= score <= 100
    assert score < 20  # unrelated text should yield low score

def test_generate_gap_feedback_with_mock(monkeypatch):
    """
    Mock GPT feedback to avoid calling the real API.
    """
    def fake_feedback(resume, jd):
        return "- Add more backend-related projects\n- Emphasize FastAPI experience"

    monkeypatch.setattr(jd_matcher, "generate_gap_feedback", fake_feedback)

    resume_text = "Python developer with general experience."
    jd_text = "We need a FastAPI expert with cloud deployment skills."

    feedback = jd_matcher.generate_gap_feedback(resume_text, jd_text)
    assert isinstance(feedback, str)
    assert "FastAPI" in feedback or "project" in feedback