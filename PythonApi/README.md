# Job Tracker API - Python FastAPI Implementation

A FastAPI implementation of the Job Application Tracker API with persistent file-based storage.

## Features

- RESTful API for Job Application CRUD operations
- File-based JSON database with thread-safe operations
- Persistent storage that survives server restarts
- Salary and location fields for job applications  
- CORS enabled for cross-origin requests
- Comprehensive test coverage
- Auto-generated API documentation at `/swagger`

## Installation

```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python main.py
```

Or with uvicorn:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
- Swagger documentation: `http://localhost:8000/swagger`
- ReDoc documentation: `http://localhost:8000/redoc`

## API Endpoints

- `GET /api/JobApplications` - Get all job applications
- `POST /api/JobApplications` - Create a new job application
- `GET /api/JobApplications/{id}` - Get a specific job application
- `PUT /api/JobApplications/{id}` - Update an existing job application
- `DELETE /api/JobApplications/{id}` - Delete a job application

## Job Application Fields

Each job application includes:
- `id`: Unique identifier (auto-generated)
- `jobTitle`: Position title (required)
- `company`: Company name (required)  
- `dateApplied`: Application date (required)
- `status`: Application status (required)
- `description`: Job description (optional)
- `jobUrl`: Link to job posting (optional)
- `salary`: Salary range or amount (optional)
- `location`: Job location (optional)

## Data Persistence

Job applications are stored in `job_applications.json` file:
- Data persists across server restarts and page refreshes
- Thread-safe file operations with automatic backup
- Sample data included for development and testing

## Testing

The project includes comprehensive unit and integration tests.

### Run all tests
```bash
pytest
```

### Run tests quietly (less verbose)
```bash
pytest -q
```

### Run specific test file
```bash
pytest tests/test_database.py  # Unit tests for database
pytest tests/test_api.py       # Integration tests for API
```

### Run specific test
```bash
pytest tests/test_api.py::TestJobApplicationAPI::test_create_job_application
```

The tests include:
- **Unit tests** (`test_database.py`): Test the file database operations
- **Integration tests** (`test_api.py`): Test the complete API endpoints  
- **Edge cases**: Empty fields, special characters, concurrent operations
- **Workflow tests**: Complex multi-step operations

## Project Structure

```
PythonApi/
├── main.py                      # FastAPI application and endpoints
├── models.py                   # Pydantic models for request/response
├── database.py                 # File-based database implementation
├── job_applications.json       # Database file (created automatically)
├── openapi.json               # OpenAPI specification
├── requirements.txt           # Python dependencies
├── pytest.ini                # Pytest configuration
├── README.md                  # This file
└── tests/                     # Test directory
    ├── __init__.py            # Tests package marker
    ├── test_database.py       # Unit tests for database
    └── test_api.py            # Integration tests for API
```

## Integration with Frontend

This API generates RTK Query hooks via the OpenAPI specification:
1. The API auto-generates `openapi.json` with job application schemas
2. Frontend runs `pnpm generate-api` to create TypeScript client
3. Type-safe API access with automatic caching via RTK Query