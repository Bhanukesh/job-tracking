from pydantic import BaseModel
from typing import Optional
from datetime import date


class JobApplication(BaseModel):
    id: int
    jobTitle: str
    company: str
    dateApplied: str
    status: str
    description: Optional[str] = None
    jobUrl: Optional[str] = None


class CreateJobApplicationCommand(BaseModel):
    jobTitle: str
    company: str
    dateApplied: str
    status: str
    description: Optional[str] = None
    jobUrl: Optional[str] = None


class UpdateJobApplicationCommand(BaseModel):
    jobTitle: str
    company: str
    dateApplied: str
    status: str
    description: Optional[str] = None
    jobUrl: Optional[str] = None