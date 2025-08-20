from typing import List, Optional
from models import JobApplication, CreateJobApplicationCommand, UpdateJobApplicationCommand
import threading


class InMemoryDatabase:
    def __init__(self):
        self._job_applications: List[JobApplication] = []
        self._next_id = 1
        self._lock = threading.Lock()
        self._init_sample_data()
    
    def _init_sample_data(self):
        sample_data = [
            {
                "jobTitle": "Frontend Developer",
                "company": "OpenAI",
                "dateApplied": "2025-08-15",
                "status": "Rejected",
                "description": "Applied via LinkedIn. Contact: recruiter@openai.com",
                "jobUrl": "https://openai.com/careers/frontend-dev"
            },
            {
                "jobTitle": "Backend Developer",
                "company": "Google",
                "dateApplied": "2025-08-10",
                "status": "Interview",
                "description": "Applied through company website",
                "jobUrl": "https://careers.google.com/backend-dev"
            },
            {
                "jobTitle": "Full Stack Engineer",
                "company": "Microsoft",
                "dateApplied": "2025-08-05",
                "status": "Applied",
                "description": "Referred by colleague",
                "jobUrl": "https://careers.microsoft.com/fullstack"
            }
        ]
        
        for data in sample_data:
            job_app = JobApplication(
                id=self._next_id,
                **data
            )
            self._job_applications.append(job_app)
            self._next_id += 1
    
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
                jobUrl=command.jobUrl
            )
            self._job_applications.append(job_app)
            self._next_id += 1
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
                    return True
            return False
    
    def delete_job_application(self, id: int) -> bool:
        with self._lock:
            for i, job_app in enumerate(self._job_applications):
                if job_app.id == id:
                    del self._job_applications[i]
                    return True
            return False
    
    def get_job_application_by_id(self, id: int) -> Optional[JobApplication]:
        with self._lock:
            for job_app in self._job_applications:
                if job_app.id == id:
                    return job_app
            return None


db = InMemoryDatabase()