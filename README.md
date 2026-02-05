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



Testing Guide for Ilo
Dear Ilo, please follow these specific scenarios to test how the API handles different data states and security layers. These examples are based on the records we've stored in the database.

1. Retrieve Your Records (200 OK)
Objective: List all documents belonging to Hyper Island.

Method: GET

URL: http://localhost:5001/documents

Header: x-org-id: Hyper Island

2. Verify Your Own Diploma (202 Accepted)
Objective: Successfully verify your specific UX Design certificate.

Method: POST

URL: http://localhost:5001/documents/proof/HI-UX-2025-44

Header: x-org-id: Hyper Island

3. Security Breach Attempt (403 Forbidden)
Objective: Try to verify Sofia Berg's (KTH) record while identified as Hyper Island.

Method: POST

URL: http://localhost:5001/documents/proof/KTH-ENG-2023-55

Header: x-org-id: Hyper Island

4. Non-Existent ID Search (404 Not Found)
Objective: Test the API response for a document ID that doesn't exist.

Method: POST

URL: http://localhost:5001/documents/proof/MYSTERY-ID-000

Header: x-org-id: Hyper Island

5. Missing Auth Header (400 Bad Request)
Objective: Test the "Authentication failed" logic by omitting the header.

Method: GET or POST

URL: http://localhost:5001/documents

Header: (Delete the x-org-id key)

6. Clean Up Julian's Record (200 OK)
Objective: Permanently remove Julian Vance's Nordic JS record from the database.

Method: DELETE

URL: http://localhost:5001/documents/NORDIC-JS-26

Header: x-org-id: Nordic JS
