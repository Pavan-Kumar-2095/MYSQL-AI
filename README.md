# 🔍 AI-Driven Natural Language to SQL Query System

This project uses **Generative AI (GenAI)** and **Large Language Models (LLMs)** to bridge the gap between **natural language** and **structured database queries**. It automatically identifies relevant tables from a database schema and generates SQL queries to retrieve actual data.


## 🧠 How It Works

1. **User Input**: A natural language question is entered  
   _Example: “What products were sold in April 2025?”_
2. **Frontend (React.js)**: Captures the query and sends it to the backend
3. **LLM Processing (Google Gemini)**: Interprets the query and generates SQL
4. **Backend (Express.js + Node.js)**: Handles API routing and query execution
5. **Database (MySQL2)**: Executes the generated SQL and returns data
6. **Result**: The frontend displays the results to the user

---

## 🛠️ Tech Stack

| Component   | Technology                    |
|------------|-------------------------------|
| Frontend   | React.js ⚛️                   |
| Backend    | Node.js + Express.js 🚀       |
| LLM Engine | Google Gemini 🤖              |
| Database   | MySQL2 🗃️                     |
