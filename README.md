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


## Testing with Live Database Samples

The API is pre-loaded with document data for specific organizations. Use these exact values to test the endpoints:

### Test Case 1: Fetching Documents (GET)
## Testing Guide for Ilo

Dear Ilo, you can use the following real records from the database to test the API functionality. These examples demonstrate how the API handles different organizations and students.

### 1. Verification Test (The User: Eylül Balcılar)
- **Organization**: `SALT Bootcamps`
- **Document ID**: `SALT-2024-001`
- **Action**: Send a `POST` request to `/documents/proof/SALT-2024-001` with header `x-org-id: SALT Bootcamps`.
- **Expected Result**: 202 Accepted (Verification Successful).

### 2. Verification Test (The Teacher: Ilo)
- **Organization**: `Amazon Web Services`
- **Document ID**: `AWS-ARCH-99`
- **Action**: Send a `POST` request to `/documents/proof/AWS-ARCH-99` with header `x-org-id: Amazon Web Services`.
- **Expected Result**: 202 Accepted (Verification Successful).

### 3. Verification Test (Other Student: Lars Svensson)
- **Organization**: `Uppsala University`
- **Document ID**: `UU-2023-088`
- **Action**: Send a `POST` request to `/documents/proof/UU-2023-088` with header `x-org-id: Uppsala University`.
- **Expected Result**: 202 Accepted.

### 4. Cross-Organization Security Test
- **Action**: Attempt to verify Eylül's document (`SALT-2024-001`) while using Ilo's organization header (`x-org-id: Amazon Web Services`).
- **Expected Result**: 403 Forbidden (Prevents unauthorized organizations from verifying other documents).
