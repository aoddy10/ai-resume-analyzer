from app.services.export_service import ExportService

def test_generate_md():
    feedback = "Strong backend experience"
    score = 85.0
    md = ExportService.generate_md(feedback, score)
    assert "# Resume Feedback" in md
    assert "85.0" in md

def test_generate_pdf():
    pdf = ExportService.generate_pdf("Good match", 90.5)
    assert isinstance(pdf.read(), bytes)
