$(function () { // document ready

    var $sidebar = $('#sidebar');
    var stickyTop = $sidebar.offset().top; // returns number

    $(window).scroll(function () { // scroll event

        var windowTop = $(window).scrollTop(); // returns number

        if (stickyTop < windowTop) {
            $sidebar.css({position: 'fixed', top: 20});
        }
        else {
            $sidebar.css('position', 'static');
        }

    });

});