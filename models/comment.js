let mongoose = require('mongoose');

let commentsSchema = new mongoose.Schema({
    text: String,
    author: {
               id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'user'
                     },
               name: String
    }
});

let Comment = mongoose.model("Comment",commentsSchema);

module.exports = Comment;