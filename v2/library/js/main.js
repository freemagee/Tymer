function init() {
    var intervalId;

    $('.tymer').addClass('active');
    $('.tymer-controls').addClass('active');

    // Trigger help panel
    $('.js-help').on('click', function() {
        var helpText = '<img src="library/img/logo-icon.png" alt="Tymer logo" class="logo-icon"><h2 class="alpha">Simple Free Online Timer</h2><p>Tymer is a mobile optimised countdown timer. Whether you are cooking, exercising or practising the pomodoro technique, Tymer is for you.</p><ul><li>Supports a countdown up to one hour - [MM:SS]</li><li>Click anywhere to start countdown</li><li>Alarm sounds when Tymer has completed (PC/MAC only)</li></ul><p>More info about <a href="why.html">Tymer</a>. Built by <a href="http://neilmagee.com">Neil Magee</a>.</p>';
        $('.message-text').html(helpText);
        $('.message').addClass('help-panel').addClass('show');
        dismiss( $('.message') );
    });

    // Monitor changes to minutes
    $('.js-minutes').on('change', function() {
        var setMinutes = leadingZero($(this).val());

        clearInterval(intervalId);

        if (setMinutes <= 59) {
            $('.number.mins').text(setMinutes);
        } else if (setMinutes == 60) {
            $('.number.mins').text(setMinutes);
            $('.number.secs').text('00');
        } else {
            triggerError(1);
            $(this).val(60);
            $('.number.mins').text(60);
        }
    });

    // Monitor changes to seconds
    $('.js-seconds').on('change', function() {
        var setSeconds = leadingZero($(this).val()),
        currentMinutes = leadingZero($('.js-minutes').val());

        clearInterval(intervalId);

        if (setSeconds <= 59) {
            if (currentMinutes != 60) {
                $('.number.secs').text(setSeconds);
            } else {
                triggerError(1);
                $(this).val(0);
                $('.number.secs').text('00');
            }
        } else {
            $(this).val(0);
            $('.number.secs').text('00');
        }
    });

    // Action to take when user presses 'Start'
    $('.tymer').on('click', function() {
        var started = $(this).hasClass('hasCountdown');

        if (!started) {
            var setMinutes = $('.js-minutes').val(),
            setSeconds = $('.js-seconds').val();

            if (validTime(setMinutes,setSeconds)) {
                var countdownUntil = (setMinutes * 60) + (setSeconds * 1);

                $('.tymer-set').addClass('inactive');
                $('.tymer-clear').addClass('active');
                $('.tymer').countdown({
                    until: countdownUntil,
                    format: 'MS',
                    compact: true,
                    layout: '<span class="number mins">{mnn}</span><span class="sep"></span><span class="number secs">{snn}</span>',
                    onExpiry: allDone
                });
            } else {
                triggerError(0);
            }
        } else {
            var state = $(this).data('state');

            state = !state;

            if (state) {
                $(this).countdown('pause').addClass('paused');
            } else {
                $(this).countdown('resume').removeClass('paused');
            }

            $(this).data('state', state);
        }

        return false;
    });

    // Action to take when user presses 'Clear'
    $('.js-clear').on('click', function() {
        clearTymer();

        return false;
    });

    // Adjust minutes and seconds
    $('.js-mins-minus').on('mousedown', function() {
        var target = $('.js-minutes');

        adjustTime(target, 'minus', 'min');
        intervalId = setInterval(function() { adjustTime(target, 'minus', 'min'); }, 300);
    }).on('mouseup', function() {
        clearInterval(intervalId);
    });

    $('.js-mins-plus').on('mousedown', function() {
        var target = $('.js-minutes');

        adjustTime(target, 'plus', 'min');
        intervalId = setInterval(function() { adjustTime(target, 'plus', 'min'); }, 300);
    }).on('mouseup', function() {
        clearInterval(intervalId);
    });

    $('.js-secs-minus').on('mousedown', function() {
        var target = $('.js-seconds');

        adjustTime(target, 'minus', 'sec');
        intervalId = setInterval(function() { adjustTime(target, 'minus', 'sec'); }, 300);
    }).on('mouseup', function() {
        clearInterval(intervalId);
    });

    $('.js-secs-plus').on('mousedown', function() {
        var target = $('.js-seconds');

        adjustTime(target, 'plus', 'sec');
        intervalId = setInterval(function() { adjustTime(target, 'plus', 'sec'); }, 300);
    }).on('mouseup', function() {
        clearInterval(intervalId);
    });

    function adjustTime(target, type, source) {
        var initial = target.val(),
        newVal;

        if (type === 'plus') {
            newVal = (initial*1) + 1;

            if (source === 'min') {
                if (initial <= 59) {
                    target.val(leadingZero(newVal));
                    if (newVal <= 60) {
                        $('.number.mins').text(leadingZero(newVal));
                    }
                } else {
                    triggerError(1);
                }
            } else if (source === 'sec') {
                if (initial <= 58) {
                    target.val(leadingZero(newVal));
                    if (newVal <= 59) {
                        $('.number.secs').text(leadingZero(newVal));
                    }
                }
            }
        } else if (type === 'minus') {
            newVal = (initial-1);

            if (initial >= 1) {
                target.val(leadingZero(newVal));
                if (newVal >= 0) {
                    $('.number.' + source + 's').text(leadingZero(newVal));
                }
            }
        }
    }

    // Callback function - Tymer onExpiry
    function allDone() {
        $('.message-text').text('Tymer Completed');
        $('.message').addClass('complete').addClass('show');
        dismiss( $('.message') );
        startAlertSound();
        clearTymer();
    }

    // Reset the UI once a Tymer has completed
    function clearTymer() {
        $('.tymer').removeClass('hasCountdown').removeClass('paused').countdown('pause');
        $('.number.mins').text('00');
        $('.number.secs').text('00');
        $('.js-minutes').val('00');
        $('.js-seconds').val('00');
        $('.tymer-set').removeClass('inactive');
        $('.tymer-clear').removeClass('active');
        $('.js-pause').text('Pause').data('state', false);
    }

    function triggerError(type) {
        var msg = 'There has been a technical error with Tymer. Sorry for the inconvenience.';

        if (type === 0) {
            msg = 'Please enter a time. Format [MM:SS].';
        }
        else if (type === 1) {
            msg = 'Maximum Tymer is 60 minutes';
        }
        $('.message-text').text(msg);
        $('.message').addClass('error').addClass('show');
        dismiss( $('.message') );
        clearInterval(intervalId);
    }

    // Dismiss full screen messages
    function dismiss(message) {
        $('.dismiss').click(function(e) {
            message.attr('class', 'message');
            message.find('.message-text').empty();
            removeAlertSound();

            e.preventDefault();
        });
        $('html').on('keyup', function(kp) {
            if( kp.keyCode === 27 ) {
                message.attr('class', 'message');
                message.find('.message-text').empty();
                removeAlertSound();
            }
        });
    }

    // Add leading zero to a value less than 10
    function leadingZero(number) {
        var n;

        if (number < 10) {
            n = ("0" + number).slice(-2);
        } else {
            n = number;
        }

        return n;
    }

    function validTime(min, sec) {
        var m = parseInt(min,10),
        s = parseInt(sec,10);

        if (m <= 60 && m >= 1) {
            return true;
        } else if (m === 0) {
            if (s > 0) {
                return true;
            }
        }

        return false;
    }

    // Audio effects
    function startAlertSound() {
        $('<audio id="alert-sound"></audio>').prependTo('body');
        $('#alert-sound').attr({
            'autoplay' : true,
            'loop' : true
        });
        $('<source src="library/audio/alert.wav" type="audio/wav"><source src="library/audio/alert.mp3" type="audio/mp3">').prependTo('#alert-sound');
    }
    function removeAlertSound() {
        if ($("#alert-sound").length > 0) {
            $("#alert-sound").remove();
        }
    }

    // Adds CSS to <head> for responsive font size/line-height on Tymer spans
    function fit() {
        var fontHeight = 16,
        fontHeightFactor = 1.71,
        buffer = $('.tymer-set').height(),
        tymerHeight = window.innerHeight - buffer,
        availableTotalWidth = window.innerWidth,
        currentFontWidth = Math.floor( (availableTotalWidth / 100) * 24 ),
        currentFontHeight = parseFloat($('.tymer span').css('font-size')),
        proposedFontHeight = tymerHeight,
        proposedFontWidth = Math.floor( proposedFontHeight / fontHeightFactor ),
        newStyle = optimumFit();

        function optimumFit() {
            var optimumFontHeight;

            if ( proposedFontWidth < currentFontWidth ) {
                optimumFontHeight = Math.floor( ( ( proposedFontHeight / 100 ) * 95 ) );
            } else {
                if ( ( proposedFontWidth * 4 ) + ( ( proposedFontWidth / 100 )*10 ) > availableTotalWidth ) {
                    optimumFontHeight = (currentFontWidth * fontHeightFactor);
                } else {
                    optimumFontHeight = currentFontHeight;
                }
            }

            output = '<style type="text/css" id="fit">';
            output += '.tymer { height : ' + tymerHeight + 'px } ';
            output += '.tymer span { line-height : ' + tymerHeight + 'px; ';
            output += 'font-size: ' + optimumFontHeight + 'px; }';
            output += '</style>';

            return output;
        }

        if ($('#fit').length > 0) {
            $('#fit').remove();
        }

        $(newStyle).appendTo('head');
    }

    // Initiate correct window size - initial load and subsequent window changes
    fit();

    $(window).on('resize', function(){
        fit();
    });
}

$(document).ready(function() {
    init();
});