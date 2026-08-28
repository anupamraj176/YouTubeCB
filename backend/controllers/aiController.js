const axios = require('axios');
const VideoChat = require('../models/VideoChat');
const AppError = require('../utils/AppError');

// Make sure this matches your Python FastAPI port!
const PYTHON_AI_URL = 'http://127.0.0.1:8000'; 

const processVideo = async (req, res, next) => {
    try {
        const { video_id } = req.body;
        if (!video_id) return next(new AppError('Please provide a video_id', 400));

        // 1. Forward the request to Python
        const response = await axios.post(`${PYTHON_AI_URL}/api/process-video`, { video_id });

        // 2. Return Python's success message
        res.status(200).json({
            success: true,
            message: response.data.message
        });
    } catch (error) {
        // If Python throws an error, forward it
        const msg = error.response?.data?.detail || 'Error communicating with AI Service';
        next(new AppError(msg, 500));
    }
};

const askQuestion = async (req, res, next) => {
    try {
        const { video_id, question } = req.body;
        if (!video_id || !question) return next(new AppError('Provide video_id and question', 400));

        // 1. If logged in, find or create Chat History document
        let chat;
        if (req.user) {
            chat = await VideoChat.findOne({ user: req.user.id, videoId: video_id });
            if (!chat) {
                chat = await VideoChat.create({ user: req.user.id, videoId: video_id, messages: [] });
            }
            // 2. Save user's question to MongoDB
            chat.messages.push({ role: 'user', content: question });
            await chat.save();
        }

        // 3. Ask Python the question
        const response = await axios.post(`${PYTHON_AI_URL}/api/chat`, {
            video_id,
            question
        });

        // 4. If logged in, save the AI's answer to MongoDB
        const aiAnswer = response.data.answer;
        if (req.user && chat) {
            chat.messages.push({ role: 'ai', content: aiAnswer });
            await chat.save();
        }

        // 5. Send answer to the frontend
        res.status(200).json({
            success: true,
            answer: aiAnswer
        });

    } catch (error) {
        const msg = error.response?.data?.detail || 'Error communicating with AI Service';
        next(new AppError(msg, 500));
    }
};

// Quick route to fetch all past chats so the frontend can display a sidebar history
const getChatHistory = async (req, res, next) => {
    try {
        const history = await VideoChat.find({ user: req.user.id }).sort('-updatedAt');
        res.status(200).json({ success: true, history });
    } catch (error) {
        next(error);
    }
};

module.exports = { processVideo, askQuestion, getChatHistory };
