# 📚 FlashMinds

A full-stack Flashcards web application designed to help users to create and practice flashcard sets for efficient learning. This project provides various different study modes to help users to excel in their academics.

---

## 🚀 Features

- **User Authentication & Authorization**  
  Secure user login and registration using JWT.

- **Flashcard Management**  
  Study flashcard with an intuitive interface.

- **Responsive Design**  
  Fully optimized for desktop and mobile use.

- **Build Streaks**  
  Track your streaks and achieve your learning goals.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: Angular (18.2.10)

### Backend

- **Framework**: Node.js with Express.js
- **Authentication**: JSON Web Tokens (JWT)
- **Database**: MongoDB

---

## 📦 Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) set up locally or via a cloud provider
- [Angular CLI](https://angular.io/cli) installed globally

### Backend Setup

1. Clone the backend repository:
   ```bash
   git clone <backend-repo-url>
   cd server
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a .env file and configure the following:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the server by navgiating to '/client':
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to /client:
   ```
   cd client
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   ng serve
   ```
