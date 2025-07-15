# 🚀 Micro Task and Earning Platform

An advanced micro-tasking platform inspired by sites like Picoworkers and Clickworker, allowing Workers to earn coins for completing tasks, Buyers to hire and pay workers, and Admins to manage the entire platform.

---

## 🌐 Live Site & GitHub Links

- 🔗 **Live Site**: [https://mini-hive-client.web.app/](https://mini-hive-client.web.app/)  
- 💻 **Client Repository**: [Client GitHub](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-Kaniz-Naiba)  
- ⚙️ **Server Repository**: [Server GitHub](https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-Kaniz-Naiba)

---

## 🧑‍💼 Admin Credentials

Email: naiba@gmail.com
Password: n3lmn3lm


---

## 📌 Features

- 🔒 Secure Authentication using Firebase and Google login with protected routes.
- 🧑‍💼 Role-based Dashboard for Worker, Buyer, and Admin with dynamic navigation and route control.
- 🪙 Coin-Based System for payments and withdrawals, including auto coin logic on registration.
- 📦 Task Management: Buyers can add, update, and delete tasks with validation.
- ✅ Submission Workflow: Workers submit proof, Buyers approve/reject, Admin oversees.
- 💸 Coin Withdrawal for Workers with 20 coins = $1 and limit logic (minimum 200 coins).
- 💳 Stripe Payment Integration for Buyers to purchase coins (with demo cards).
- 📈 Stats and Analytics on all dashboards: total earnings, submissions, tasks, and users.
- 🧾 Payment & Withdrawal History tracking with live updates and table views.
- 🔔 Notification System for task approvals, withdrawals, and submissions.
- 🖼️ Image Upload via ImgBB on Registration and Add Task form.
- 📱 Fully Responsive UI for mobile, tablet, and desktop.
- 🔐 Token and Role-Based Middleware with 401, 403, 400 handling.
- 💬 Static Testimonial Slider and Best Worker showcase on Home using Swiper.
- 🎉 Confetti Animations for a delightful user experience on login/register pages.

---

## 🛠️ Tech Stack

| Client Side          | Server Side            |
|----------------------|------------------------|
| React + Vite         | Express.js             |
| React Router         | MongoDB + Mongoose     |
| Firebase Auth        | JWT (Token-based Auth) |
| React Hook Form      | Stripe Integration     |
| React Toastify       | dotenv + cors          |
| Tailwind CSS         | Express Middleware     |
| AOS + Swiper         |                        |

---

## ⚙️ Setup Instructions

### 🚀 Client Setup

```bash
git clone https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-Kaniz-Naiba.git
cd client
npm install
npm run dev
