# Installation and Setup Guide

This guide covers the steps to set up the **Student Card Generator App** for local development.

## Prerequisites
Ensure you have the following installed on your machine:
*   **Node.js** (v18 or higher)
*   **Python** (v3.10 or higher)
*   **Git**

## 1. Clone the Repository
```bash
git clone https://github.com/Start-Core-Sargodha/StudentID-card-generator.git
cd StudentID-card-generator
```

## 2. Backend Setup
The backend is built with FastAPI.

1.  Navigate to the backend directory (adjust path if necessary):
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # Mac/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

## 3. Frontend Setup
The frontend is built with React and Vite.

1.  Navigate to the root directory (or `frontend/` if separated):
    ```bash
    cd ../
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 4. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./sql_app.db
```

## 5. Running with Docker (Optional)
If you prefer using Docker Compose:

```bash
docker-compose up --build
```
This will start both the frontend and backend services automatically.
