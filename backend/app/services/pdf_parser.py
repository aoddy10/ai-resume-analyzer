import fitz  # PyMuPDF

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text content from a PDF file provided as bytes.

    Parameters:
    - file_bytes (bytes): The raw binary content of the PDF file.

    Returns:
    - str: The extracted plain text from all pages of the PDF.
    """
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            # Concatenate text from each page
            text += page.get_text()
    return text