"""
Backend API Tests for Kangqore Admin Portal
Tests: Auth, Admin Dashboard, Dashboard APIs for all roles
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://dash-connect-6.preview.emergentagent.com')

# Test credentials
ADMIN_CREDENTIALS = {
    "email": "admin@kangqore.com",
    "password": "AdminAccess@2025",
    "role": "admin"
}

class TestHealthCheck:
    """Basic health check tests"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "Hello World"


class TestAdminAuth:
    """Admin authentication tests"""
    
    def test_admin_login_success(self):
        """Test admin login with valid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=ADMIN_CREDENTIALS
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == ADMIN_CREDENTIALS["email"]
        assert data["user"]["role"] == "admin"
        assert data["user"]["is_active"] == True
        assert data["user"]["is_approved"] == True
    
    def test_admin_login_wrong_password(self):
        """Test admin login with wrong password"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": "admin@kangqore.com",
                "password": "wrongpassword",
                "role": "admin"
            }
        )
        assert response.status_code == 401
    
    def test_admin_login_wrong_role(self):
        """Test admin login with wrong role"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": "admin@kangqore.com",
                "password": "AdminAccess@2025",
                "role": "client"  # Wrong role
            }
        )
        assert response.status_code == 401


class TestAdminDashboardAPIs:
    """Admin dashboard API tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get admin token before each test"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=ADMIN_CREDENTIALS
        )
        assert response.status_code == 200
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_admin_stats(self):
        """Test admin stats endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/auth/admin/stats",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_users" in data
        assert "by_role" in data
        assert "clients" in data["by_role"]
        assert "partners" in data["by_role"]
        assert "investors" in data["by_role"]
        assert "job_seekers" in data["by_role"]
        assert "active_users" in data
        assert "pending_approvals" in data
    
    def test_admin_users_list(self):
        """Test admin users list endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/auth/admin/users",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "users" in data
        assert "total" in data
        assert isinstance(data["users"], list)
    
    def test_admin_pending_approvals(self):
        """Test admin pending approvals endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/auth/admin/pending-approvals",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "pending_users" in data
        assert "count" in data
    
    def test_admin_content_stats(self):
        """Test admin content stats endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/admin/content-stats",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "by_type" in data
        assert "by_status" in data
    
    def test_admin_content_list(self):
        """Test admin content list endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/admin/content?page=1&page_size=100",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data


class TestClientDashboardAPIs:
    """Client dashboard API tests - requires client role"""
    
    def test_client_stats_requires_auth(self):
        """Test client stats requires authentication"""
        response = requests.get(f"{BASE_URL}/api/dashboard/client/stats")
        assert response.status_code == 403  # No auth header
    
    def test_client_stats_requires_client_role(self):
        """Test client stats requires client role (admin should be denied)"""
        # Login as admin
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=ADMIN_CREDENTIALS
        )
        token = login_response.json()["access_token"]
        
        # Try to access client stats with admin token
        response = requests.get(
            f"{BASE_URL}/api/dashboard/client/stats",
            headers={"Authorization": f"Bearer {token}"}
        )
        # Should be 403 because admin is not a client
        assert response.status_code == 403


class TestPartnerDashboardAPIs:
    """Partner dashboard API tests - requires partner role"""
    
    def test_partner_stats_requires_auth(self):
        """Test partner stats requires authentication"""
        response = requests.get(f"{BASE_URL}/api/dashboard/partner/stats")
        assert response.status_code == 403
    
    def test_partner_stats_requires_partner_role(self):
        """Test partner stats requires partner role (admin should be denied)"""
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=ADMIN_CREDENTIALS
        )
        token = login_response.json()["access_token"]
        
        response = requests.get(
            f"{BASE_URL}/api/dashboard/partner/stats",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 403


class TestInvestorDashboardAPIs:
    """Investor dashboard API tests - requires investor role"""
    
    def test_investor_stats_requires_auth(self):
        """Test investor stats requires authentication"""
        response = requests.get(f"{BASE_URL}/api/dashboard/investor/stats")
        assert response.status_code == 403
    
    def test_investor_stats_requires_investor_role(self):
        """Test investor stats requires investor role (admin should be denied)"""
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=ADMIN_CREDENTIALS
        )
        token = login_response.json()["access_token"]
        
        response = requests.get(
            f"{BASE_URL}/api/dashboard/investor/stats",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 403


class TestCareersDashboardAPIs:
    """Job Seeker (Careers) dashboard API tests - requires job_seeker role"""
    
    def test_careers_stats_requires_auth(self):
        """Test careers stats requires authentication"""
        response = requests.get(f"{BASE_URL}/api/dashboard/careers/stats")
        assert response.status_code == 403
    
    def test_careers_stats_requires_job_seeker_role(self):
        """Test careers stats requires job_seeker role (admin should be denied)"""
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=ADMIN_CREDENTIALS
        )
        token = login_response.json()["access_token"]
        
        response = requests.get(
            f"{BASE_URL}/api/dashboard/careers/stats",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 403


class TestUserProfile:
    """User profile API tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get admin token before each test"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=ADMIN_CREDENTIALS
        )
        assert response.status_code == 200
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_current_user(self):
        """Test get current user endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == ADMIN_CREDENTIALS["email"]
        assert data["role"] == "admin"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
