### **🚀 AI Code Copilot — Full-Stack Code Generation Assistant**

A full-stack web application that generates code from natural language prompts using the **Hugging Face Router API**, featuring a **React + Vite frontend**, **Express.js backend**, and **PostgreSQL + Prisma ORM** with persistent history and pagination.

This project is built for the **AutomationEdge Assignment (Code Copilot)** and satisfies all required evaluation criteria.

---

## **📍 Live Demo**

| Service         | Platform | URL                                                                            |
| --------------- | -------- | ------------------------------------------------------------------------------ |
| **Frontend**    | Vercel   | *[https://code-copilot-32tt.vercel.app](https://code-copilot-32tt.vercel.app)* |
| **Backend API** | Render   | *[https://code-copilot.onrender.com](https://code-copilot.onrender.com)*       |

To connect frontend → backend, set:

```
VITE_BACKEND_URL="https://code-copilot.onrender.com"
```

---

## **📌 Assignment Requirement Mapping**

| Requirement (from PDF)             | Status                              |
| ---------------------------------- | ----------------------------------- |
| Prompt input + language selection  | ✔                                   |
| Generate via backend + real AI API | ✔ HuggingFace Router                |
| Syntax-highlighted output          | ✔ Prism themes                      |
| Paginated history view             | ✔ DB paginated                      |
| Copy to clipboard                  | ✔ Output + history                  |
| Relational DB + schema + FK        | ✔ User → Generations                |
| Migration scripts included         | ✔ Prisma migrations                 |
| ER diagram                         | ✔ Mermaid                           |
| Complexity analysis                | ✔ Included below                    |
| Deployment                         | ✔ Frontend + Backend live           |
| Demo video                         | ✔ link Attached Below

---

## **🚀 Features**

### 🔹 Core

* AI-powered code generation
* Supports **JavaScript, Python, Java, C++, Go, Rust**
* Clean 2-pane UI (prompt → code preview)
* Syntax highlighting with dynamic themes
* Fully responsive (mobile & desktop)
* Dark/Light mode toggle (Tailwind `"class"` strategy)

### 🔹 Persistence & History

* Stores all generations in PostgreSQL
* Paginated display (`limit + skip`)
* Copy-to-clipboard support
* Timestamp, language, prompt stored
* Search/filter ready (DB indexed)

### 🔹 Architecture

* Prisma schema + migrations
* REST API (`/api/generate`, `/api/history`)
* Modular routing + controller structure
* Environment-based config

---

## **🛠 Tech Stack**

| Layer              | Tools                                               |
| ------------------ | --------------------------------------------------- |
| Frontend           | React (Vite), Tailwind, Axios, Lucide               |
| Backend            | Node.js, Express.js                                 |
| DB & ORM           | PostgreSQL + Prisma                                 |
| AI Model           | Hugging Face — `swiss-ai/Apertus-70B-Instruct-2509` |
| Syntax Highlighter | Prism (`vscDarkPlus` + `oneLight`)                  |

---

## **⚙ Setup Instructions**

### **🔧 Backend Setup**

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=3001
DATABASE_URL="postgresql://postgres:password@localhost:5432/code_copilot"
HF_API_KEY="your_key"
HF_MODEL="swiss-ai/Apertus-70B-Instruct-2509"
HF_PROVIDER="publicai"
```

Run migrations:

```bash
npx prisma migrate deploy
```

Start backend:

```bash
npm start
```

---

### **🎨 Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

---

## **📂 Database Schema**

```prisma
model User {
  id          Int          @id @default(autoincrement())
  username    String       @unique
  generations Generation[]
  createdAt   DateTime     @default(now())
}

model Generation {
  id        Int      @id @default(autoincrement())
  prompt    String
  language  String
  code      String   @db.Text
  timestamp DateTime @default(now())
  userId    Int

  user      User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([timestamp])
}
```

---

## **📊 ER Diagram**

```mermaid
erDiagram
    USER ||--o{ GENERATION : "has many"

    USER {
      INT id PK
      STRING username
      DATETIME createdAt
    }

    GENERATION {
      INT id PK
      TEXT prompt
      STRING language
      TEXT code
      DATETIME timestamp
      INT userId FK
    }
```

---

## **⏱ Complexity & Performance Analysis**

| Topic                     | Explanation                                     |
| ------------------------- | ----------------------------------------------- |
| **Pagination Complexity** | `O(log n + k)` due to indexed timestamp + limit |
| **Why Indexes?**          | Faster sorting + range queries for history feed |
| **Schema Advantages**     | Normalized (User→Generation) avoids duplication |
| **Foreign Key Use**       | Ensures referential integrity + user isolation  |
| **Code storage**          | `TEXT` used to support large code blocks        |

Indexes created:

| Index                  | Purpose           |
| ---------------------- | ----------------- |
| `@@index([timestamp])` | Fast pagination   |
| `@@index([userId])`    | Quick user lookup |

---

## **🔌 API Reference**

### **POST /api/generate**

```json
{
  "prompt": "Write binary search in Python",
  "language": "Python"
}
```

### **GET /api/history?page=1&limit=5**

Returns paginated history.

---

## **📹 Demo Video (Required)**

> ⏳ Will attach during final submission
> *(2–3 min walkthrough: prompt → generate → DB insert → history view → pagination)*

---

## **🚧 Future Enhancements**

* Authentication + per-user history
* Favorite/star saved code
* Filter by language + search box
* Download snippet as file
* Execute code inside browser (WebContainers)

---