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

----






## Testing Guide for Ilo 
Official Testing Guide for Ilo
Dear Ilo, please use these specific scenarios to test the API. Each case is designed to trigger a unique response and status code. Note: Always use the full URL: http://localhost:5001.

1. View Your Hyper Island Records (200 OK)
Goal: Retrieve the list of all documents belonging to your institution.

Method: GET

URL: http://localhost:5001/documents

Header: x-org-id: Hyper Island

Expected Message: "Magic! We found 3 legendary records for Hyper Island."

2. Verify Your Personal Diploma (202 Accepted)
Goal: Confirm that your specific UX Design certificate is valid.

Method: POST

URL: http://localhost:5001/documents/proof/HI-UX-2025-44

Header: x-org-id: Hyper Island

Expected Message: "Brilliant! Ilo Fabian Miiro's diploma is 100% genuine! "

3. Attempt Unauthorized Access (403 Forbidden)
Goal: Try to verify Sofia Berg's (KTH) record while logged in as Hyper Island.

Method: POST

URL: http://localhost:5001/documents/proof/KTH-ENG-2023-55

Header: x-org-id: Hyper Island

Expected Message: "Stop right there! This belongs to another institution. "

4. Delete a Foreign Record (404 Not Found)
Goal: Try to delete Nordic JS's document using Hyper Island credentials.

Method: DELETE

URL: http://localhost:5001/documents/NORDIC-JS-26

Header: x-org-id: Hyper Island

Expected Message: "No matching document found to delete." (Security check passed!)

5. Proper Deletion (200 OK)
Goal: Successfully remove a record using the correct credentials.

Method: DELETE

URL: http://localhost:5001/documents/NORDIC-JS-26

Header: x-org-id: Nordic JS

Expected Message: "Gone forever! Just like your last coffee."
