let mongoose = require('mongoose');

let campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    info: String,
    postedBy: {
            username: String,
            id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
              },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]   
});

let Campground = mongoose.model("Campground",campgroundsSchema);

module.exports = Campground;