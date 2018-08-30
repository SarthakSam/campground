let mongoose = require('mongoose');

let notificationSchema = new mongoose.Schema({
    type: Number,
    post: {
        name: String,
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Campground'    
        }
    },
    notificationFor: {   
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'                        
    },
    notificationBy: {   
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User'                        
                    },
    read: {type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

let Notification = mongoose.model('notification',notificationSchema);

module.exports = Notification;