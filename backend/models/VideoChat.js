const mongoose = require('mongoose');

const videoChatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videoId: {
        type: String,
        required: true
    },
    messages: [
        {
            role: {
                type: String,
                enum: ['user', 'ai'],
                required: true
            },
            content: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('VideoChat', videoChatSchema);