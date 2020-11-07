$(document).ready(() => {
  let lastScrollTop = 0;
  $(window).scroll(() => {
    const currentScrollTop = $(this).scrollTop();
    const nav = $('.navbar');
    setTimeout(function () {
      if (currentScrollTop > lastScrollTop) {
        nav.addClass('hide');
        $('.navbar-collapse').collapse('hide');
      } else {
        nav.removeClass('hide');
      }
      lastScrollTop = currentScrollTop;
    }, 100);
  });

  $(window).click(() => {
    $('.navbar-collapse').collapse('hide');
  });

  $(window).resize(() => {
    if ($(window).width() >= 992 && $('.navbar-collapse').hasClass('show')) {
      $('.navbar-collapse').removeClass('show');
    }
  });
});
