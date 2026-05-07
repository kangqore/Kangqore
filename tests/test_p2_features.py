"""
Backend API Tests for P2 Features
Tests: Global Search API, Media Library API
"""
import pytest
import requests
import os
import io

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://dash-connect-6.preview.emergentagent.com')

# Test credentials
ADMIN_CREDENTIALS = {
    "email": "admin@kangqore.com",
    "password": "AdminAccess@2025",
    "role": "admin"
}


class TestGlobalSearchAPI:
    """Global Search API tests - public endpoint"""
    
    def test_search_requires_query(self):
        """Test search requires query parameter"""
        response = requests.get(f"{BASE_URL}/api/search")
        # Should return 422 for missing required parameter
        assert response.status_code == 422
    
    def test_search_with_short_query(self):
        """Test search with query less than 2 characters"""
        response = requests.get(f"{BASE_URL}/api/search?q=a")
        # Should return 422 for query too short
        assert response.status_code == 422
    
    def test_search_with_valid_query(self):
        """Test search with valid query"""
        response = requests.get(f"{BASE_URL}/api/search?q=test")
        assert response.status_code == 200
        data = response.json()
        assert "query" in data
        assert data["query"] == "test"
        assert "total" in data
        assert "results" in data
        assert "grouped" in data
        assert isinstance(data["results"], list)
    
    def test_search_with_content_type_filter(self):
        """Test search with content type filter"""
        response = requests.get(f"{BASE_URL}/api/search?q=test&content_types=blog,news")
        assert response.status_code == 200
        data = response.json()
        assert "results" in data
    
    def test_search_with_limit(self):
        """Test search with custom limit"""
        response = requests.get(f"{BASE_URL}/api/search?q=test&limit=5")
        assert response.status_code == 200
        data = response.json()
        assert len(data["results"]) <= 5
    
    def test_search_suggestions(self):
        """Test search suggestions endpoint"""
        response = requests.get(f"{BASE_URL}/api/search/suggestions?q=te")
        assert response.status_code == 200
        data = response.json()
        assert "suggestions" in data
        assert isinstance(data["suggestions"], list)


class TestMediaLibraryAPI:
    """Media Library API tests - admin only"""
    
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
    
    def test_media_list_requires_auth(self):
        """Test media list requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/media/")
        assert response.status_code == 403
    
    def test_media_list_with_auth(self):
        """Test media list with admin authentication"""
        response = requests.get(
            f"{BASE_URL}/api/admin/media/",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert "page_size" in data
        assert "folders" in data
        assert isinstance(data["items"], list)
    
    def test_media_stats_requires_auth(self):
        """Test media stats requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/media/stats")
        assert response.status_code == 403
    
    def test_media_stats_with_auth(self):
        """Test media stats with admin authentication"""
        response = requests.get(
            f"{BASE_URL}/api/admin/media/stats",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_files" in data
        assert "total_images" in data
        assert "total_documents" in data
        assert "total_size" in data
        assert "total_size_formatted" in data
        assert "folders" in data
    
    def test_media_list_with_filters(self):
        """Test media list with filters"""
        response = requests.get(
            f"{BASE_URL}/api/admin/media/?file_type=image&page=1&page_size=10",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
    
    def test_media_upload_requires_auth(self):
        """Test media upload requires authentication"""
        # Create a simple test file
        files = {'file': ('test.txt', io.BytesIO(b'test content'), 'text/plain')}
        response = requests.post(f"{BASE_URL}/api/admin/media/upload", files=files)
        assert response.status_code == 403
    
    def test_media_upload_invalid_file_type(self):
        """Test media upload with invalid file type"""
        files = {'file': ('test.txt', io.BytesIO(b'test content'), 'text/plain')}
        response = requests.post(
            f"{BASE_URL}/api/admin/media/upload",
            headers=self.headers,
            files=files
        )
        assert response.status_code == 400
        data = response.json()
        assert "Invalid file type" in data["detail"]
    
    def test_media_upload_valid_image(self):
        """Test media upload with valid image"""
        # Create a minimal valid PNG image (1x1 pixel)
        png_data = bytes([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,  # PNG signature
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,  # IHDR chunk
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,  # 1x1 dimensions
            0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,  # bit depth, color type, etc
            0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,  # IDAT chunk
            0x54, 0x08, 0xD7, 0x63, 0xF8, 0xFF, 0xFF, 0x3F,  # compressed data
            0x00, 0x05, 0xFE, 0x02, 0xFE, 0xDC, 0xCC, 0x59,  # more data
            0xE7, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E,  # IEND chunk
            0x44, 0xAE, 0x42, 0x60, 0x82                      # IEND CRC
        ])
        
        files = {'file': ('test_image.png', io.BytesIO(png_data), 'image/png')}
        data = {'title': 'TEST_upload_image', 'alt_text': 'Test image for testing'}
        
        response = requests.post(
            f"{BASE_URL}/api/admin/media/upload",
            headers=self.headers,
            files=files,
            data=data
        )
        
        assert response.status_code == 200
        result = response.json()
        assert "id" in result
        assert result["title"] == "TEST_upload_image"
        assert result["file_type"] == "image"
        assert "url" in result
        
        # Store the ID for cleanup
        self.uploaded_media_id = result["id"]
        
        # Cleanup - delete the uploaded file
        delete_response = requests.delete(
            f"{BASE_URL}/api/admin/media/{result['id']}",
            headers=self.headers
        )
        assert delete_response.status_code == 200
    
    def test_media_delete_nonexistent(self):
        """Test deleting non-existent media"""
        response = requests.delete(
            f"{BASE_URL}/api/admin/media/nonexistent-id-12345",
            headers=self.headers
        )
        assert response.status_code == 404
    
    def test_media_bulk_delete(self):
        """Test bulk delete endpoint"""
        response = requests.post(
            f"{BASE_URL}/api/admin/media/bulk-delete",
            headers=self.headers,
            json=[]  # Empty list
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Deleted 0 files" in data["message"]


class TestAdminDashboardTabs:
    """Test Admin Dashboard tab-related APIs"""
    
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
    
    def test_user_management_apis(self):
        """Test User Management tab APIs"""
        # Stats
        stats_response = requests.get(
            f"{BASE_URL}/api/auth/admin/stats",
            headers=self.headers
        )
        assert stats_response.status_code == 200
        
        # Pending approvals
        pending_response = requests.get(
            f"{BASE_URL}/api/auth/admin/pending-approvals",
            headers=self.headers
        )
        assert pending_response.status_code == 200
        
        # Users list
        users_response = requests.get(
            f"{BASE_URL}/api/auth/admin/users",
            headers=self.headers
        )
        assert users_response.status_code == 200
    
    def test_content_management_apis(self):
        """Test Content Management tab APIs"""
        # Content stats
        stats_response = requests.get(
            f"{BASE_URL}/api/admin/content-stats",
            headers=self.headers
        )
        assert stats_response.status_code == 200
        
        # Content list
        content_response = requests.get(
            f"{BASE_URL}/api/admin/content?page=1&page_size=100",
            headers=self.headers
        )
        assert content_response.status_code == 200
    
    def test_media_library_apis(self):
        """Test Media Library tab APIs"""
        # Media stats
        stats_response = requests.get(
            f"{BASE_URL}/api/admin/media/stats",
            headers=self.headers
        )
        assert stats_response.status_code == 200
        
        # Media list
        media_response = requests.get(
            f"{BASE_URL}/api/admin/media/",
            headers=self.headers
        )
        assert media_response.status_code == 200


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
