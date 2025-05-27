# 🧠 AI Resume Analyzer

A GPT-powered application that analyzes resumes, matches them against job descriptions, and provides improvement suggestions — using semantic search and natural language generation.

![Tech Stack](https://img.shields.io/badge/Tech-FastAPI%20%7C%20OpenAI%20%7C%20TfidfVectorizer%20%7C%20Docker-blue)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

---

## 🚀 Features

-   📄 Upload PDF resumes
-   🔍 Extract skills, experience, and education using NLP
-   📊 Match resume against job descriptions and calculate a similarity score
-   ✨ Get GPT-powered suggestions to improve resume for specific JD
-   🧪 Fully tested backend with mocked GPT feedback
-   📦 Dockerized backend service (frontend coming soon)

---

## 🧱 Tech Stack

| Layer     | Tech                                             |
| --------- | ------------------------------------------------ |
| Backend   | FastAPI, Python                                  |
| AI        | OpenAI GPT-4, TfidfVectorizer, Cosine Similarity |
| Parsing   | PyMuPDF                                          |
| Testing   | Pytest, Monkeypatch, TestClient                  |
| Container | Docker + Docker Compose                          |

---

## 📎 API Endpoints

### `POST /api/upload`

Upload a resume (PDF), parse content, and get GPT feedback.

**FormData**:

-   `file`: PDF resume

**Response**:

```json
{
    "filename": "resume.pdf",
    "resume_text": "...",
    "gpt_feedback": "- Add more backend experience..."
}
```

---

### `POST /api/match`

Match resume against a job description and receive suggestions.

**FormData**:

-   `resume`: PDF resume
-   `jd_text`: Job description (text)

**Response**:

```json
{
    "match_score": 84.67,
    "suggestions": "- Emphasize FastAPI experience"
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
```

> ✏️ Copy `.env.example` → `.env` and add your OpenAI API key, etc.

---

## 📄 License

MIT License © 2025 Anirut Puangkingkaew
