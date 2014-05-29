import unittest
import app

class AppTestCase(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_any(self):
        response = self.app.get('/')
        assert True

if __name__ == '__main__':
    unittest.main()