var counterName = 'Фото',
    scrollOffset = 0;

$(document).ready(function() {

    fotoramaCounter(counterName);

    $('.js-toggle-hamburger').on('click', function (e) {
        e.preventDefault();
        if(!$('.b-wrapper').is('.b-wrapper--search-open')) {
            $('body').toggleClass('is-scroll-disabled');
        }
        $('.b-wrapper').toggleClass('b-wrapper--open');
        if($(this).is('.is-active')) {
            $('.b-sub-menu').slideUp();
        }
        if($(this).parent().is('.b-header__hamburger')) {
            $('.b-menu').find('.js-toggle-hamburger').toggleClass('is-active');
        } else {
            $(this).toggleClass('is-active');
        }
    });

    $('.b-content-sticky').stick_in_parent();

    $('.js-nav-item.has-child').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $(this).find('.b-sub-menu').slideToggle();
    });

    $('.js-header-language').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $(this).next().toggle();
    });

    $('.js-search-open').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        if(!$('.b-wrapper').is('.b-wrapper--open')) {
            $('body').toggleClass('is-scroll-disabled');
        }
        $('.b-wrapper').toggleClass('b-wrapper--search-open');
    });

    //Open popup
    $('.js-open-popup').on('click', function (e) {
        e.preventDefault();
        var dataPopup = $(this).attr('data-popup'),
            currentPopup = $('.b-popup[data-popup='+dataPopup+']');

        $('body').addClass('is-scroll-disabled');
        currentPopup.addClass('b-popup--open');
    });

    //Close popup
    $('.js-close-popup').on('click', function (e) {
        e.preventDefault();
        $('body').removeClass('is-scroll-disabled');
        $(this).closest('.b-popup').removeClass('b-popup--open');
    });

    //Top button
    $('.js-top-button').on('click', function (e) {
        e.preventDefault();
        $('.s-wrapper').animate({scrollTop: 0}, 1000);
        return false;
    });
});

// $('.js-search-open').on('click', function (e) {
//     if (!e.target.closest('.content-popup')) {
//
//     }
// });

$('.s-wrapper').on('scroll', function() {
    scrollOffset = $('.b-wrapper').offset().top * -1;
    if (scrollOffset >= 200) {
        $('.b-up-button').addClass('b-up-button--show');
    } else {
        $('.b-up-button').removeClass('b-up-button--show');
    }
});

function fotoramaCounter(name) {
    $('.fotorama').on('fotorama:ready', function (e, fotorama) {
        var fotoramaWrap = $(this).find('.fotorama__wrap'),
            info = $('<span class="fotorama__counter"/>'),
            capture = $('<span class="fotorama__capture"/>');

        info.text(name + ' ' + (fotorama.activeIndex + 1) + '/' + fotorama.size);
        capture.text(fotorama.activeFrame.caption);
        fotoramaWrap.append(info);
        fotoramaWrap.append(capture);
    });

    $('.fotorama').on('fotorama:show', function (e, fotorama, extra) {
        var info = $(this).find('.fotorama__counter'),
            capture = $(this).find('.fotorama__capture');
        info.text(name + ' ' + (fotorama.activeIndex + 1) + '/' + fotorama.size);
        capture.text(fotorama.activeFrame.caption);
    });
}
