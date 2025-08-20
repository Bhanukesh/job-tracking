import pytest
import sys
import os
import tempfile
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from main import app
from database import db, FileDatabase


@pytest.fixture(autouse=True)
def reset_database():
    """Reset the database before each test using a temporary file"""
    # Create a temporary file for testing
    test_file = tempfile.NamedTemporaryFile(delete=False, suffix='.json')
    test_file.close()
    
    # Replace the global db instance with a test instance
    import database
    original_db = database.db
    database.db = FileDatabase(test_file.name)
    
    # Update the main module's db reference
    import main
    main.db = database.db
    
    yield
    
    # Cleanup
    database.db = original_db
    main.db = original_db
    if os.path.exists(test_file.name):
        os.unlink(test_file.name)


class TestJobApplicationAPI:
    """Integration tests for the Job Application API endpoints"""
    
    def setup_method(self):
        """Create a test client for each test"""
        self.client = TestClient(app)
    
    def test_get_initial_job_applications(self):
        """Test getting job applications returns sample data"""
        response = self.client.get("/api/JobApplications")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3  # Should have sample data
        assert data[0]["jobTitle"] == "Frontend Developer"
        assert data[0]["company"] == "OpenAI"
    
    def test_create_job_application(self):
        """Test creating a new job application"""
        job_data = {
            "jobTitle": "Python Developer",
            "company": "Test Company",
            "dateApplied": "2025-08-20",
            "status": "Applied",
            "description": "Test job application",
            "jobUrl": "https://test.com/job",
            "salary": "$100,000",
            "location": "Austin, TX"
        }
        
        response = self.client.post("/api/JobApplications", json=job_data)
        assert response.status_code == 200
        assert response.json() == 4  # Should be ID 4 after 3 sample entries
        
        # Verify it was created
        response = self.client.get("/api/JobApplications")
        assert response.status_code == 200
        job_applications = response.json()
        assert len(job_applications) == 4
        
        new_job = job_applications[3]
        assert new_job["id"] == 4
        assert new_job["jobTitle"] == "Python Developer"
        assert new_job["company"] == "Test Company"
        assert new_job["salary"] == "$100,000"
        assert new_job["location"] == "Austin, TX"
    
    def test_get_job_application_by_id(self):
        """Test getting a specific job application by ID"""
        response = self.client.get("/api/JobApplications/1")
        assert response.status_code == 200
        
        job_app = response.json()
        assert job_app["id"] == 1
        assert job_app["jobTitle"] == "Frontend Developer"
        assert job_app["company"] == "OpenAI"
        assert job_app["location"] == "San Francisco, CA"
    
    def test_get_nonexistent_job_application(self):
        """Test getting a job application that doesn't exist"""
        response = self.client.get("/api/JobApplications/999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Job application not found"
    
    def test_update_job_application(self):
        """Test updating an existing job application"""
        update_data = {
            "jobTitle": "Senior Frontend Developer",
            "company": "Updated Company",
            "dateApplied": "2025-08-21",
            "status": "Interview",
            "description": "Updated description",
            "jobUrl": "https://updated.com",
            "salary": "$150,000",
            "location": "Los Angeles, CA"
        }
        
        response = self.client.put("/api/JobApplications/1", json=update_data)
        assert response.status_code == 200
        
        # Verify the update
        response = self.client.get("/api/JobApplications/1")
        assert response.status_code == 200
        job_app = response.json()
        assert job_app["jobTitle"] == "Senior Frontend Developer"
        assert job_app["company"] == "Updated Company"
        assert job_app["salary"] == "$150,000"
        assert job_app["location"] == "Los Angeles, CA"
    
    def test_update_nonexistent_job_application(self):
        """Test updating a job application that doesn't exist"""
        update_data = {
            "jobTitle": "Test",
            "company": "Test",
            "dateApplied": "2025-08-20",
            "status": "Applied"
        }
        
        response = self.client.put("/api/JobApplications/999", json=update_data)
        assert response.status_code == 404
        assert response.json()["detail"] == "Job application not found"
    
    def test_delete_job_application(self):
        """Test deleting an existing job application"""
        response = self.client.delete("/api/JobApplications/1")
        assert response.status_code == 200
        
        # Verify it was deleted
        response = self.client.get("/api/JobApplications")
        assert response.status_code == 200
        job_applications = response.json()
        assert len(job_applications) == 2
        
        # Verify specific job is gone
        response = self.client.get("/api/JobApplications/1")
        assert response.status_code == 404
    
    def test_delete_nonexistent_job_application(self):
        """Test deleting a job application that doesn't exist"""
        response = self.client.delete("/api/JobApplications/999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Job application not found"
    
    def test_create_multiple_job_applications(self):
        """Test creating multiple job applications"""
        job_data_list = [
            {
                "jobTitle": "Backend Developer",
                "company": "Company A",
                "dateApplied": "2025-08-20",
                "status": "Applied",
                "salary": "$120,000",
                "location": "Chicago, IL"
            },
            {
                "jobTitle": "DevOps Engineer", 
                "company": "Company B",
                "dateApplied": "2025-08-21",
                "status": "Interview",
                "salary": "$130,000",
                "location": "Denver, CO"
            }
        ]
        
        created_ids = []
        for job_data in job_data_list:
            response = self.client.post("/api/JobApplications", json=job_data)
            assert response.status_code == 200
            created_ids.append(response.json())
        
        # Should have original 3 + 2 new = 5 total
        response = self.client.get("/api/JobApplications")
        assert response.status_code == 200
        job_applications = response.json()
        assert len(job_applications) == 5
        
        # Check the new jobs were created with correct IDs
        assert created_ids == [4, 5]
        assert job_applications[3]["jobTitle"] == "Backend Developer"
        assert job_applications[4]["jobTitle"] == "DevOps Engineer"