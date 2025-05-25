# 🧠 AI Resume Analyzer

A GPT-powered application that analyzes resumes, extracts skills, matches job descriptions, and provides improvement suggestions — all through natural language generation.

![Tech Stack](https://img.shields.io/badge/Tech-FastAPI%20%7C%20LangChain%20%7C%20OpenAI%20%7C%20React-blue)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

---

## 🚀 Features

- 📄 Upload PDF resumes with drag-and-drop
- 🔍 Extract skills, experience, and education using NLP
- 📊 Match resume against job descriptions and calculate a score
- ✨ Get GPT-powered feedback on areas for improvement
- 💬 Natural language interface for querying resume content

---

## 🧱 Tech Stack

| Layer        | Tech                         |
|--------------|-------------------------------|
| Backend      | FastAPI, LangChain, OpenAI GPT-4 |
| Frontend     | Next.js, TailwindCSS, ShadCN UI |
| Parsing      | PyMuPDF, pdfplumber           |
| Storage      | PostgreSQL + PGVector / FAISS |
| Auth         | Clerk.dev (Optional)          |
| Container    | Docker + Docker Compose       |

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
├── frontend/
│   ├── pages/
│   ├── components/
│   └── public/
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🧪 Local Setup

```bash
git clone https://github.com/aoddy10/ai-resume-analyzer.git
cd ai-resume-analyzer
docker-compose up --build
```

> ✏️ Copy `.env.example` → `.env` and add your OpenAI API key, database URL, etc.

---

## 🛣️ Roadmap

- [x] PDF Upload + Parsing
- [ ] JD Upload + Embedding Matching
- [ ] GPT Feedback Module
- [ ] Resume Visual Summary (Optional)
- [ ] Deploy to Railway / Fly.io

---

## 📸 Screenshots

> (Add demo images here showing resume input and feedback output)

---

## 📄 License

MIT License © 2025 Anirut Puangkingkaew
