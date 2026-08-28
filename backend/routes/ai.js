const router = require('express').Router();
const protect = require('../middlewares/protect');
const optionalProtect = require('../middlewares/optionalProtect');
const { processVideo, askQuestion, getChatHistory } = require('../controllers/aiController');

// Allow guests for processing and chatting
router.post('/process-video', optionalProtect, processVideo);
router.post('/chat', optionalProtect, askQuestion);

// Strictly require login to view history
router.get('/history', protect, getChatHistory);

module.exports = router;
