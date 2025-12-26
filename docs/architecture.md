# System Architecture

## Overview
The **Student Card Generator App** utilizes a modern, decoupled full-stack architecture. It separates the concerns of data management and heavy processing (Backend) from the user interface and interaction (Frontend), connected via a RESTful API.

## Technology Stack

### Frontend (Client-Side)
The user interface is a Single Page Application (SPA) built for performance and responsiveness.
*   **Framework**: **React** (v19) with **Vite** (v7) for fast build tooling.
*   **Language**: **TypeScript** for type safety and developer productivity.
*   **Styling**: **Tailwind CSS** for utility-first styling with **shadcn/ui** (@radix-ui) for accessible component primitives.
*   **State Management**:
    *   **React Query (@tanstack/react-query)**: For server state management, caching, and synchronization.
    *   **Context API**: For global app state (AuthContext, StudentContext).
*   **Routing**: **React Router** (v7) for client-side navigation.
*   **Forms**: **React Hook Form** with **Zod** for schema-based validation.
*   **Icons**: **Lucide React**.

### Backend (Server-Side)
The backend is a high-performance REST API designed for asynchronous tasks like image processing.
*   **Framework**: **FastAPI** (Python). Selected for its speed and automatic OpenAPI documentation.
*   **Database**: **SQLite** (Development/Small Scale) with **SQLAlchemy ORM** for database interactions.
*   **Authentication**: **JWT** (JSON Web Tokens) with **bcrypt** for password hashing.
*   **Data Validation**: **Pydantic** models ensure strictly typed data exchange.
*   **Card Generation Engine**:
    *   **ReportLab**: For generating high-resolution PDF files ready for printing.
    *   **Pillow (PIL)**: For image manipulation and PNG generation.

## System Components

### 1. Authentication Service
Handles user login and session management.
*   **Flow**: User submits credentials -> Backend validates & issues JWT -> Frontend stores token `localStorage`/`cookies`.
*   **Security**: Routes are protected via middleware that verifies the JWT signature.

### 2. Student Management Module
Core CRUD functionality.
*   **Import**: Parses CSV/XLSX files using the `papaparse` (frontend) or backend libraries, maps columns to schema, and bulk inserts into the DB.
*   **API Endpoints**: `/api/students`, `/api/students/{id}`.

### 3. Card Generator Engine
The heavy-lifting module.
*   **Input**: Student Data + SVG Template.
*   **Process**:
    1.  Placeholders in the SVG are replaced with student data.
    2.  QR Code is generated dynamically pointing to the verification URL.
    3.  Composite image is rendered to PDF or PNG.
*   **Output**: Downloadable binary stream.

### 4. Verification Module
Public-facing component.
*   **Endpoint**: `/verify/:studentId` (Frontend Route) -> Calls Backend public API.
*   **Access**: Does not require authentication.
*   **Display**: Shows only limited, non-sensitive info (Name, Reg No, Photo, Status) to confirm validity.

## Deployment Architecture
*   **Containerization**: **Docker** & **Docker Compose** for consistent environments across dev and prod.
*   **CI/CD**: **GitHub Actions** for automated testing and build processes.
*   **Platform**: Compatible with PaaS providers like **Railway**.
