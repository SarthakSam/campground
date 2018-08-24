$(document).ready(function () {

    let changeCoverPhotoButton = $('.changeCoverPhotoButton')[0];
    if (changeCoverPhotoButton) {

        changeCoverPhotoButton.addEventListener('click', function () {
            
            let profilePageUpload = $('.profilePageUpload');
            if (!profilePageUpload[0]) {
                $('#profilePage').append("<div class='profilePageUpload'>" +
                    "<i class='fas fa-backspace'></i>" +
                    "<form enctype='multipart/form-data' class='form-control ' method='POST' action='/profile/upload?_method=PUT'>" +
                    "<div class='form-group'><input type='file' class='form-control' name='image' required></div>" +
                    "<div class='form-group'><input class='btn btn-info btn-block' type='submit'></div></form></div>");
            }

            let crossIcon = $('i.fas');
            // console.log(crossIcon);
            if (crossIcon[0]) {
                crossIcon[0].addEventListener('click', function () {
                    let profilePageUpload = $('.profilePageUpload')[0];
                    if(profilePageUpload){
                        // console.log(profilePageUpload.parentNode);
                        profilePageUpload.parentNode.removeChild(profilePageUpload);
                    }
                });
            }

        });
    }


});
