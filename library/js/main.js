$(document).ready(function() {
    // Tymer related events
    $('.js-minutes').on('change', function() {
        var setMinutes = leadingZero($(this).val());

        $('.number.mins').text(setMinutes);
    });

    $('.js-set').on('submit', function() {
        var setMinutes = $('.js-minutes').val();

        if ($('.message.complete').length > 0) {
            $('.message.complete').remove();
        }

        if (setMinutes <= 99) {
            var countdownUntil = setMinutes * 60;

            $('.tymer-set').addClass('hidden');
            $('.tymer-control').removeClass('hidden');
            $('.tymer').countdown({
                until: countdownUntil,
                format: 'MS',
                compact: true,
                layout: '<span class="number mins">{mnn}</span><span class="sep">:</span><span class="number secs">{snn}</span>',
                onExpiry: allDone
            });
        }

        return false;
    });

    $('.js-pause').on('click', function() {
        var state = $(this).data('state');

        state = !state;

        if (state) {
            $(this).text('Resume');
            $('.tymer').countdown('pause');
        } else {
            $(this).text('Pause');
            $('.tymer').countdown('resume');
        }

        $(this).data('state', state);
    });

    $('.js-clear').on('click', function() {
        clearTymer();
    });

    function allDone() {
        $('<div class="message complete">Tymer Completed</div>').prependTo('.container').hide().slideDown(1000);
        setTimeout(function(){
            $('.message.complete').slideUp(1000);
        }, 4000);
        clearTymer();
    }

    function clearTymer() {
        $('.tymer').removeClass('hasCountdown').countdown('pause');
        $('.number.mins').text('01');
        $('.number.secs').text('00');
        $('.tymer-set').removeClass('hidden');
        $('.tymer-control').addClass('hidden');
        $('.js-pause').text('Pause').data('state', false);
    }

    function leadingZero(number) {
        var n;

        n = ("0" + number).slice(-2);

        return n;
    }

    function fit() {
        var buffer = $('.tymer-set').height(),
        tymerHeight = window.innerHeight - buffer,
        css = '<style type="text/css" id="fit">.tymer { height : ' + tymerHeight + 'px } .tymer span { line-height : ' + tymerHeight + 'px }</style>';

        // $('.tymer').css({'min-height' : tymerHeight + 'px'});
        // $('.tymer span').css({
        //     'line-height' : tymerHeight + 'px'
        // });

        if ($('#fit').length > 0) {
            $('#fit').remove();
        }
        $(css).appendTo('head');
    }

    // Initiate correct window size
    fit();

    $(window).on('resize', function(){
        fit();
    });
});