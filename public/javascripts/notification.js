$(document).ready(function () {
    let notificationContent = [];
    let unreadNotifications = [];
    let notification = $('i.fa-bell');
    if (notification[0])
        notification[0].addEventListener('click', function () {
            if (!$('.notificationBox')[0]) {

                $('i.fa-bell').append('<div class="notificationBox"><ul></ul></div>');
                unreadNotifications.forEach(function (notification) {
                    $('.notificationBox ul').append('<li><a class="btn btn-light btn-block" href = /campgrounds/'+notification.post.id+'>' + notification.notificationBy.username + " commented on your post " + notification.post.name + '</a></li>');
                });
                $('.notificationBox ul').append('<a href="/notifications/" class="btn btn-link">Show all notifications</a>');
                let notificationLis = $('.notificationBox ul li');
                for (let i = 0; i < notificationLis.length; i++) {
                    notificationLis[i].addEventListener('click', function () {
                        markAsRead(unreadNotifications[i]._id);
                    });
                }
            }
        });

    let markAsRead = function (id) {
        $.post("/markasread/"+id+"?_method=PUT",function(res){
            console.log(res);
        });
    }

    let getNotifications = function () {
        $.get('/unreadNotifications', function (res) {
            console.log(res);
            if (res.status == 200) {
                notificationContent = res.notifications;
                unreadNotifications = res.unreadNotifications;
                if(unreadNotifications.length>0)
                notification[0].textContent = unreadNotifications.length;
                notification.css("color", "white");
                notificationsPage();
            }
        });
    }

    function notificationsPage(){
        let lis = $('ul.notificationsContainer li');
        console.log(lis);
        if(lis.length>0){
            for (let i = 0; i < lis.length; i++) {
                if(!notificationContent[i].read){
                    lis[i].addEventListener('click', function () {
                        markAsRead(notificationContent[i]._id);
                    });
                    lis[i].classList.add('unReadNotifications');    
                }
            }
        }

    }


    $(document).mouseup(function (e) {
        var container = $(".notificationBox");

        // if the target of the click isn't the container nor a descendant of the container
        if (container[0] && !container.is(e.target) && container.has(e.target).length === 0) {
            container[0].parentNode.removeChild(container[0]);
        }
    });
    setInterval(getNotifications, 1000 * 60*5);
    getNotifications();
 
});