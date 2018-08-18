let mongoose = require('mongoose');

let campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    info: String,
    price: Number,
    createdAt: { type: Date, default: Date.now },
    location: String,
    navigationPosition: { type:  {
                                    Latitude: Number,
                                    Longitude:Number
                                 },
                          default: undefined  
                        },
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