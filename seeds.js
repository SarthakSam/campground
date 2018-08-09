let mongoose   = require('mongoose'),
    Campground = require('./models/campgrounds'),
    Comment    = require('./models/comment');

    let array=[
        {
            name: "triund",
            image: "https://imageresizer.static9.net.au/ajXtWFyJjoZov19NQGzpSOXP0MU=/1024x0/http%3A%2F%2Fprod.static9.net.au%2F_%2Fmedia%2FNetwork%2FImages%2F2017%2F02%2F03%2F11%2F03%2Fcamping-sleep-cycle.jpg",
            info: "yo yo yo"
        },    
        {
            name: "kheerganga",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbzgaL4sTtXWHyGEcfE7qKhCRDwCL2oUDvG_ivNqPD0q45qnO0Ig",
            info: "yo yo yo"
        },
        {
            name: "kailash",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4n4B92xczlVSFhBXQBTPDId6i5Inv6bYBvOWngXIYZKEseouw0g",
            info: "yo yo yo"
        }
    ]
    

    function seedDb(){
        Campground.remove({},(err) => {
            if(err)
               console.log(err);
             else
                console.log("deleted");  
                // array.forEach(function(seed){
                //       Campground.create(seed,(err,campground) => {
                //           if(err)
                //           console.log(err);
                //           else{
                //               Comment.create({ text: "i want to go there ", author: "Sarthak"},(err,comment) => {
                //                   if(err)
                //                     console.log(err);
                //                   else{ 
                //                     campground.comments.push(comment);
                //                     campground.save();
                //                     console.log("created everything")
                //                   }
                //               });
                //           }
                //       });  
                // });
        });
    }

module.exports = seedDb;    