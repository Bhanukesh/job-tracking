from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, RedirectResponse
from typing import List
from models import JobApplication, CreateJobApplicationCommand, UpdateJobApplicationCommand
from database import db

app = FastAPI(title="Job Tracker API", version="v1", docs_url="/swagger", redoc_url="/redoc")
app.title = "Job Tracker API"
app.version = "v1"
app.description = "Job Application Tracker API"

# Configure CORS to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Send interactive user to swagger page by default
@app.get("/")
async def redirect_to_swagger():
    return RedirectResponse(url="/swagger")

@app.get("/api/JobApplications", response_model=List[JobApplication], tags=["JobApplications"], operation_id="GetJobApplications")
async def get_job_applications():
    return db.get_all_job_applications()


@app.get("/api/JobApplications/{id}", response_model=JobApplication, tags=["JobApplications"], operation_id="GetJobApplication")
async def get_job_application(id: int):
    job_app = db.get_job_application_by_id(id)
    if not job_app:
        raise HTTPException(status_code=404, detail="Job application not found")
    return job_app


@app.post("/api/JobApplications", response_model=int, tags=["JobApplications"], operation_id="CreateJobApplication")
async def create_job_application(command: CreateJobApplicationCommand):
    job_app_id = db.create_job_application(command)
    return job_app_id


@app.put("/api/JobApplications/{id}", tags=["JobApplications"], operation_id="UpdateJobApplication")
async def update_job_application(id: int, command: UpdateJobApplicationCommand):
    success = db.update_job_application(id, command)
    if not success:
        raise HTTPException(status_code=404, detail="Job application not found")
    
    return Response(status_code=200)


@app.delete("/api/JobApplications/{id}", tags=["JobApplications"], operation_id="DeleteJobApplication")
async def delete_job_application(id: int):
    success = db.delete_job_application(id)
    if not success:
        raise HTTPException(status_code=404, detail="Job application not found")
    
    return Response(status_code=200)
