# 🚀 Student Expense Tracker - MERN Stack

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer](https://img.shields.io/badge/Framer-Black?style=for-the-badge&logo=framer&logoColor=blue)

## 📌 Project Overview
The **Student Expense Tracker** is a full-stack web application designed specifically for university students to manage their personal finances, track monthly allowances, and monitor category-wise spending. 

Developed as a minor academic project, this application showcases a robust Client-Server architecture utilizing the complete MERN stack. It features a custom "Cyber-Crimson & Deep Slate" UI, integrating advanced glassmorphism, fluid animations, and real-time data visualization.

## ✨ Key Features
* **Interactive Dashboard:** Real-time calculation of Total Balance, Monthly Income, and Monthly Expenses.
* **Data Visualization:** Dynamic Donut Charts (via Recharts) displaying expenses grouped by category.
* **Full CRUD Operations:** Seamlessly Add, Read, Update, and Delete transaction records.
* **Smart Budgeting:** Dynamic Budget Progress Bar that changes color indicators (Emerald to Crimson) as spending approaches the monthly limit.
* **Premium UI/UX:** Built with Tailwind CSS, featuring frosted glass cards (`backdrop-blur`), custom glowing hover states, and premium typography (Space Grotesk & Outfit).
* **Advanced Motion:** Staggered load sequences, smooth modal popups, and exit animations powered by Framer Motion.
* **Data Export:** Built-in utility to download transaction history as a CSV file for Excel/Sheets analysis.

---

## 🛠️ System Architecture & Tech Stack

### Frontend (Client-Side)
* **Framework:** React.js (Bootstrapped with Vite for optimized build times)
* **Styling:** Tailwind CSS (Custom themes, arbitrary values for glowing shadows)
* **Motion/Animations:** Framer Motion
* **Data Visualization:** Recharts
* **HTTP Client:** Axios
* **Icons & Notifications:** Lucide-React, React-Hot-Toast

### Backend (Server-Side)
* **Runtime:** Node.js
* **Framework:** Express.js (RESTful API architecture)
* **Database:** MongoDB (Cloud Atlas)
* **ODM:** Mongoose
* **Middleware:** CORS, Express.json, Dotenv

---

## 🚦 API Endpoints

The backend exposes the following RESTful API routes under `/api/transactions`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Fetches all transactions, sorted by most recent date. |
| `POST` | `/` | Creates a new transaction record. |
| `PUT` | `/:id` | Updates an existing transaction by ID. |
| `DELETE` | `/:id` | Deletes a specific transaction by ID. |
| `GET` | `/summary` | Aggregates data for total balance and chart groupings. |

---

## 💻 Installation & Local Setup

Follow these steps to run the project locally on your machine.

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB instance)
* Git

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/student-expense-tracker.git](https://github.com/your-username/student-expense-tracker.git)
cd student-expense-tracker

### This is a complete MERN stack development project desgined and developed by Master Vaishnav Shah.
