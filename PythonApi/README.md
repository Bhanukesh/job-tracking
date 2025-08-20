# Job Tracker API - Python FastAPI Implementation

A FastAPI implementation of the Job Tracker API for managing job applications.

## Features

- RESTful API for Job Application CRUD operations
- File-based persistent storage (JSON)
- Thread-safe operations
- OpenAPI/Swagger documentation
- Full salary tracking support
- CORS enabled for cross-origin requests

## Installation

```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python run_app.py
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
- `PUT /api/JobApplications/{id}` - Update an existing job application
- `DELETE /api/JobApplications/{id}` - Delete a job application
- `GET /api/JobApplications/{id}` - Get a specific job application

## Data Storage

The application uses file-based persistent storage in `job_applications.json`. All data persists across server restarts.

## Example Job Application

```json
{
  "id": 1,
  "jobTitle": "Frontend Developer",
  "company": "OpenAI",
  "dateApplied": "2025-08-15",
  "status": "Rejected",
  "description": "Applied via LinkedIn. Contact: recruiter@openai.com",
  "jobUrl": "https://openai.com/careers/frontend-dev",
  "salary": "$120,000 - $150,000"
}
```

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
- **Unit tests** (`test_database.py`): Test the file-based database operations
- **Integration tests** (`test_api.py`): Test the complete API endpoints
- **Edge cases**: Empty fields, special characters, concurrent operations
- **Bug regression tests**: Specific test for persistence across restarts

## Project Structure

```
PythonApi/
├── main.py                 # FastAPI application and endpoints
├── models.py              # Pydantic models for request/response
├── database.py            # File-based database implementation
├── job_applications.json  # Persistent data storage
├── run_app.py             # Application runner
├── requirements.txt       # Python dependencies
├── pytest.ini            # Pytest configuration
├── README.md             # This file
└── tests/                # Test directory
    ├── __init__.py       # Tests package marker
    ├── test_database.py  # Unit tests for database
    └── test_api.py       # Integration tests for API
```