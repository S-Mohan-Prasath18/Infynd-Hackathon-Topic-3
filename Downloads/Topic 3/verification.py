import os
import unittest
import io
import json
from app import app

class TestDataQACopilot(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_index(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Data QA Copilot', response.data)

    def test_analyze_api(self):
        # Create a dummy CSV
        csv_content = (
            "company_name,person_name,email,country\n"
            "TechFlo,John Doe,john.doe@techflo.io,USA\n"
            "Bad Corp,,invalid-email,\n"
        ).encode('utf-8')
        
        response = self.app.post(
            '/api/analyze',
            data={'file': (io.BytesIO(csv_content), 'test.csv')},
            content_type='multipart/form-data'
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertIn('metrics', data)
        self.assertIn('data', data)
        
        # Check specific logic
        rows = data['data']
        self.assertEqual(len(rows), 2)
        # Row 2 should have issues
        self.assertTrue(rows[1]['has_issues'])
        self.assertIn('missing_person_name', rows[1]['issues'])
        self.assertIn('invalid_email_format', rows[1]['issues'])

    def test_dedupe_logic(self):
        # Create CSV with duplicates
        csv_content = (
            "company_name,person_name,email\n"
            "A Corp,Alice,alice@a.com\n"
            "A Corp,Alice,alice@a.com\n"
        ).encode('utf-8')
        
        response = self.app.post(
            '/api/analyze',
            data={'file': (io.BytesIO(csv_content), 'dupes.csv')},
            content_type='multipart/form-data'
        )
        
        data = json.loads(response.data)
        rows = data['data']
        # The second row should be marked duplicate
        self.assertTrue(rows[1]['is_duplicate'])

if __name__ == '__main__':
    unittest.main()
