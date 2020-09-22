$(document).ready(function() {
    $('.f-select__element').each(function () {
        $(this).select2({
            minimumResultsForSearch: -1
        });
    });

    $('.js-select-counter').on('select2:select', function (e) {
        let buttonValue,
            selectValue = e.params.data.element.value,
            inputValue = $('.js-input-counter').val();

        $('.js-button-price').find('.count').text(selectValue * inputValue);
    });

    $('.js-input-counter').on('input', function (e) {
        let inputValue = $(this).val(),
            selectValue = $('.select2-selection__rendered').attr('title');

        if (selectValue) {
            $('.js-button-price').find('.count').text(inputValue * selectValue);
        }

        if (inputValue === '') {
            $('.js-button-price').find('.count').text('0');
        }
    });

    $('a[data-scroll]').click( function(){
        var scroll = $(this).data('scroll');
        $('html, body').animate({ scrollTop: $(scroll).offset().top}, 1000);
        return false;
    });

    changeLanguage();
    // changeText();

    $('.js-header-menu').on('click', function (e) {
        e.preventDefault();
        $(this).find('.b-header-humburger').toggleClass('active');
        $(this).next().slideToggle();
    });
});

function changeLanguage() {
    $('.js-language').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $(this).next().toggle();
    });

    $(document).mouseup(function (e) {
        if($('.b-header-dropdown').is(':visible')) {
            if ($('.b-header-language').has(e.target).length === 0){
                $('.b-header-dropdown').hide();
                $('.js-language').removeClass('active');
            }
        }
    });
}

function changeText() {
    var TxtType = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

        var that = this;
        var delta = 120 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(function() {
            that.tick();
        }, delta);
    };

    window.onload = function() {
        var elements = document.getElementsByClassName('typewrite');
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
                new TxtType(elements[i], JSON.parse(toRotate), period);
            }
        }
    };
}
