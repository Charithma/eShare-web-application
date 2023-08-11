const request = require('supertest');
const app = require('../server');
const cheerio = require('cheerio');

describe('Home Page View', () => {
    it('should render the home page', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.type).toBe('text/html');

        const $ = cheerio.load(response.text); // Load the HTML response using Cheerio

        // Test the presence of specific elements in the view
        const pageTitle = $('title').text();
        const fileInput = $('#fileInput');
        const selectFileBtn = $('#fileSelectBtn');

        // Perform assertions
        expect(pageTitle).toContain('eShare - easy file sharing');
        expect(fileInput).toHaveLength(1);
        expect(selectFileBtn).toHaveLength(1);
    });
});
