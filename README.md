<div align="center">

# 💰 Expense Tracker

### A full-stack personal finance management app built with the MERN stack

Track income and expenses, manage custom categories, and visualise spending patterns through interactive charts and trend analysis — all wrapped in a sleek dark glassmorphism UI.

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

</div>

---

## 📸 Screenshots

### Dashboard — Financial Overview
![Dashboard](./screenshots/dashboard.png)

### Spending Trends — Area Chart Analysis
![Trends](./screenshots/trends.png)

### Categories — Income & Expense Management
![Categories](./screenshots/categories.png)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login and registration with token-based auth, password hashing with bcryptjs
- 💸 **Income & Expense Tracking** — Log transactions with amount, date, category, and description
- 🏷️ **Custom Categories** — Create, edit, and delete your own income/expense categories inline
- 🔍 **Smart Filtering** — Filter transactions by date range, type, and category
- 🍩 **Interactive Doughnut Chart** — Visual breakdown of income vs expenses per category with unique colors per expense
- 📈 **Spending Trends** — Area chart showing daily, weekly, and monthly financial patterns with income/expense toggle
- 👤 **Profile Management** — Update username, email, and change password
- 🎨 **Glassmorphism UI** — Dark navy theme with frosted glass card design

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js, Vite, Redux Toolkit, TanStack Query, Tailwind CSS |
| **Charts** | Chart.js, Recharts |
| **Forms** | Formik, Yup |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT, bcryptjs |
| **HTTP** | Axios |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### 1. Clone the repository
```bash
git clone https://github.com/sun0028/Etracker.git
cd Etracker
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/etracker
JWT_SECRET=your_secret_key_here
PORT=8000
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

---

## 📁 Project Structure
Etracker/
├── backend/
│   ├── controllers/
│   │   ├── categoryCtrl.js
│   │   ├── transactionCtrl.js
│   │   └── usersCtrl.js
│   ├── middlewares/
│   │   ├── errorHandlerMiddleware.js
│   │   └── isAuth.js
│   ├── model/
│   │   ├── Category.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── categoryRouter.js
│   │   ├── transactionRouter.js
│   │   └── userRouter.js
│   └── app.js
│
└── frontend/
└── src/
├── components/
│   ├── Auth/
│   ├── Category/
│   ├── Home/
│   ├── Navbar/
│   ├── Transactions/
│   └── Users/
├── redux/
│   └── slice/authSlice.js
├── services/
│   ├── category/categoryService.js
│   ├── transactions/transactionService.js
│   └── users/userService.js
└── utils/

---

## 🔌 API Reference

### Auth Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users/register` | ❌ | Register new user |
| POST | `/users/login` | ❌ | Login, returns JWT |
| GET | `/users/profile` | ✅ | Get user profile |
| PUT | `/users/update-profile` | ✅ | Update username/email |
| PUT | `/users/change-passwords` | ✅ | Change password |

### Category Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/categories/create` | ✅ | Create category |
| GET | `/categories/lists` | ✅ | List all categories |
| PUT | `/categories/update/:id` | ✅ | Update category |
| DELETE | `/categories/delete/:id` | ✅ | Delete category |

### Transaction Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/transactions/create` | ✅ | Add transaction |
| GET | `/transactions/lists` | ✅ | Get filtered transactions |
| PUT | `/transactions/update/:id` | ✅ | Update transaction |
| DELETE | `/transactions/delete/:id` | ✅ | Delete transaction |

---

## 🌐 Deployment

### Backend → [Render](https://render.com) (Free)
1. New Web Service → connect GitHub repo
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `node app.js`
5. Add env vars: `MONGO_URL`, `JWT_SECRET`, `PORT`

### Frontend → [Vercel](https://vercel.com) (Free)
1. Import GitHub repo
2. Root directory: `frontend`
3. Add env var: `VITE_API_URL=https://your-backend.onrender.com`
4. Deploy

---

## ⚠️ Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `MONGO_URL` | backend/.env | MongoDB Atlas connection string |
| `JWT_SECRET` | backend/.env | Secret key for JWT signing |
| `PORT` | backend/.env | Server port (default 8000) |
| `VITE_API_URL` | frontend/.env | Backend API base URL |

---

## 👩‍💻 Author

**Sonali Saini**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sun0028)

