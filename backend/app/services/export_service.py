"""Service to handle export logic (PDF/Markdown)"""

from fpdf import FPDF
from fastapi.responses import StreamingResponse
from io import BytesIO

class ExportService:
    @staticmethod
    def generate_pdf(feedback: str, match_score: float) -> BytesIO:
        """Generate a PDF file in-memory"""
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.multi_cell(0, 10, f"Resume Feedback:\n{feedback}\n\nMatch Score: {match_score}")
        
        output = BytesIO()
        pdf_output = pdf.output(dest="S")
        pdf_bytes = pdf_output.encode("latin1") if isinstance(pdf_output, str) else bytes(pdf_output)
        output.write(pdf_bytes)
        output.seek(0)
        return output

    @staticmethod
    def generate_md(feedback: str, match_score: float) -> str:
        """Generate a Markdown string"""
        return f"""# Resume Feedback

{feedback}

---

**Match Score:** {match_score}/100
"""
