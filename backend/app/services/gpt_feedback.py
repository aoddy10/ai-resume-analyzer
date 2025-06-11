import os
from openai import OpenAI
from dotenv import load_dotenv
import json

# Load .env file if it exists
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_resume_feedback(resume_text: str) -> dict:
    """
    Generate professional resume feedback using GPT-4.

    Parameters:
    - resume_text (str): The plain text extracted from a resume.

    Returns:
    - dict: GPT-generated feedback on resume quality and improvements in JSON format with keys:
      "strengths", "areas_for_improvement", "missing_information".
    """
    prompt = f"""
You are a professional career coach. Analyze the following resume content and provide feedback strictly in the following JSON format ONLY without any additional text:

{{
  "strengths": [string],
  "areas_for_improvement": [string],
  "missing_information": [string]
}}

Resume:
\"\"\"
{resume_text}
\"\"\"

Respond ONLY with the JSON object as specified.
    """

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert resume advisor."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    content = response.choices[0].message.content or "{}"
    try:
        feedback_json = json.loads(content)
    except json.JSONDecodeError:
        feedback_json = {
            "strengths": [],
            "areas_for_improvement": [],
            "missing_information": []
        }
    return feedback_json