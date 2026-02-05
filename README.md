# Proofify API

Proofify is a secure Web API built with Node.js, Express, and MongoDB for managing and verifying digital documents like certificates and diplomas.

## Features
- **Secure Access**: Organization-based authentication using custom headers.
- **RESTful Architecture**: Supports multiple HTTP methods (GET, POST, DELETE).
- **Comprehensive Status Codes**: Fully compliant with RFC 2616 standards (200, 201, 202, 204, 400, 403, 404, 500).

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Local or Atlas)
- **Environment**: Dotenv for secure configuration

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### Installation
1. Clone the repository:
   ```
   git clone <your-repository-url>

2.Install dependencies:
```
npm install
```

3.Configure environment variables: Create a .env file in the root directory and add:
```
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/proofify
```
Running the API
```
npm start
```
The server will be running at http://localhost:5001.

## API Endpoints

  ## Documents Management
  
- GET /documents

  - Description: List all documents for the authenticated organization.

  - Status Codes: 200 (OK), 400 (Bad Request), 500 (Server Error)

- POST /documents

  - Description: Create a new digital document.

  - Status Codes: 201 (Created), 400 (Bad Request), 500 (Server Error)

- DELETE /documents/:id

  - Description: Remove a specific document by its ID.

  - Status Codes: 204 (No Content), 404 (Not Found), 500 (Server Error)

## Verification

- POST /documents/proof/:id

  - Description: Verify the authenticity of a document.

  - Status Codes: 202 (Accepted), 403 (Forbidden), 404 (Not Found), 500 (Server Error)

## Authentication

All requests require the following header:

x-org-id: Your Organization ID (e.g., "SALT Bootcamps")



## Testing Guide for Ilo (Advanced Scenarios)

Dear Ilo, please use the following test cases to observe how the API handles different outcomes based on the database state.
I have included both our records and various error scenarios:

### 1. Success Case: 202 Accepted (Ilo Fabian Miiro)
* **Goal**: Verify your own valid document with the matching organization.
* **Organization (Header)**: `Hyper Island`
* **Document ID (URL)**: `HI-UX-2025-44`
* **Action**: `POST` to `/documents/proof/HI-UX-2025-44`
* **Expected Result**: `202 Accepted`

### 2. Student Success Case: 202 Accepted (Eylül Balcılar)
* **Goal**: Verify my student record with the matching organization.
* **Organization (Header)**: `Hyper Island`
* **Document ID (URL)**: `HI-FE-2026-01`
* **Action**: `POST` to `/documents/proof/HI-FE-2026-01`
* **Expected Result**: `202 Accepted`

### 3. Security Case: 403 Forbidden (Cross-Organization)
* **Goal**: Prove that one organization cannot verify another institution's diploma.
* **Organization (Header)**: `Stockholm University`
* **Document ID (URL)**: `KTH-ENG-2023-55` (Sofia Berg's KTH diploma)
* **Action**: Attempt to verify a KTH document using a Stockholm University header.
* **Expected Result**: `403 Forbidden`

### 4. Not Found Case: 404 Not Found
* **Goal**: Show API behavior when a record does not exist in the database.
* **Document ID (URL)**: `NON-EXISTENT-ID-123`
* **Action**: `POST` to `/documents/proof/NON-EXISTENT-ID-123`
* **Expected Result**: `404 Not Found`

### 5. Data Listing: 200 OK (Liam Andersson)
* **Goal**: Successfully retrieve all documents belonging to a specific organization.
* **Organization (Header)**: `Stockholm University`
* **Action**: `GET` request to `/documents`
* **Expected Result**: `200 OK` with Liam Andersson's record (`SU-CS-2024-102`)
