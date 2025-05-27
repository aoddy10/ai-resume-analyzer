import os
from openai import OpenAI
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_resume_feedback(resume_text: str) -> str:
    """
    Generate professional resume feedback using GPT-4.

    Parameters:
    - resume_text (str): The plain text extracted from a resume.

    Returns:
    - str: GPT-generated feedback on resume quality and improvements.
    """
    prompt = f"""
You are a professional career coach. Analyze the following resume content and provide feedback on:
1. Strengths of the resume
2. Areas for improvement
3. Missing information (skills, achievements, formatting, etc.)

Resume:
\"\"\"
{resume_text}
\"\"\"

Respond clearly and concisely in bullet points.
    """

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert resume advisor."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    return response.choices[0].message.content or "No feedback generated."