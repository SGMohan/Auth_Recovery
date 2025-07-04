# 🔐 Password Reset Flow

![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-47A248?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-14+-339933?logo=node.js&logoColor=white)

A complete password reset solution with security protections built with MERN stack.

## 🌐 Live Demos
- **Frontend**: [authrecovery.netlify.app](https://authrecovery.netlify.app)
- **Backend API**: [auth-recovery.onrender.com](https://auth-recovery.onrender.com)

## 📌 Table of Contents
- [Features](#✨-features)
- [Installation](#🚀-installation)
- [API Documentation](#📚-api-documentation)
- [Environment Variables](#🔧-environment-variables)
- [Contributing](#🤝-contributing)
- [License](#📜-license)

## ✨ Features

### 🔒 Password Reset Features
- ✉️ Secure reset link generation
- ⏳ Time-limited tokens (default 15 minutes)
- 🔒 One-time use tokens
- 🛡️ Brute-force protection
- 📱 Mobile-friendly reset flow

## 🛠️ Technologies

**Frontend**:
- React 18+ - UI Framework
- TailwindCSS - Styling
- Axios - HTTP client

**Backend**:
- Node.js - Runtime environment
- Express - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication tokens
- Bcrypt - Password hashing
- Nodemailer - Email services

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ v14
- MongoDB (Local or Atlas)
- Git

### 📦 Installation
```bash

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### ⚙️ Environment Configuration


2. Create a .env file and add the following configuration
```.env
# 1. Server Configuration
PORT=3000
HOSTNAME=localhost

# Database Configuration
MONGO_URI=mongodb://localhost:27017/recipes

# JWT Token
JWT_SECRET = <your_secret_key>
JWT_EXPIRES = 30d

#EMAIL Services
EMAIL_USER = <your_email_address>
EMAIL_PASS = <your_email_password>

FRONTEND_URL=https://<your_deployed_url>.netlify.app

# 2. Client Configuration
VITE_BACKEND_URL= "https://<your_deployed_url>.onrender.com"

```
3. Start the server:
```bash
# Server
cd backend
npm start

#Client
cd ../frontend
npm run dev
```

### 🧾 Postman Documentaion 
```bash
https://documenter.getpostman.com/view/41342583/2sB2qdhLbJ
```

### 🧾 Auth Endpoints 

| Method                                                                | Endpoint                                                      | Description                               |
|-----------------------------------------------------------------------|---------------------------------------------------------------|-------------------------------------------|
| ![GET](https://img.shields.io/badge/METHOD-GET-brightgreen)           | `/api/auth   `                                                | Welcome the API                           |
| ![POST](https://img.shields.io/badge/METHOD-POST-yellow)              | `/api/auth/register`                                          | Register new users                        |
| ![POST](https://img.shields.io/badge/METHOD-POST-yellow)              | `/api/auth/login`                                             | Login a registered user                   |
| ![POST](https://img.shields.io/badge/METHOD-POST-yellow)              | `/api/auth/logout`                                            | Logout a registered user                  |
| ![POST](https://img.shields.io/badge/METHOD-POST-yellow)              | `/api/auth/forgot-password  `                                 | Forgot password by registered user        |
| ![POST](https://img.shields.io/badge/METHOD-POST-yellow)              | `/api/auth/reset-password`                                    | Reset password by registered user         |
| ![GET](https://img.shields.io/badge/METHOD-GET-brightgreen)           | `/api/auth/validate-resetToken/:resetToken`                   | Validate the Token                        |
| ![GET](https://img.shields.io/badge/METHOD-GET-brightgreen)           | `/api/user/:id`                                               | Get users by ID                           |



### 📂 Folder Structure

auth-recovery-system/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── .env             # Environment variables
│   └── server.js        # Main server file
│
└── frontend/
    ├── public/          # Static files
    ├── src/
    │   ├── components/  # React components
    │   ├── context/     # Auth context
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── styles/      # CSS files
    │   ├── App.js       # Main app component
    │   └── index.js     # Entry point
    └── .env             # Frontend environment variables


## 🚀 Deployment on Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

This API is deployed on **Render** - a modern cloud platform for hosting web services.

### 🌐 Live Deployment
🔗 **Production URL**: [https://your-auth-api.onrender.com]([https://your-auth-api.onrender.com)  
🔗 **API Docs**: [https://your-auth-api.onrender.com/api-docs]([https://your-auth-api.onrender.com/api-docs)

### ⚙️ Render Configuration
1. **Service Type**: Web Service
2. **Runtime**: Node.js 18+
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `node server.js`
5. **Auto-Deploy**: Enabled on Git push to `main` branch

### 📦 Environment Variables 

Configure in Render Dashboard under Environment Variables section:

```env
# 1. Server Configuration
PORT=10000
NODE_ENV=production
HOST=0.0.0.0

# 2. Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/auth-recovery?retryWrites=true&w=majority

# 3. Authentication
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRES_IN=30d

# 4. Email Services (for password reset/verification)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# 5. Frontend/Client
FRONTEND_URL=https://authrecovery.netlify.app

```

## 🚀 Deployment on Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

This frontend is deployed on **Netlify** - a powerful platform for static sites and frontend applications.

### 🌐 Live Deployment
🔗 **Production URL**: [https://your-auth-app.netlify.app](https://your-auth-app.netlify.app)  

### ⚙️ Netlify Configuration
1. **Site Type**: Static Site
2. **Build Command**: `npm run build`
3. **Publish Directory**: `build/` (or `dist/`)
4. **Auto-Deploy**: Enabled on Git push to `main` branch
5. **Branch Deploys**: Enabled for PR previews

### 📦 Environment Variables
Configure in Netlify Dashboard (Site Settings > Environment Variables):
```env
VITE_BACKEND_URL=https://your-auth-api.onrender.com
