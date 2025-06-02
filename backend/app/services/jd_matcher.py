from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import openai
import os
from openai import OpenAI

# Load OpenAI API Key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def calculate_match_score(resume_text: str, jd_text: str) -> float:
    """
    Compute a similarity score between resume and job description using TF-IDF and cosine similarity.

    Parameters:
    - resume_text (str): The extracted text from the resume
    - jd_text (str): The job description text

    Returns:
    - float: Similarity score as a percentage (0–100)
    """
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([resume_text, jd_text])
    similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])
    return round(float(similarity[0][0]) * 100, 2)

def generate_gap_feedback(resume_text: str, jd_text: str) -> str:
    """
    Use GPT-4 to suggest improvements to the resume based on job description comparison.

    Parameters:
    - resume_text (str): The extracted text from the resume
    - jd_text (str): The job description text

    Returns:
    - str: GPT-generated suggestions for resume improvement
    """
    prompt = f"""
You are a career advisor. Compare the following resume and job description, and give 3 suggestions to improve the resume to match the JD.

Resume:
\"\"\"
{resume_text}
\"\"\"

Job Description:
\"\"\"
{jd_text}
\"\"\"

Respond in numbered bullet points like:
1. ...
2. ...
3. ...
    """

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert resume evaluator."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )
    return response.choices[0].message.content or "No suggestions generated."