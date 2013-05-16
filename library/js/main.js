$(document).ready(function(){
    $('.js-set').on('submit', function(){
        var setMinutes = $('.js-minutes').val();

        if (setMinutes <= 60) {
            var countdownUntil = setMinutes * 60;
            $('.tymer-set').addClass('hidden');
            $('.tymer').removeClass('hidden');
            $('.tymer').countdown({
                until: countdownUntil,
                format: 'MS',
                compact: true,
                onExpiry: allDone
            });
        }

        return false;
    });

    function allDone() {
        $('<span class="message success">All done!</span>').appendTo('.tymer-set');
        $('.tymer').addClass('hidden');
        $('.tymer-set').removeClass('hidden');
    }
});