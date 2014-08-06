function init() {
    var intervalId, globalRemainingTime;

    // Active class allows intro animation on UI
    $('.tymer').addClass('active');
    $('.tymer-controls').addClass('active');

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
            var setMinutes = parseInt( $('.js-minutes').val() ),
            setSeconds = parseInt( $('.js-seconds').val() );

            if ( validTime( setMinutes, setSeconds ) ) {
                var targetTime = ( setMinutes * 60 ) + ( setSeconds * 1 ),
                milliSecs = ( targetTime * 1000 );

                $('.tymer-set').addClass('inactive');
                $('.tymer-clear').addClass('active');
                $(this).addClass('hasCountdown');

                startCountdown(milliSecs);

            } else {
                triggerError(0);
            }
        } else {
            var state = $(this).attr('data-state');

            if (state == 'waiting') {
                $(this).addClass('paused');
                //console.log(globalRemainingTime);
                $(this).attr('data-state', 'paused');
                clearInterval(countdown);
            } else {
                $(this).removeClass('paused');
                $(this).attr('data-state', 'waiting');
                startCountdown(globalRemainingTime);
            }
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

    // FUNCTIONS
    // ********************************************************************************//

    function adjustTime(target, type, source) {
        var initial = target.val(),
        newVal;

        if (type === 'plus') {

            newVal = ( initial * 1 ) + 1;

            if (source === 'min') {
                if (initial <= 59) {
                    target.val(leadingZero(newVal));
                    $('.number.mins').text(leadingZero(newVal));
                } else if (initial == 60) {
                    $('.number.mins').text('00');
                    target.val('00');
                }
            }

            if (source === 'sec') {
                if ( $('.js-minutes').val() != 60 ) {
                    if (initial <= 58) {
                        target.val(leadingZero(newVal));
                        $('.number.secs').text(leadingZero(newVal));
                    } else if (initial == 59) {
                        $('.number.secs').text('00');
                        target.val('00');
                    }
                } else {
                    triggerError(1);
                }
            }

        } else if (type === 'minus') {

            newVal = ( initial - 1 );

            if (source === 'min') {
                if (initial <= 60 && initial != 0) {
                    target.val(leadingZero(newVal));
                    $('.number.mins').text(leadingZero(newVal));
                } else if (initial == 0) {
                    target.val('60');
                    $('.number.mins').text('60');
                }
            }

            if (source === 'sec') {
                if ( $('.js-minutes').val() != 60 ) {
                    if (initial <= 60 && initial != 0) {
                        target.val(leadingZero(newVal));
                        $('.number.secs').text(leadingZero(newVal));
                    } else if (initial == 0) {
                        target.val('59');
                        $('.number.secs').text('59');
                    }
                } else {
                    triggerError(1);
                }
            }
        }
    }

    function startCountdown(ms) {
        var minsText = $('.tymer').find('.mins'),
        secsText = $('.tymer').find('.secs');

        countdown = setInterval(function () {
            if ( ms === 0 ) {
                countdownComplete();
            } else {
                ms = ms - 1000;

                var remainingTime = new Date(ms),
                remainingSecs = remainingTime.getSeconds(),
                remainingMins = remainingTime.getMinutes(),
                remainingHours = remainingTime.getHours();

                globalRemainingTime = ms;

                // Deal with 60 mins equalling 1 hour
                // & 1 hour equalling 00 mins in time format 01:00:00
                if (remainingHours >= 1) {
                    secsText.text( leadingZero(remainingSecs) );
                    minsText.text('60');
                } else {
                    secsText.text( leadingZero(remainingSecs) );
                    minsText.text( leadingZero(remainingMins) );
                }
            }
        }, 1000);
    }

    function countdownComplete() {
        clearInterval(countdown);
        allDone();
    }

    // Tidy up on completion
    function allDone() {
        $('.message-text').text('Tymer Completed');
        $('.message').addClass('complete').addClass('show');
        $('.js-prompt-btn').removeClass('help').addClass('dismiss').text('Dismiss');
        startAlertSound();
        var initClear = setInterval(function() {
            clearTymer();
            clearInterval(initClear);
        }, 1000);
    }

    // Reset the UI once a Tymer has completed
    function clearTymer() {
        clearInterval(countdown);
        $('.tymer').removeClass('hasCountdown').removeClass('paused').attr('data-state', 'waiting');
        $('.number.mins').text('00');
        $('.number.secs').text('00');
        $('.js-minutes').val('00');
        $('.js-seconds').val('00');
        $('.tymer-set').removeClass('inactive');
        $('.tymer-clear').removeClass('active');
    }

    function triggerError(type) {
        var msg = 'There has been a technical error with Tymer. Sorry for the inconvenience.';

        if (type === 0) {
            msg = 'Please enter a time. Use the +/- buttons to adjust minutes and seconds.';
        }
        else if (type === 1) {
            msg = 'Maximum Tymer is 60 minutes';
        }
        $('.message-text').text(msg);
        $('.message').addClass('error').addClass('show');
        $('.js-prompt-btn').removeClass('help').addClass('dismiss').text('Dismiss');
        clearInterval(intervalId);
    }

    // Initiate Prompt Btn - add to DOM
    function initPromtBtn() {
        var html = "<button class=\"help prompt-btn js-prompt-btn\">Help</button>";

        $(html).prependTo('body');

        $('.js-prompt-btn').on('click', function(e) {
            if ( $(this).hasClass('help') ) {
                var helpText = '<img src="library/img/logo-icon.png" alt="Tymer logo" class="logo-icon"><h2 class="alpha">Simple Free Online Timer</h2><p>Tymer is a mobile optimised countdown timer.<br /> Whether you are cooking, exercising or practising the pomodoro technique, Tymer is for you.</p><ul><li>Supports a countdown up to one hour - [MM:SS]</li><li>Click anywhere to start countdown</li><li>Alarm sounds when Tymer has completed (PC/MAC only)</li></ul><p>More info about <a href="why.html">Tymer</a>. Built by <a href="http://neilmagee.com">Neil Magee</a>.</p>';
                $('.message-text').html(helpText);
                $('.message').addClass('help-panel').addClass('show');
                $(this).removeClass('help').addClass('dismiss').text('Dismiss');
            } else if ( $(this).hasClass('dismiss') ) {
                $('.message').attr('class', 'message');
                $('.message').find('.message-text').empty();
                removeAlertSound();
                $(this).removeClass('dismiss').addClass('help').text('Help');
            }

            e.preventDefault();
        });

        $('html').on('keyup', function(kp) {
            if( kp.keyCode === 27 ) {
                $('.message').attr('class', 'message');
                $('.message').find('.message-text').empty();
                removeAlertSound();
                $('.js-prompt-btn').removeClass('dismiss').addClass('help').text('Help');
            }
        });
    }

    function initMsg() {
        var html = "<div class=\"message\"><span class=\"message-text\"></span></div>";

        $(html).prependTo('body');
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

    // Initiate Msg window system
    initMsg();
    initPromtBtn();

    // Initiate correct window size - initial load and subsequent window changes
    fit();

    $(window).on('resize', function(){
        fit();
    });
}

$(document).ready(function() {
    init();
});