const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');

let storage = multer.diskStorage({
    destination:(req, file, cb) => cb(null, 'uploads/'),
    filename:(req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName); 
    } 
})

let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('myfile'); 

router.post('/', upload, async (req, res) => {
  if (!req.file) {
    return res.json({ error : 'All fields are required.'});
  }
  if (req.file.mimetype !== 'application/pdf' && req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png') {
    return res.status(400).send({ error: 'Invalid file type, only pdf, jpeg and png are allowed.' });
  }

  const file = new File({
    filename: req.file.filename,
    uuid: uuidv4(),
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype
  });

  try {
    const savedFile = await file.save();
    res.json({ file: `${process.env.APP_BASE_URL}/files/${savedFile.uuid}` });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred while saving the file to the database.' });
  }
});
  
router.post('/send', async (req, res) => {
  const { uuid, recipient, sender, } = req.body;
  if(!uuid || !recipient || !sender) {
      return res.status(422).send({ error: 'All fields are required except expiry.'});
  }
  // Get data from database 
  try {
    const file = await File.findOne({ uuid: uuid });
    if(file.sender) {
      return res.status(422).send({ error: 'Email already sent once.'});
    }
    file.sender = sender;
    file.receiver = recipient;
    const response = await file.save();
    // send mail
    const sendMail = require('../services/emailService');
    sendMail({
      from: sender,
      to: recipient,
      subject: 'eShare file sharing',
      text: `${sender} shared a file with you.`,
      html: require('../services/emailTemplate')({
                sender, 
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}` ,
                size: parseInt(file.size/1000) + ' KB',
                expires: '24 hours'
            })
    }).then(() => {
      return res.json({success: true});
    }).catch(err => {
      return res.status(500).json({error: 'Error in email sending.'});
    });
} catch(err) {
  return res.status(500).send({ error: 'Something went wrong.'});
}


});

module.exports = router;
