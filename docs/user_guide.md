# User Guide

Welcome to the **Student Card Generator App**. This guide will help you navigate the system and perform common tasks.

## 1. Accessing the System
Navigate to the application URL (e.g., `http://localhost:5173` or your deployed URL).
*   **Login**: Enter your admin credentials to access the dashboard.
*   **Dashboard**: The main hub showing an overview of registered students and recent activities.

## 2. Managing Students
Go to the **Students** tab in the sidebar.
*   **Add Student**: Click "Add New" and fill in the required details (Name, Reg No, Session, Program, etc.).
*   **Edit Student**: Click the edit icon next to a student's name to modify their information.
*   **Delete**: Remove a student record permanently (use with caution).
*   **Import Data**:
    1.  Navigate to the **Import Data** page.
    2.  Upload a `.csv` or `.xlsx` file containing student records.
    3.  Map the columns from your file to the system fields (e.g., "Registration Number" -> "reg_no").
    4.  Confirm import.

## 3. Generating Cards
1.  Navigate to the **Card Generator** page.
2.  **Select Template**: Choose a card design from the available SVG templates.
3.  **Select Students**: Check the boxes for the students you want to generate cards for (or "Select All").
4.  **Preview**: Click "Preview" to see how the cards will look with real data.
5.  **Generate**: Click "Download PDF" or "Download PNG" to generate the final files.

## 4. Verifying IDs
This feature is public and does not require login.
1.  Scan the **QR Code** on any printed student ID card.
2.  You will be redirected to a verification page (e.g., `https://your-domain.com/verify/123`).
3.  The system will display the student's photo and basic details to confirm the card is authentic.

## 5. Troubleshooting
*   **Import Errors**: Ensure your CSV file is UTF-8 encoded and headers match the expected format.
*   **Print Issues**: Make sure to print the PDF at "Actual Size" (100% scale) to maintain ISO/IEC 7810 dimensions.
