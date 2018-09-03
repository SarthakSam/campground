let mongoose = require('mongoose');

let commentsSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    author: {
               id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'user'
                     },
               name: String
    },
    likes: [    
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'  
            }
            ]    
});

let Comment = mongoose.model("Comment",commentsSchema);

module.exports = Comment;