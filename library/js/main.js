$(document).ready(function(){
    $('.js-set').on('submit', function(){
        var setMinutes = $('.js-minutes').val();
		
		if ($('.message.success').length > 0) {
			$('.message.success').remove();
		}

        if (setMinutes <= 60) {
            var countdownUntil = setMinutes * 60;
            $('.tymer-set').addClass('hidden');
            $('.tymer').removeClass('hidden');
            $('.tymer').countdown({
                until: countdownUntil,
                format: 'MS',
                compact: true,
				layout: '<span class="mins">{mnn}</span><span class="secs">{snn}</span>',
                onExpiry: allDone
            });
        }

        return false;
    });
	
	$('.js-pause').on('click',function() { 
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
	
	$('.js-clear').on('click',function() {
		clearTymer();
	});

    function allDone() {
        $('<span class="message success">Complete</span>').prependTo('.tymer-set');
		clearTymer();
    }
	
	function clearTymer() {
        $('.tymer').addClass('hidden').removeClass('hasCountdown').empty();
        $('.tymer-set').removeClass('hidden');
		$('.js-pause').text('Pause').data('state', false);
	}
});