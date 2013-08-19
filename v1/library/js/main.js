$(document).ready(function() {
    // Monitor changes to minutes
    $('.js-minutes').on('change', function() {
        var setMinutes = leadingZero($(this).val());

        $('.number.mins').text(setMinutes);
    });

    // Monitor changes to seconds
    $('.js-seconds').on('change', function() {
        var setSeconds = leadingZero($(this).val());

        $('.number.secs').text(setSeconds);
    });

    // Action to take when user presses 'Start'
    $('.js-set').on('submit', function() {
        var setMinutes = $('.js-minutes').val(),
        setSeconds = $('.js-seconds').val();

        if (validTime(setMinutes,setSeconds)) {
            var countdownUntil = (setMinutes * 60) + (setSeconds * 1);

            $('.tymer-set').addClass('hidden');
            $('.tymer-control').removeClass('hidden');
            $('.tymer').countdown({
                until: countdownUntil,
                format: 'MS',
                compact: true,
                layout: '<span class="number mins">{mnn}</span><span class="sep">:</span><span class="number secs">{snn}</span>',
                onExpiry: allDone
            });
        } else {
            $('<div class="message error"><span>Minimum is 10secs.<br> Maximum is 99mins.</span></div>').prependTo('body');
            dismiss();
        }

        return false;
    });

    // Action to take when user presses 'pause'
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

    // Action to take when user presses 'Clear'
    $('.js-clear').on('click', function() {
        clearTymer();

        return false;
    });

    // Callback function - Tymer onExpiry
    function allDone() {
        $('<div class="message complete"><span>Tymer Completed</span></div>').prependTo('body');
        dismiss();
        clearTymer();
    }

    // Reset the UI once a Tymer has completed
    function clearTymer() {
        $('.tymer').removeClass('hasCountdown').countdown('pause');
        $('.number.mins').text('00');
        $('.number.secs').text('00');
        $('.js-minutes').val('0');
        $('.js-seconds').val('0');
        $('.tymer-set').removeClass('hidden');
        $('.tymer-control').addClass('hidden');
        $('.js-pause').text('Pause').data('state', false);
    }

    // Dismiss full screen messages
    function dismiss() {
        $('.message').append('<a href="#" class="btn dismiss js-dismiss">Dismiss</a>');
        $('.js-dismiss').click(function(e) {
            $('.message').remove();
            e.preventDefault();
        });
        $('html').on('keyup', function(kp) {
            if( kp.keyCode === 27 ) {
                $('.message').remove();
            }
        });
    }

    // Add leading zero to a value less than 10
    function leadingZero(number) {
        var n;

        n = ("0" + number).slice(-2);

        return n;
    }

    function validTime(m, s) {
        if (m <= 99 && m >= 1) {
            return true;
        } else if (m == 0) {
            if (s > 0) {
                return true;
            }
        }

        return false;
    }

    // Adds CSS to <head> for responsive line-height on Tymer
    function fit() {
        var buffer = $('.tymer-set').height(),
        tymerHeight = window.innerHeight - buffer,
        css = '<style type="text/css" id="fit">.tymer { height : ' + tymerHeight + 'px } .tymer span { line-height : ' + tymerHeight + 'px }</style>';

        if ($('#fit').length > 0) {
            $('#fit').remove();
        }

        $(css).appendTo('head');
    }

    // Initiate correct window size - initial load and subsequent window changes
    fit();

    $(window).on('resize', function(){
        fit();
    });
});