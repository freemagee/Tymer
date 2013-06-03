$(document).ready(function(){
    $('.js-minutes').on('change', function() {
        var setMinutes = leadingZero($(this).val());

        $('.number.mins').text(setMinutes);
    });

    $('.js-set').on('submit', function() {
        var setMinutes = $('.js-minutes').val();

        if ($('.message.success').length > 0) {
            $('.message.success').remove();
        }

        if (setMinutes <= 99) {
            var countdownUntil = setMinutes * 60;

            $('.tymer-set').addClass('hidden');
            $('.tymer-control').removeClass('hidden');
            $('.tymer').removeClass('hidden').countdown({
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
        $('<span class="message complete">Tymer Completed</span>').prependTo('.container');
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
});