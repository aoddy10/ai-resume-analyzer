"""Service to handle export logic (PDF/Markdown)"""

from fastapi.responses import StreamingResponse
from io import BytesIO
from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML

import os
import re

class ExportService:
    @staticmethod
    def generate_pdf(resume_feedback: dict, jdmatch_feedback: dict, match_score: float) -> BytesIO:
        """Generate a PDF file in-memory using Jinja2 and WeasyPrint"""
        # Set up Jinja2 environment
        templates_dir = os.path.join(os.path.dirname(__file__), '..', 'template')  # Corrected path
        env = Environment(
            loader=FileSystemLoader(templates_dir),
            autoescape=select_autoescape(['html', 'xml'])
        )
        template = env.get_template('resume_result.html')

        from markupsafe import escape
        def format_feedback(feedback):
            if isinstance(feedback, list):
                # Render as HTML unordered list, escaping each item
                items = [f"<li>{escape(str(item))}</li>" for item in feedback if item and str(item).strip()]
                return "<ul>" + "".join(items) + "</ul>" if items else ""
            elif isinstance(feedback, str):
                # Check if string starts with numbered list items like "1.", "2.", etc.
                if re.match(r'^\s*\d+\.', feedback):
                    # Replace numbered list with bullet points as HTML list
                    lines = feedback.strip().splitlines()
                    items = []
                    for line in lines:
                        line = line.strip()
                        # Remove leading number and dot
                        text = re.sub(r'^\d+\.\s*', '', line)
                        if text:
                            items.append(f"<li>{escape(text)}</li>")
                    return "<ul>" + "".join(items) + "</ul>" if items else ""
                else:
                    # Just escape and return as plain text
                    return escape(feedback)
            else:
                return ""


        # Mapping from logical label (Title Case) to snake_case keys in dict
        key_map = {
            "Strengths": "strengths",
            "Areas for Improvement": "areas_for_improvement",
            "Missing Information": "missing_information"
        }

        def get_key(data: dict, label: str):
            """Get value from dict using mapped key from label."""
            key = key_map.get(label, label)
            return data.get(key, "")

        # Process gap_feedback assuming 'suggestions' is a list of suggestion strings
        gap_feedback_list = jdmatch_feedback.get("suggestions", [])
        from markupsafe import escape
        if isinstance(gap_feedback_list, list):
            # Render as HTML list string
            items = [f"<li>{escape(str(s))}</li>" for s in gap_feedback_list if s and str(s).strip()]
            gap_feedback_html = "<ul>" + "".join(items) + "</ul>" if items else ""
        else:
            # fallback: treat as plain text, escape only, as a single-item list
            if gap_feedback_list and str(gap_feedback_list).strip():
                gap_feedback_html = f"<ul><li>{escape(str(gap_feedback_list))}</li></ul>"
            else:
                gap_feedback_html = ""

        # Render HTML from template
        html_content = template.render(
            strengths=format_feedback(get_key(resume_feedback, "Strengths")),
            areas_for_improvement=format_feedback(get_key(resume_feedback, "Areas for Improvement")),
            missing_information=format_feedback(get_key(resume_feedback, "Missing Information")),
            gap_feedback=gap_feedback_html,  # Now an HTML string; template should use | safe
            match_score=match_score
        )

        # Generate PDF from HTML
        output = BytesIO()
        HTML(string=html_content).write_pdf(output)
        output.seek(0)
        return output

    @staticmethod
    def generate_md(gpt_feedback: dict, jdmatch_feedback: dict, match_score: float) -> str:
        """Generate a Markdown string"""

        def format_feedback(feedback):
            if isinstance(feedback, list):
                return "\n".join(f"- {str(item)}" for item in feedback)
            elif isinstance(feedback, str):
                return feedback
            else:
                return ""

        # Mapping from logical label (Title Case) to snake_case keys in dict
        key_map = {
            "Strengths": "strengths",
            "Areas for Improvement": "areas_for_improvement",
            "Missing Information": "missing_information"
        }

        sections = [
            ("Strengths of the resume", "Strengths"),
            ("Areas for improvement", "Areas for Improvement"),
            ("Missing Information", "Missing Information"),
            ("Gap Feedback", "Gap Feedback")
        ]

        md_lines = ["# Resume Feedback", ""]

        for title, key in sections:
            md_lines.append(f"## {title}:")
            if key == "Gap Feedback":
                gap_feedback = jdmatch_feedback.get("suggestions", [])
                md_lines.append(format_feedback(gap_feedback))
            else:
                val = gpt_feedback.get(key_map.get(key, key), "")
                md_lines.append(format_feedback(val))
            md_lines.append("")

        md_lines.append("---")
        md_lines.append("")
        md_lines.append(f"**Match Score:** {match_score:.2f} / 100")
        md_lines.append("")

        return "\n".join(md_lines)
