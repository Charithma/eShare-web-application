const request = require('supertest');
const express = require('express');
const { File } = require('../models/file');
const router = require('../routes/files');

// Mock the File model and its functions
jest.mock('../models/file.js', () => ({
    findOne: jest.fn(),
    prototype: {
        save: jest.fn().mockResolvedValue({ uuid: 'mock-uuid' }),
    },
}));

// Mock the emailService
jest.mock('../services/emailService', () => jest.fn().mockResolvedValue());

// Mock the emailTemplate
jest.mock('../services/emailTemplate', () => jest.fn().mockReturnValue('<html><body>Mock Email Template</body></html>'));

// Create an Express app and use the files router
const app = express();
app.use('/files', router);

describe('Test files.js routes', () => {
    it('should return 400 for POST /files when file type is not allowed', async () => {
        const response = await request(app)
            .post('/files')
            .field('filename', 'test.txt')
            .attach('myfile', 'tests/mock_files/not_allowed_file.txt'); // Mock a file with non-allowed type

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid file type, only pdf, jpeg and png are allowed.');
    });
});
