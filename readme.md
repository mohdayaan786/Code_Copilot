## **⚡ AI Code Copilot**

A full-stack web application that generates code snippets using natural-language prompts powered by the **OpenAI API**. It features a **React + Vite** frontend, **Express.js backend**, and a **PostgreSQL database** managed with **Prisma ORM**, storing and paginating all past generations.

---

### **🚀 Features**

* **AI-Powered Code Generation** — Supports Python, JavaScript, C++, Go, Rust, and Java
* **Syntax Highlighting** — Beautiful formatted output for readability
* **History Tracking** — Stores generations in a relational DB
* **Pagination** — Efficient page-wise loading of past results
* **Responsive UI** — Tailwind CSS for seamless mobile + desktop UX

---

### **🛠 Tech Stack**

| Layer        | Technologies                                    |
| ------------ | ----------------------------------------------- |
| **Frontend** | React (Vite), Tailwind CSS, Axios, Lucide React |
| **Backend**  | Node.js, Express.js                             |
| **Database** | PostgreSQL                                      |
| **ORM**      | Prisma                                          |
| **AI Model** | OpenAI API (gpt-3.5-turbo)                      |

---

## **⚙️ Setup Instructions**

### **📌 Prerequisites**

* Node.js (v16+)
* PostgreSQL installed & running
* OpenAI API Key

---

### **🗄 1️⃣ Database Setup**

Create a new database:

```sql
CREATE DATABASE code_copilot;
```

---

### **🔧 2️⃣ Backend Setup**

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3001
DATABASE_URL="postgresql://postgres:password@localhost:5432/code_copilot?schema=public"
OPENAI_API_KEY="sk-your-openai-api-key-here"
```

Run migrations:

```bash
npx prisma db push
```

Start backend:

```bash
npm run dev
```

📍 Runs at `http://localhost:3001`

---

### **🎨 3️⃣ Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

Visit:

```
http://localhost:5173
```

---

## **📊 Database Design & Complexity Analysis**

### **📁 Schema Architecture**

The app uses a **normalized relational schema** with two core entities:

#### **User Table**

Stores user identity (minimal for demo purposes).

#### **Generation Table**

Stores: prompt → language → generated code → timestamp

---

### **🧬 Entity–Relationship Diagram**

```mermaid
erDiagram
    %% Entity definitions based on requirements
    USER {
        INT id PK "Primary Key"
        VARCHAR username "Minimal user detail"
    }

    GENERATION {
        INT id PK "Primary Key"
        TEXT prompt "The natural-language input [cite: 24]"
        VARCHAR language "The chosen programming language [cite: 25]"
        TEXT code "The AI-generated code output [cite: 26]"
        DATETIME timestamp "Time of generation [cite: 27]"
        INT user_id FK "Foreign Key referencing USER "
    }

    %% Relationship definition
    %% A User creates zero or many Generations (One-to-Many relationship)
    USER ||--o{ GENERATION : "creates and views history of"

```
---

### **🧮 Performance & Indexing**

| Topic                     | Explanation                    |
| ------------------------- | ------------------------------ |
| **Pagination Complexity** | Indexed search: `O(log N + K)` |
| **Without Index**         | Full table scan: `O(N)`        |
| **Schemas Normalized?**   | Yes — reduces redundancy       |
| **Foreign Key Impact**    | Ensures referential integrity  |

#### **Indexes Created**

| Index                  | Purpose                       |
| ---------------------- | ----------------------------- |
| `@@index([timestamp])` | Fast sorting for history feed |
| `@@index([userId])`    | Lookup generations by user    |

---

## **🔌 API Documentation**

---

### **📍 1. Generate Code**

```
POST /api/generate
```

**Body:**

```json
{
  "prompt": "Write a binary search function",
  "language": "Python"
}
```

**Returns**

* Generated code
* Metadata
* Stored DB entry

---

### **📍 2. Fetch History**

```
GET /api/history?page=1&limit=5
```

**Response:**

```json
{
  "data": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 5,
    "totalPages": 10
  }
}
```

---

## **📂 Project Structure**

```
/
├── backend/
│   ├── prisma/         # Schema + migrations
│   ├── src/
│   │   ├── routes/     # REST API endpoints
│   │   └── index.js    # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/ # UI components
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## **🤝 Contributing**

Pull requests are welcome! Create a branch:

```bash
git checkout -b feature-name
```

---

## **📜 License**

MIT — free for personal & commercial use.

---