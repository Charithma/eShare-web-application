const emailService = require('../services/emailService');
const nodemailer = require('nodemailer');

jest.mock('nodemailer');

describe('Email Service', () => {
  it('should send an email', async () => {
    const mockSendMail = jest.fn();
    nodemailer.createTransport.mockReturnValue({
      sendMail: mockSendMail,
    });

    const testData = {
      from: 'sender@example.com',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'This is the plain text content.',
      html: '<p>This is the HTML content.</p>',
    };

    await emailService(testData);

    expect(mockSendMail).toHaveBeenCalledWith({
      from: `eShare <${testData.from}>`,
      to: testData.to,
      subject: testData.subject,
      text: testData.text,
      html: testData.html,
    });
  });
});
