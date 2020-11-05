let lastScrollTop = 0;
$(window).scroll(function () {
  const currentScrollTop = $(this).scrollTop();
  const nav = $('.navbar');
  setTimeout(function () {
    if (currentScrollTop > lastScrollTop) {
      nav.addClass('hide');
    } else {
      nav.removeClass('hide');
    }
    lastScrollTop = currentScrollTop;
  }, 100);
});
