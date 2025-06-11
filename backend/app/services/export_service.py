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

        # print("Generating PDF with resume feedback:", resume_feedback)
        # print("Generating PDF with JD match feedback:", jdmatch_feedback)

        def format_feedback(feedback):
            if isinstance(feedback, list):
                return "\n".join(str(item) for item in feedback)
            elif isinstance(feedback, str):
                # Check if string starts with numbered list items like "1.", "2.", etc.
                if re.match(r'^\s*\d+\.', feedback):
                    # Replace numbered list with bullet points
                    lines = feedback.strip().splitlines()
                    bullet_lines = []
                    for line in lines:
                        line = line.strip()
                        # Replace leading number and dot with bullet
                        bullet_line = re.sub(r'^\d+\.\s*', '- ', line)
                        bullet_lines.append(bullet_line)
                    return "\n".join(bullet_lines)
                else:
                    return feedback
            else:
                return ""

        def format_gap_feedback(feedback):
            """Format gap feedback by adding line breaks after each numbered item, preserving headings."""
            if not isinstance(feedback, str) or not feedback.strip():
                return ""
            # Split text by numbered list items (e.g., '1.', '2.', '3.') while keeping headings intact
            parts = re.split(r'(\n?\d+\.\s*)', feedback.strip())
            formatted_parts = []
            i = 0
            while i < len(parts):
                part = parts[i].strip()
                if re.match(r'^\d+\.$', part):
                    # This is just a number with a dot, append with next content and add newline
                    if i + 1 < len(parts):
                        content = parts[i + 1].strip()
                        formatted_parts.append(f"{part} {content}\n")
                        i += 2
                    else:
                        formatted_parts.append(f"{part}\n")
                        i += 1
                else:
                    # Could be heading or normal text
                    formatted_parts.append(part)
                    i += 1
            return "\n".join(formatted_parts).strip()

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

        print(format_feedback(get_key(resume_feedback, "Strengths")))
        print(format_feedback(get_key(resume_feedback, "Areas for Improvement")))
        print(format_feedback(get_key(resume_feedback, "Missing Information")))

        # Process gap_feedback to add line breaks after numbered items, preserving headings
        gap_feedback_raw = jdmatch_feedback.get("suggestions", "")
        # Split on headings starting with capital letter and colon, e.g. "Section Title:"
        gap_sections = re.split(r'(?=\n?[A-Z][^\n]*?:)', gap_feedback_raw)
        gap_feedback_joined = "\n\n".join(s.strip() for s in gap_sections if s.strip())
        gap_feedback_processed = format_gap_feedback(gap_feedback_joined)
        gap_feedback_html = gap_feedback_processed.replace("\n", "<br>\n")

        # Render HTML from template
        html_content = template.render(
            strengths=format_feedback(get_key(resume_feedback, "Strengths")),
            areas_for_improvement=format_feedback(get_key(resume_feedback, "Areas for Improvement")),
            missing_information=format_feedback(get_key(resume_feedback, "Missing Information")),
            gap_feedback=gap_feedback_html,
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
                return "\n".join(str(item) for item in feedback)
            elif isinstance(feedback, str):
                # Check if string starts with numbered list items like "1.", "2.", etc.
                if re.match(r'^\s*\d+\.', feedback):
                    # Replace numbered list with bullet points
                    lines = feedback.strip().splitlines()
                    bullet_lines = []
                    for line in lines:
                        line = line.strip()
                        # Replace leading number and dot with bullet
                        bullet_line = re.sub(r'^\d+\.\s*', '- ', line)
                        bullet_lines.append(bullet_line)
                    return "\n".join(bullet_lines)
                else:
                    return feedback
            else:
                return ""

        def format_gap_feedback(feedback):
            """Format gap feedback by splitting numbered items with double newlines and replacing numbers with bullets."""
            if not isinstance(feedback, str) or not feedback.strip():
                return ""
            # Replace numbered list with bullet points and split with double newlines for readability
            items = re.split(r'\n\s*\d+\.\s*', feedback.strip())
            # The first split part before first numbered item might be empty or header, keep it separate
            if items and items[0].strip() == '':
                items = items[1:]
            formatted_items = []
            for item in items:
                item = item.strip()
                if item:
                    # Add bullet at start
                    if not item.startswith('- '):
                        item = '- ' + item
                    formatted_items.append(item)
            return "\n\n".join(formatted_items)

        # Process gap feedback to add double newlines between sections based on headings
        gap_feedback_raw = gpt_feedback.get("Gap Feedback", "")
        gap_sections = re.split(r'(?=\n?[A-Z][^\n]*?:)', gap_feedback_raw)
        gap_feedback_joined = "\n\n".join(s.strip() for s in gap_sections if s.strip())
        gap_feedback_processed = format_gap_feedback(gap_feedback_joined)

        return f"""# Resume Feedback

## Strengths of the resume:
{format_feedback(gpt_feedback.get("Strengths", ""))}

## Areas for improvement:
{format_feedback(gpt_feedback.get("Areas for Improvement", ""))}

## Missing Information:
{format_feedback(gpt_feedback.get("Missing Information", ""))}

## Gap Feedback:
{gap_feedback_processed}

## JD Match Feedback:
{jdmatch_feedback.get("Feedback", "")}

---

**Match Score:** {match_score:.2f} / 100
"""
