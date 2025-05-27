from app.services import pdf_parser
import os

def test_extract_text_from_pdf():
    """
    Test extracting text from a sample PDF using PyMuPDF.
    """
    file_path = os.path.join(os.path.dirname(__file__), "sample_resume.pdf")
    with open(file_path, "rb") as f:
        content = f.read()

    text = pdf_parser.extract_text_from_pdf(content)

    assert isinstance(text, str)
    assert "John Doe" in text
    assert "Skills" in text
    assert "Education" in text