# 🧠 AI Resume Analyzer

A GPT-powered application that analyzes resumes, matches them against job descriptions, and provides improvement suggestions — using semantic search and natural language generation.

![Tech Stack](https://img.shields.io/badge/Tech-FastAPI%20%7C%20OpenAI%20%7C%20TfidfVectorizer%20%7C%20Docker-blue)
![Status](https://img.shields.io/badge/Status-Backend%20%2B%20Frontend%20Core%20Completed-yellow)

---

## 🚀 Features

-   📄 Upload PDF resumes
-   🔍 Extract skills, experience, and education using NLP
-   📊 Match resume against job descriptions with similarity scoring
-   ✨ Get GPT-powered suggestions and GAP feedback for better alignment with job descriptions
-   📁 Upload JD and resume for AI-based compatibility matching
-   🧪 Fully tested backend with mocked GPT feedback
-   💻 Modern, responsive frontend with Hero, Features, and Resume Upload sections
-   📦 Dockerized backend and frontend with shared environment support
-   📤 Show real-time progress bar and loading state during file upload
-   🧾 Preview uploaded PDF and display GPT feedback from backend

---

## 🧱 Tech Stack

| Layer     | Tech                                                    |
| --------- | ------------------------------------------------------- |
| Frontend  | Next.js, TypeScript, Tailwind CSS, ShadCN, Lucide Icons |
| Backend   | FastAPI, Python                                         |
| AI        | OpenAI GPT-4, TfidfVectorizer, Cosine Similarity        |
| Parsing   | PyMuPDF                                                 |
| Testing   | Pytest, Monkeypatch, TestClient                         |
| Container | Docker + Docker Compose                                 |

---

## 📎 API Endpoints

### `POST /api/upload`

Upload a resume (PDF), parse content, and get GPT feedback.  
Also returns extracted resume text and displays it in the frontend UI.

**FormData**:

-   `file`: PDF resume

**Response**:

```json
{
    "filename": "Anirut_Puangkingkaew_Resume.pdf",
    "resume_text": "Anirut Puangkingkaew\nEmail: anirut.puangkingkaew@gmail.com...",
    "gpt_feedback": "Strengths of the resume:\n- The resume is highly detailed...\n\nAreas for improvement:\n- The resume could benefit from a more structured layout..."
}
```

---

### `POST /api/match`

Match resume against a job description and receive suggestions.

**FormData**:

-   `jd_file`: Job description (PDF file)
-   `resume_text`: Extracted resume text from previous step

**Response**:

```json
{
    "match_score": 84.67,
    "gap_feedback": "1. Highlight Agile Experience...\n2. Emphasize Cloud-Based AI Services Experience...\n3. Specify Soft Skills..."
}
```

---

## 🧪 Running Tests

```bash
pytest
```

Tests include:

-   PDF parser validation
-   GPT feedback with monkeypatch
-   JD matching and score accuracy
-   Full upload & match flow

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tests/
│   │   └── utils/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   └── pages/
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🛠 Local Setup

```bash
git clone https://github.com/aoddy10/ai-resume-analyzer.git
cd ai-resume-analyzer
docker-compose up --build
# Access the frontend at http://localhost:3000
```

> ✏️ Copy `.env.example` → `.env` and add your OpenAI API key, etc.

---

## 📄 License

MIT License © 2025 Anirut Puangkingkaew
