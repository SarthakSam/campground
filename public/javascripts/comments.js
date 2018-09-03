function commentBox() {
    if (!$('.commentHeader div')[1])
        $('.commentHeader').append(
            "<div style='margin: 5px auto;'>" +
            "<form action=" + window.location.pathname + "/comments method='POST'>" +
            "<div class='form-group>" +
            "<label for='name'>" +
            "<h3 style='display:inline'>Write your Comment</h3>" +
            "<button type='button' class='btn btn-danger btn-sm float-right hideFormButton'>Hide form</button>" +
            "</label>" +
            "<textArea name='commentText' class='form-control' rows='4' style='margin:20px auto;' placeholder='Write a new comment...' ></textArea>" +
            "</div>" +
            "<button type='submit' class='btn btn-success btn-block'>Comment</button>" +
            "</form>" +
            "</div>");

    let hideFormButton = $('.hideFormButton');
    if (hideFormButton)
        hideFormButton[0].addEventListener('click', function () {
            let elem = $('.commentHeader div')[1];
            if (elem)
                elem.parentNode.removeChild(elem);
        });
}

function likes(campgroundId,commentId,index) {
    let likeButton = $('button.likeButton')[index];
         if(likeButton.classList.contains('btn-outline-primary')){
            $.post(campgroundId+'/comments/' + commentId + '/like', function (response) {
                if(response.status==200){
                   let likeCount = $('i.fa-award')[index]; 
                   if(likeCount){
                       likeCount.textContent = response.count;
                   }
                   if(likeButton){
                       likeButton.classList.add('btn-primary');
                       likeButton.classList.remove('btn-outline-primary');
                       likeButton.innerText= "UNLIKE";
                   }
                }
            });         
         }
         else{
            $.post(campgroundId+'/comments/' + commentId + '/unlike', function (response) {
                        if(response.status==200){
                           let likeCount = $('i.fa-award')[index]; 
                           if(likeCount){
                               likeCount.textContent = response.count;
                           }
                           let likeButton = $('button.likeButton')[index];
                           if(likeButton){
                               likeButton.classList.remove('btn-primary');
                               likeButton.classList.add('btn-outline-primary');
                               likeButton.innerText= "LIKE";
                           }
                        }
                    });
         }
    return;
}