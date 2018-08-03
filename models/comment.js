let mongoose = require('mongoose');

let commentsSchema = new mongoose.Schema({
    text: String,
    author: String,
});

let Comment = mongoose.model("Comment",commentsSchema);

module.exports = Comment;