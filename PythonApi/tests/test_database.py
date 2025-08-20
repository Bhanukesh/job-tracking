import pytest
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from database import FileDatabase
from models import JobApplication, CreateJobApplicationCommand, UpdateJobApplicationCommand
import os


class TestFileDatabase:
    """Unit tests for the FileDatabase class"""
    
    def setup_method(self):
        """Create a fresh database instance for each test"""
        self.test_db_file = "test_job_applications.json"
        if os.path.exists(self.test_db_file):
            os.remove(self.test_db_file)
        self.db = FileDatabase(self.test_db_file)
    
    def teardown_method(self):
        """Clean up test database file after each test"""
        if os.path.exists(self.test_db_file):
            os.remove(self.test_db_file)
    
    def test_initial_state(self):
        """Test that database starts with sample data"""
        job_apps = self.db.get_all_job_applications()
        assert len(job_apps) == 3  # Sample data has 3 entries
        assert all(isinstance(app, JobApplication) for app in job_apps)
    
    def test_create_single_job_application(self):
        """Test creating a single job application"""
        command = CreateJobApplicationCommand(
            jobTitle="Software Engineer",
            company="Test Corp",
            dateApplied="2025-08-20",
            status="Applied",
            description="Test application",
            jobUrl="https://test.com",
            salary="$100,000",
            location="Remote"
        )
        job_id = self.db.create_job_application(command)
        assert job_id == 4  # Next ID after sample data
        
        job_apps = self.db.get_all_job_applications()
        assert len(job_apps) == 4  # 3 sample + 1 new
        new_app = next(app for app in job_apps if app.id == job_id)
        assert new_app.jobTitle == "Software Engineer"
        assert new_app.company == "Test Corp"
        assert new_app.salary == "$100,000"
        assert new_app.location == "Remote"
    
    def test_create_multiple_job_applications(self):
        """Test creating multiple job applications with unique IDs"""
        commands = [
            CreateJobApplicationCommand(
                jobTitle="Frontend Developer",
                company="Company A",
                dateApplied="2025-08-20",
                status="Applied",
                salary="$90,000",
                location="NYC"
            ),
            CreateJobApplicationCommand(
                jobTitle="Backend Developer",
                company="Company B",
                dateApplied="2025-08-21",
                status="Interview",
                salary="$95,000",
                location="SF"
            )
        ]
        
        id1 = self.db.create_job_application(commands[0])
        id2 = self.db.create_job_application(commands[1])
        
        assert id1 == 4  # After sample data
        assert id2 == 5
        
        job_apps = self.db.get_all_job_applications()
        assert len(job_apps) == 5  # 3 sample + 2 new
        
        new_apps = [app for app in job_apps if app.id >= 4]
        assert new_apps[0].jobTitle == "Frontend Developer"
        assert new_apps[1].jobTitle == "Backend Developer"
    
    def test_update_existing_job_application(self):
        """Test updating an existing job application"""
        # Use existing sample data (id=1)
        update_command = UpdateJobApplicationCommand(
            jobTitle="Senior Frontend Developer",
            company="Updated Company",
            dateApplied="2025-08-22",
            status="Offer",
            description="Updated description",
            jobUrl="https://updated.com",
            salary="$150,000",
            location="San Diego, CA"
        )
        
        success = self.db.update_job_application(1, update_command)
        assert success == True
        
        job_app = self.db.get_job_application_by_id(1)
        assert job_app is not None
        assert job_app.jobTitle == "Senior Frontend Developer"
        assert job_app.company == "Updated Company"
        assert job_app.salary == "$150,000"
        assert job_app.location == "San Diego, CA"
    
    def test_update_nonexistent_job_application(self):
        """Test updating a job application that doesn't exist"""
        update_command = UpdateJobApplicationCommand(
            jobTitle="Test",
            company="Test",
            dateApplied="2025-08-20",
            status="Applied"
        )
        success = self.db.update_job_application(999, update_command)
        assert success == False
    
    def test_delete_existing_job_application(self):
        """Test deleting an existing job application"""
        # Delete one of the sample applications (id=1)
        success = self.db.delete_job_application(1)
        assert success == True
        
        job_apps = self.db.get_all_job_applications()
        assert len(job_apps) == 2  # 3 - 1 = 2
        assert all(app.id != 1 for app in job_apps)  # ID 1 should be gone
    
    def test_delete_nonexistent_job_application(self):
        """Test deleting a job application that doesn't exist"""
        success = self.db.delete_job_application(999)
        assert success == False
    
    def test_get_job_application_by_id(self):
        """Test retrieving a specific job application by ID"""
        # Test with sample data
        job_app = self.db.get_job_application_by_id(1)
        assert job_app is not None
        assert job_app.id == 1
        assert job_app.jobTitle == "Frontend Developer"
        assert job_app.company == "OpenAI"
        assert job_app.salary == "$120,000 - $150,000"
        assert job_app.location == "San Francisco, CA"
        
        job_app = self.db.get_job_application_by_id(2)
        assert job_app is not None
        assert job_app.id == 2
        assert job_app.jobTitle == "Backend Developer"
        
        job_app = self.db.get_job_application_by_id(999)
        assert job_app is None
    
    def test_delete_and_update_sequence(self):
        """Test the sequence: delete one job, update another"""
        # Delete job application with id=2
        success = self.db.delete_job_application(2)
        assert success == True
        
        # Update job application with id=1
        update_command = UpdateJobApplicationCommand(
            jobTitle="Updated Frontend Developer",
            company="Updated OpenAI",
            dateApplied="2025-08-23",
            status="Hired",
            description="Updated description",
            jobUrl="https://updated-openai.com",
            salary="$160,000 - $190,000",
            location="Remote"
        )
        success = self.db.update_job_application(1, update_command)
        assert success == True
        
        # Verify the update worked
        job_app = self.db.get_job_application_by_id(1)
        assert job_app is not None
        assert job_app.jobTitle == "Updated Frontend Developer"
        assert job_app.status == "Hired"
        assert job_app.salary == "$160,000 - $190,000"
        assert job_app.location == "Remote"
        
        # Verify we have 2 job applications remaining
        job_apps = self.db.get_all_job_applications()
        assert len(job_apps) == 2
    
    def test_id_persistence_after_deletion(self):
        """Test that IDs continue incrementing even after deletions"""
        command1 = CreateJobApplicationCommand(
            jobTitle="Job 1",
            company="Company 1",
            dateApplied="2025-08-20",
            status="Applied"
        )
        command2 = CreateJobApplicationCommand(
            jobTitle="Job 2",
            company="Company 2",
            dateApplied="2025-08-21",
            status="Applied"
        )
        
        id1 = self.db.create_job_application(command1)
        id2 = self.db.create_job_application(command2)
        
        # Delete both new job applications
        self.db.delete_job_application(id1)
        self.db.delete_job_application(id2)
        
        # Create new job applications - IDs should continue incrementing
        command3 = CreateJobApplicationCommand(
            jobTitle="Job 3",
            company="Company 3",
            dateApplied="2025-08-22",
            status="Applied"
        )
        command4 = CreateJobApplicationCommand(
            jobTitle="Job 4",
            company="Company 4",
            dateApplied="2025-08-23",
            status="Applied"
        )
        
        id3 = self.db.create_job_application(command3)
        id4 = self.db.create_job_application(command4)
        
        assert id3 == id2 + 1  # Continue incrementing
        assert id4 == id3 + 1
        
        job_apps = self.db.get_all_job_applications()
        # Should have 3 sample + 2 new = 5 total
        assert len(job_apps) == 5
    
    def test_concurrent_operations(self):
        """Test thread safety with concurrent operations"""
        import threading
        import time
        
        results = []
        
        def create_job_applications():
            for i in range(10):
                command = CreateJobApplicationCommand(
                    jobTitle=f"Concurrent Job {i}",
                    company=f"Company {i}",
                    dateApplied="2025-08-20",
                    status="Applied"
                )
                job_id = self.db.create_job_application(command)
                results.append(job_id)
        
        # Create multiple threads
        threads = [threading.Thread(target=create_job_applications) for _ in range(3)]
        
        # Start all threads
        for t in threads:
            t.start()
        
        # Wait for completion
        for t in threads:
            t.join()
        
        # Check that we have 30 new job applications + 3 sample = 33 total with unique IDs
        job_apps = self.db.get_all_job_applications()
        assert len(job_apps) == 33
        assert len(set(results)) == 30  # All new IDs should be unique