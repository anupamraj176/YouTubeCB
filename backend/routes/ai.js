const router = require('express').Router();
const protect = require('../middlewares/protect');
const { processVideo, askQuestion, getChatHistory } = require('../controllers/aiController');

// All AI routes require the user to be logged in
router.use(protect);

router.post('/process-video', processVideo);
router.post('/chat', askQuestion);
router.get('/history', getChatHistory);

module.exports = router;
