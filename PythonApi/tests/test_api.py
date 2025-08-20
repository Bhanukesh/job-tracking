import pytest
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from main import app
from database import db


@pytest.fixture(autouse=True)
def reset_database():
    """Reset the database before each test"""
    import os
    test_db_file = "test_job_applications_api.json"
    if os.path.exists(test_db_file):
        os.remove(test_db_file)
    db._db_file = test_db_file
    db._job_applications = []
    db._next_id = 1
    db._init_sample_data()
    db._load_data()
    yield
    if os.path.exists(test_db_file):
        os.remove(test_db_file)


class TestJobApplicationAPI:
    """Integration tests for the Job Application API endpoints"""
    
    def setup_method(self):
        """Create a test client for each test"""
        self.client = TestClient(app)
    
    def test_get_job_applications(self):
        """Test getting job applications from sample data"""
        response = self.client.get("/api/JobApplications")
        assert response.status_code == 200
        job_apps = response.json()
        assert len(job_apps) == 3  # Sample data
        assert job_apps[0]["jobTitle"] == "Frontend Developer"
        assert job_apps[0]["salary"] == "$120,000 - $150,000"
        assert job_apps[0]["location"] == "San Francisco, CA"
    
    def test_create_job_application(self):
        """Test creating a new job application"""
        job_data = {
            "jobTitle": "Software Engineer",
            "company": "Test Company",
            "dateApplied": "2025-08-20",
            "status": "Applied",
            "description": "Test job application",
            "jobUrl": "https://test.com/job",
            "salary": "$100,000",
            "location": "Remote"
        }
        response = self.client.post(
            "/api/JobApplications",
            json=job_data
        )
        assert response.status_code == 200
        assert response.json() == 4  # After sample data
        
        # Verify it was created
        response = self.client.get("/api/JobApplications")
        assert response.status_code == 200
        job_apps = response.json()
        assert len(job_apps) == 4  # 3 sample + 1 new
        new_app = next(app for app in job_apps if app["id"] == 4)
        assert new_app["jobTitle"] == "Software Engineer"
        assert new_app["salary"] == "$100,000"
        assert new_app["location"] == "Remote"
    
    def test_create_multiple_job_applications(self):
        """Test creating multiple job applications"""
        job_data_list = [
            {
                "jobTitle": "Frontend Developer",
                "company": "Company A",
                "dateApplied": "2025-08-20",
                "status": "Applied",
                "salary": "$90,000",
                "location": "NYC"
            },
            {
                "jobTitle": "Backend Developer",
                "company": "Company B",
                "dateApplied": "2025-08-21",
                "status": "Interview",
                "salary": "$95,000",
                "location": "SF"
            }
        ]
        created_ids = []
        
        for job_data in job_data_list:
            response = self.client.post(
                "/api/JobApplications",
                json=job_data
            )
            assert response.status_code == 200
            created_ids.append(response.json())
        
        assert created_ids == [4, 5]  # After sample data
        
        # Verify all were created
        response = self.client.get("/api/JobApplications")
        job_apps = response.json()
        assert len(job_apps) == 5  # 3 sample + 2 new
        new_apps = [app for app in job_apps if app["id"] >= 4]
        assert new_apps[0]["jobTitle"] == "Frontend Developer"
        assert new_apps[1]["jobTitle"] == "Backend Developer"
    
    def test_update_job_application(self):
        """Test updating an existing job application"""
        # Update sample data job application with id=1
        job_data = {
            "jobTitle": "Senior Frontend Developer",
            "company": "Updated OpenAI",
            "dateApplied": "2025-08-22",
            "status": "Offer",
            "description": "Updated description",
            "jobUrl": "https://updated-openai.com",
            "salary": "$160,000 - $190,000",
            "location": "Remote"
        }
        update_response = self.client.put(
            f"/api/JobApplications/1",
            json=job_data
        )
        assert update_response.status_code == 200
        
        # Verify the update
        response = self.client.get("/api/JobApplications/1")
        job_app = response.json()
        assert job_app["jobTitle"] == "Senior Frontend Developer"
        assert job_app["salary"] == "$160,000 - $190,000"
        assert job_app["location"] == "Remote"
    
    def test_update_nonexistent_job_application(self):
        """Test updating a job application that doesn't exist"""
        job_data = {
            "jobTitle": "Test Job",
            "company": "Test Company",
            "dateApplied": "2025-08-20",
            "status": "Applied"
        }
        response = self.client.put(
            "/api/JobApplications/999",
            json=job_data
        )
        assert response.status_code == 404
        assert response.json()["detail"] == "Job application not found"
    
    def test_delete_job_application(self):
        """Test deleting an existing job application"""
        # Delete sample job application with id=1
        delete_response = self.client.delete("/api/JobApplications/1")
        assert delete_response.status_code == 200
        
        # Verify it was deleted
        response = self.client.get("/api/JobApplications")
        job_apps = response.json()
        assert len(job_apps) == 2  # 3 - 1 = 2
        assert all(app["id"] != 1 for app in job_apps)  # ID 1 should be gone
    
    def test_delete_nonexistent_job_application(self):
        """Test deleting a job application that doesn't exist"""
        response = self.client.delete("/api/JobApplications/999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Job application not found"
    
    def test_delete_then_update_scenario(self):
        """Test deleting one job application then updating another"""
        # Delete sample job application with id=2
        delete_response = self.client.delete("/api/JobApplications/2")
        assert delete_response.status_code == 200
        
        # Update job application with id=1
        job_data = {
            "jobTitle": "Updated Frontend Developer",
            "company": "Updated OpenAI",
            "dateApplied": "2025-08-23",
            "status": "Hired",
            "description": "Updated description",
            "jobUrl": "https://updated-openai.com",
            "salary": "$160,000 - $190,000",
            "location": "Remote"
        }
        update_response = self.client.put(
            "/api/JobApplications/1",
            json=job_data
        )
        assert update_response.status_code == 200
        
        # Verify the update worked and we have 2 job applications remaining
        response = self.client.get("/api/JobApplications")
        job_apps = response.json()
        assert len(job_apps) == 2
        updated_app = next(app for app in job_apps if app["id"] == 1)
        assert updated_app["jobTitle"] == "Updated Frontend Developer"
        assert updated_app["status"] == "Hired"
    
    def test_complex_workflow(self):
        """Test a complex workflow with multiple operations"""
        # Create 2 new job applications
        job_data_list = [
            {
                "jobTitle": "DevOps Engineer",
                "company": "Netflix",
                "dateApplied": "2025-08-20",
                "status": "Applied",
                "salary": "$110,000",
                "location": "Los Angeles, CA"
            },
            {
                "jobTitle": "Data Scientist",
                "company": "Meta",
                "dateApplied": "2025-08-21",
                "status": "Applied",
                "salary": "$125,000",
                "location": "Menlo Park, CA"
            }
        ]
        
        ids = []
        for job_data in job_data_list:
            response = self.client.post("/api/JobApplications", json=job_data)
            ids.append(response.json())
        
        # Update the second sample job application (id=2)
        update_data = {
            "jobTitle": "Senior Backend Developer",
            "company": "Updated Google",
            "dateApplied": "2025-08-22",
            "status": "Offer",
            "description": "Updated through referral",
            "jobUrl": "https://updated-careers.google.com",
            "salary": "$160,000 - $200,000",
            "location": "San Francisco, CA"
        }
        self.client.put("/api/JobApplications/2", json=update_data)
        
        # Delete the first new job application
        self.client.delete(f"/api/JobApplications/{ids[0]}")
        
        # Get all job applications
        response = self.client.get("/api/JobApplications")
        job_apps = response.json()
        
        # Should have 4 job applications (3 sample + 2 new - 1 deleted)
        assert len(job_apps) == 4
        
        # Check the updated one
        updated_app = next(app for app in job_apps if app["id"] == 2)
        assert updated_app["jobTitle"] == "Senior Backend Developer"
        assert updated_app["status"] == "Offer"
    
    def test_cors_headers(self):
        """Test that CORS headers are properly set"""
        # Make a request with an Origin header to trigger CORS
        response = self.client.get(
            "/api/JobApplications",
            headers={"Origin": "http://localhost:3000"}
        )
        assert response.status_code == 200
        # CORS headers should be present in the response
        assert "access-control-allow-origin" in response.headers
        assert response.headers["access-control-allow-origin"] == "*"
        assert "access-control-allow-credentials" in response.headers
    
    def test_empty_fields_handling(self):
        """Test creating a job application with empty optional fields"""
        job_data = {
            "jobTitle": "Software Engineer",
            "company": "Test Company",
            "dateApplied": "2025-08-20",
            "status": "Applied",
            "description": "",
            "jobUrl": "",
            "salary": "",
            "location": ""
        }
        response = self.client.post(
            "/api/JobApplications",
            json=job_data
        )
        # Empty strings are valid
        assert response.status_code == 200
        
        # Verify it was created with empty optional fields
        job_apps = self.client.get("/api/JobApplications").json()
        new_app = next(app for app in job_apps if app["id"] == response.json())
        assert new_app["description"] == ""
        assert new_app["salary"] == ""
        assert new_app["location"] == ""
    
    def test_special_characters_in_job_fields(self):
        """Test job applications with special characters"""
        special_job_data = [
            {
                "jobTitle": "Frontend Engineer with React/Vue.js 🚀",
                "company": "Tech Corp & Co.",
                "dateApplied": "2025-08-20",
                "status": "Applied",
                "description": "Job with <html>tags</html> and \"quotes\"",
                "salary": "$100K-$120K",
                "location": "San Francisco, CA"
            },
            {
                "jobTitle": "Backend Developer\nPython/Django",
                "company": "StartUp Inc.",
                "dateApplied": "2025-08-21",
                "status": "Interview",
                "description": "Remote position\twith flexible hours",
                "salary": "€90,000-€110,000",
                "location": "Remote (EU timezone)"
            }
        ]
        
        for job_data in special_job_data:
            response = self.client.post("/api/JobApplications", json=job_data)
            assert response.status_code == 200
        
        job_apps = self.client.get("/api/JobApplications").json()
        # Should have 3 sample + 2 new = 5 total
        assert len(job_apps) >= 5
        
        # Verify special characters are preserved
        new_apps = [app for app in job_apps if "React/Vue.js 🚀" in app["jobTitle"]]
        assert len(new_apps) == 1
        assert new_apps[0]["company"] == "Tech Corp & Co."