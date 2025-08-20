from typing import List, Optional
from models import JobApplication, CreateJobApplicationCommand, UpdateJobApplicationCommand
import threading
import json
import os
from pathlib import Path


class FileDatabase:
    def __init__(self, db_file: str = "job_applications.json"):
        self._db_file = db_file
        self._lock = threading.Lock()
        self._ensure_db_file_exists()
        self._load_data()
    
    def _ensure_db_file_exists(self):
        if not os.path.exists(self._db_file):
            self._init_sample_data()
    
    def _init_sample_data(self):
        sample_data = {
            "next_id": 4,
            "job_applications": [
                {
                    "id": 1,
                    "jobTitle": "Frontend Developer",
                    "company": "OpenAI",
                    "dateApplied": "2025-08-15",
                    "status": "Rejected",
                    "description": "Applied via LinkedIn. Contact: recruiter@openai.com",
                    "jobUrl": "https://openai.com/careers/frontend-dev",
                    "salary": "$120,000 - $150,000",
                    "location": "San Francisco, CA"
                },
                {
                    "id": 2,
                    "jobTitle": "Backend Developer",
                    "company": "Google",
                    "dateApplied": "2025-08-10",
                    "status": "Interview",
                    "description": "Applied through company website",
                    "jobUrl": "https://careers.google.com/backend-dev",
                    "salary": "$140,000 - $180,000",
                    "location": "Mountain View, CA"
                },
                {
                    "id": 3,
                    "jobTitle": "Full Stack Engineer",
                    "company": "Microsoft",
                    "dateApplied": "2025-08-05",
                    "status": "Applied",
                    "description": "Referred by colleague",
                    "jobUrl": "https://careers.microsoft.com/fullstack",
                    "salary": "$130,000 - $170,000",
                    "location": "Seattle, WA"
                }
            ]
        }
        self._save_data(sample_data)
    
    def _load_data(self):
        try:
            with open(self._db_file, 'r') as f:
                data = json.load(f)
                self._next_id = data.get("next_id", 1)
                job_apps_data = data.get("job_applications", [])
                self._job_applications = [JobApplication(**app_data) for app_data in job_apps_data]
        except (FileNotFoundError, json.JSONDecodeError):
            self._job_applications = []
            self._next_id = 1
    
    def _save_data(self, data=None):
        if data is None:
            data = {
                "next_id": self._next_id,
                "job_applications": [app.dict() for app in self._job_applications]
            }
        with open(self._db_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def get_all_job_applications(self) -> List[JobApplication]:
        with self._lock:
            return self._job_applications.copy()
    
    def create_job_application(self, command: CreateJobApplicationCommand) -> int:
        with self._lock:
            job_app = JobApplication(
                id=self._next_id,
                jobTitle=command.jobTitle,
                company=command.company,
                dateApplied=command.dateApplied,
                status=command.status,
                description=command.description,
                jobUrl=command.jobUrl,
                salary=command.salary,
                location=command.location
            )
            self._job_applications.append(job_app)
            self._next_id += 1
            self._save_data()
            return job_app.id
    
    def update_job_application(self, id: int, command: UpdateJobApplicationCommand) -> bool:
        with self._lock:
            for job_app in self._job_applications:
                if job_app.id == id:
                    job_app.jobTitle = command.jobTitle
                    job_app.company = command.company
                    job_app.dateApplied = command.dateApplied
                    job_app.status = command.status
                    job_app.description = command.description
                    job_app.jobUrl = command.jobUrl
                    job_app.salary = command.salary
                    job_app.location = command.location
                    self._save_data()
                    return True
            return False
    
    def delete_job_application(self, id: int) -> bool:
        with self._lock:
            for i, job_app in enumerate(self._job_applications):
                if job_app.id == id:
                    del self._job_applications[i]
                    self._save_data()
                    return True
            return False
    
    def get_job_application_by_id(self, id: int) -> Optional[JobApplication]:
        with self._lock:
            for job_app in self._job_applications:
                if job_app.id == id:
                    return job_app
            return None


db = FileDatabase()