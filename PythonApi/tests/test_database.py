import pytest
import sys
import os
import tempfile
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from database import FileDatabase
from models import JobApplication, CreateJobApplicationCommand, UpdateJobApplicationCommand


class TestFileDatabase:
    """Unit tests for the FileDatabase class"""
    
    def setup_method(self):
        """Create a fresh database instance for each test"""
        # Use a temporary file for testing
        self.test_file = tempfile.NamedTemporaryFile(delete=False, suffix='.json')
        self.test_file.close()
        self.db = FileDatabase(self.test_file.name)
    
    def teardown_method(self):
        """Clean up test file"""
        if os.path.exists(self.test_file.name):
            os.unlink(self.test_file.name)
    
    def test_initial_state(self):
        """Test that database starts with sample data"""
        job_applications = self.db.get_all_job_applications()
        assert len(job_applications) == 3  # Sample data
        assert job_applications[0].jobTitle == "Frontend Developer"
        assert job_applications[0].company == "OpenAI"
    
    def test_create_single_job_application(self):
        """Test creating a single job application"""
        command = CreateJobApplicationCommand(
            jobTitle="Python Developer",
            company="Test Company",
            dateApplied="2025-08-20",
            status="Applied",
            description="Test application",
            jobUrl="https://test.com",
            salary="$100,000",
            location="New York, NY"
        )
        
        job_id = self.db.create_job_application(command)
        assert job_id == 4  # Should be 4 after 3 sample entries
        
        job_applications = self.db.get_all_job_applications()
        assert len(job_applications) == 4
        assert job_applications[3].id == 4
        assert job_applications[3].jobTitle == "Python Developer"
        assert job_applications[3].salary == "$100,000"
        assert job_applications[3].location == "New York, NY"
    
    def test_update_existing_job_application(self):
        """Test updating an existing job application"""
        command = UpdateJobApplicationCommand(
            jobTitle="Updated Title",
            company="Updated Company",
            dateApplied="2025-08-21",
            status="Interview",
            description="Updated description",
            jobUrl="https://updated.com",
            salary="$150,000",
            location="Updated Location, CA"
        )
        
        success = self.db.update_job_application(1, command)
        assert success == True
        
        job_app = self.db.get_job_application_by_id(1)
        assert job_app is not None
        assert job_app.jobTitle == "Updated Title"
        assert job_app.company == "Updated Company"
        assert job_app.salary == "$150,000"
        assert job_app.location == "Updated Location, CA"
    
    def test_update_nonexistent_job_application(self):
        """Test updating a job application that doesn't exist"""
        command = UpdateJobApplicationCommand(
            jobTitle="Test",
            company="Test",
            dateApplied="2025-08-20",
            status="Applied"
        )
        success = self.db.update_job_application(999, command)
        assert success == False
    
    def test_delete_existing_job_application(self):
        """Test deleting an existing job application"""
        success = self.db.delete_job_application(1)
        assert success == True
        
        job_applications = self.db.get_all_job_applications()
        assert len(job_applications) == 2
        
        job_app = self.db.get_job_application_by_id(1)
        assert job_app is None
    
    def test_delete_nonexistent_job_application(self):
        """Test deleting a job application that doesn't exist"""
        success = self.db.delete_job_application(999)
        assert success == False
    
    def test_get_job_application_by_id(self):
        """Test retrieving a specific job application by ID"""
        job_app = self.db.get_job_application_by_id(1)
        assert job_app is not None
        assert job_app.id == 1
        assert job_app.jobTitle == "Frontend Developer"
        assert job_app.location == "San Francisco, CA"
        
        job_app = self.db.get_job_application_by_id(2)
        assert job_app is not None
        assert job_app.id == 2
        assert job_app.jobTitle == "Backend Developer"
        
        job_app = self.db.get_job_application_by_id(999)
        assert job_app is None
    
    def test_persistence_across_instances(self):
        """Test that data persists when creating new database instances"""
        # Create a new job application
        command = CreateJobApplicationCommand(
            jobTitle="Persistent Test",
            company="Test Co",
            dateApplied="2025-08-20",
            status="Applied",
            location="Test City, TX"
        )
        job_id = self.db.create_job_application(command)
        
        # Create new database instance with same file
        db2 = FileDatabase(self.test_file.name)
        job_applications = db2.get_all_job_applications()
        
        # Should have original 3 + 1 new = 4 total
        assert len(job_applications) == 4
        assert job_applications[3].jobTitle == "Persistent Test"
    
    def test_concurrent_operations(self):
        """Test thread safety with concurrent operations"""
        import threading
        
        results = []
        
        def create_job_applications():
            for i in range(5):
                command = CreateJobApplicationCommand(
                    jobTitle=f"Concurrent Job {i}",
                    company=f"Company {i}",
                    dateApplied="2025-08-20",
                    status="Applied",
                    location=f"City {i}, State"
                )
                job_id = self.db.create_job_application(command)
                results.append(job_id)
        
        # Create multiple threads
        threads = [threading.Thread(target=create_job_applications) for _ in range(2)]
        
        # Start all threads
        for t in threads:
            t.start()
        
        # Wait for completion
        for t in threads:
            t.join()
        
        # Check that we have original 3 + 10 new = 13 total
        job_applications = self.db.get_all_job_applications()
        assert len(job_applications) == 13
        assert len(set(results)) == 10  # All IDs should be unique