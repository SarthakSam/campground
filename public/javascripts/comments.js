function commentBox(){
    if(!$('.commentHeader div')[1])
   $('.commentHeader').append(
       "<div style='margin: 5px auto;'>"+
       "<form action="+window.location.pathname+"/comments method='POST'>"+   
       "<div class='form-group>"+
       "<label for='name'>"+
       "<h3 style='display:inline'>Write your Comment</h3>"+
       "<button type='button' class='btn btn-danger btn-sm float-right hideFormButton'>Hide form</button>"+
       "</label>"+
       "<textArea name='commentText' class='form-control' rows='4' style='margin:20px auto;' placeholder='Write a new comment...' ></textArea>"+
       "</div>"+
       "<button type='submit' class='btn btn-success btn-block'>Comment</button>"+
       "</form>"+
       "</div>");

     let hideFormButton = $('.hideFormButton');
     if(hideFormButton)
     hideFormButton[0].addEventListener('click',function(){
         let elem = $('.commentHeader div')[1];
          if(elem)  
          elem.parentNode.removeChild(elem);
     });
}