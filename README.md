# MERN Authentication App

A full-stack authentication application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication with JWT (JSON Web Tokens)
- User registration with validation
- User login with validation
- Responsive UI with styled-components
- Form validation for both frontend and backend
- Protected routes
- Modern UI with animations and transitions

## Project Structure

```
├── backend/            # Backend server code
│   ├── controllers/    # Route controllers
│   ├── middlewares/    # Custom middlewares
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── .env            # Environment variables
│   ├── package.json    # Dependencies and scripts
│   └── server.js       # Main server file
│
└── frontend/           # React frontend code
    ├── public/         # Static files
    └── src/            # Source code
        ├── components/ # Reusable components
        ├── context/    # Context API providers
        ├── pages/      # Page components
        ├── styles/     # Styled components and global styles
        ├── utils/      # Utility functions
        ├── App.js      # Main application component
        └── index.js    # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mern-auth-app
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Set up environment variables:
   Create a `.env` file in the backend directory with:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-auth
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```

4. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### Running the Application

1. Start backend server:

```bash
cd backend
npm run dev
```

2. Start frontend development server:

```bash
cd frontend
npm start
```

3. Access the application:
   Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- cors

### Frontend

- React
- React Router DOM
- Styled Components
- Axios
- Context API for state management

## License

This project is licensed under the MIT License.
