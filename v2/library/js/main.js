$(document).ready(function() {
    var intervalId;

    $('.tymer').addClass('active');
    $('.tymer-set').addClass('active');

    // Monitor changes to minutes
    $('.js-minutes').on('change', function() {
        var setMinutes = leadingZero($(this).val());
        //console.log($(this).val());

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

                $('.tymer-set').removeClass('active');
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
                //$(this).text('Resume');
                $(this).countdown('pause').addClass('paused');
            } else {
                //$(this).text('Pause');
                $(this).countdown('resume').removeClass('paused');
            }

            $(this).data('state', state);
        }

        return false;
    });

    // Action to take when user presses 'pause'
    // $('.js-pause').on('click', function() {
    //     var state = $(this).data('state');

    //     state = !state;

    //     if (state) {
    //         $(this).text('Resume');
    //         $('.tymer').countdown('pause');
    //     } else {
    //         $(this).text('Pause');
    //         $('.tymer').countdown('resume');
    //     }

    //     $(this).data('state', state);
    // });

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
        dismiss();
        clearTymer();
    }

    // Reset the UI once a Tymer has completed
    function clearTymer() {
        $('.tymer').removeClass('hasCountdown').removeClass('paused').countdown('pause');
        $('.number.mins').text('00');
        $('.number.secs').text('00');
        $('.js-minutes').val('00');
        $('.js-seconds').val('00');
        $('.tymer-set').addClass('active');
        $('.tymer-clear').removeClass('active');
        $('.js-pause').text('Pause').data('state', false);
    }

    function triggerError(type) {
        var msg = 'There has been an error';

        if (type === 0) {
            msg = 'Please enter a time';
        }
        else if (type === 1) {
            msg = 'Maximum Tymer is 60 minutes';
        }
        $('.message-text').text(msg);
        $('.message').addClass('error').addClass('show');
        dismiss();
        clearInterval(intervalId);
    }

    // Dismiss full screen messages
    function dismiss() {
        var message = $('.message');

        //message.append('<span class="dismiss">Dismiss</span>');
        message.click(function(e) {
            $(this).removeClass('show');
            e.preventDefault();
        });
        $('html').on('keyup', function(kp) {
            if( kp.keyCode === 27 ) {
                message.removeClass('show');
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

        //console.log('Current Font Width = ' + currentFontWidth + 'px');
        //console.log('Current Font Height = ' + tymerHeight + 'px');
        //console.log(fontHeightFactor);

        function optimumFit() {
            var optimumFontHeight;

            if ( proposedFontWidth < currentFontWidth ) {
                optimumFontHeight = Math.floor( ( ( proposedFontHeight / 100 ) * 95 ) );
            } else {
                //console.log(currentFontWidth);
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
});