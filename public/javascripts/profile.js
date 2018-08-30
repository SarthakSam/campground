$(document).ready(function () {

    function uploadPhoto(argument){
        let profilePageUpload = $('.profilePageUpload');
        if (!profilePageUpload[0]) {
            $('#profilePage').append("<div class='profilePageUpload'>" +
                "<i class='fas fa-backspace'></i>" +
                "<form enctype='multipart/form-data' class='form-control ' method='POST' action="+ window.location.pathname+'/upload/'+argument +"?_method=PUT>" +
                "<div class='form-group'><input type='file' class='form-control' name='image' required></div>" +
                "<div class='form-group'><input class='btn btn-info btn-block' type='submit'></div></form></div>");
        }
        let crossIcon = $('i.fa-backspace');
        if (crossIcon[0]) {
            crossIcon[0].addEventListener('click', function () {
                let profilePageUpload = $('.profilePageUpload')[0];
                if(profilePageUpload){
                    profilePageUpload.parentNode.removeChild(profilePageUpload);
                }
            });
        }
    }

    let changeCoverPhotoButton = $('.changeCoverPhotoButton')[0];
    if (changeCoverPhotoButton) {
        changeCoverPhotoButton.addEventListener('click',function(){
            uploadPhoto(1);
        });
    }


    let changeProfilePhotoButton = $('.changeProfilePhotoButton')[0];
    if(changeProfilePhotoButton){
            changeProfilePhotoButton.addEventListener('click',function(){
                uploadPhoto(2);
            });
    }


});
