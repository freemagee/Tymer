const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

var RenderTime = React.createClass({
  countdown: null,
  countdownTime: 0,
  countdownStart: function(m, s) {
    var targetTime = (m * 60) + (s * 1);

    this.updateState('started');
    this.countdownTime = (targetTime * 1000);
    this.countdown = setInterval(this.countdownCalculate, 1000);
  },
  countdownComplete: function() {
    clearInterval(this.countdown);
    this.updateState('stopped');
  },
  countdownPause: function() {
    clearInterval(this.countdown);
    this.updateState('paused');
  },
  countdownRestart: function() {
    this.countdown = setInterval(this.countdownCalculate, 1000);
    this.updateState('started');
  },
  countdownCalculate: function() {
    if (this.countdownTime === 0) {
      this.countdownComplete();
      return;
    } else {
      this.countdownTime = this.countdownTime - 1000;

      var remainingSecs = this.calculateRemainingSeconds(this.countdownTime);
      var remainingMins = Math.floor(this.countdownTime / 60000);
      var remainingHours = Math.floor(this.countdownTime / 3600000);

      // Deal with 60 mins equalling 1 hour & 1 hour equalling 00 mins in time format 01:00:00
      if (remainingHours >= 1) {
        remainingMins = 60;
      }

      this.updateTime(remainingMins.pad(), remainingSecs.pad());
    }
  },
  calculateRemainingSeconds(ms) {
    var secs = ms / 1000;
    var mins = secs / 60;

    return Math.round((mins % 1) * 60);
  },
  handleClick: function() {
    if (this.props.timerState !== 'started') {
      this.countdownStart(parseInt(this.props.minutes), parseInt(this.props.seconds));
    } else if (this.props.timerState === 'paused') {
      this.countdownRestart();
    } else {
      this.countdownPause();
    }
  },
  updateTime: function(m, s) {
    this.props.updateTime(m, s);
  },
  updateState: function(state) {
    this.props.updateState(state);
  },
  render: function() {
    return (
      React.createElement('div', {className: 'timeContainer', onClick: this.handleClick},
        React.createElement('div', {className: 'number number--mins', children: this.props.minutes}),
        React.createElement('div', {className: 'number__seperator', children: ':'}),
        React.createElement('div', {className: 'number number--secs', children: this.props.seconds})
      )
    )
  }
});

var SetSecondsUI = React.createClass({
  getInitialState: function() {
    return {
      seconds: this.props.seconds
    };
  },
  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({seconds: nextProps.seconds});
    }
  },
  increaseSeconds: function() {
    var currentSecs = parseInt(this.state.seconds);
    var newSecs = 0;

    if (currentSecs >= 59) {
      newSecs = '00';
    } else {
      newSecs = (currentSecs + 1).pad();
      String(newSecs);
    }

    this.props.onChange(newSecs);
  },
  decreaseSeconds: function() {
    var currentSecs = parseInt(this.state.seconds);
    var newSecs = 0;

    if (currentSecs == 0) {
      newSecs = '59';
    } else {
      newSecs = (currentSecs - 1).pad();
      String(newSecs);
    }

    this.props.onChange(newSecs);
  },
  handleChange: function(value) {
    clearTimeout(this.timer);

    this.setState({ seconds: value.target.value });

    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL, value.target.value);
  },
  handleKeyDown: function(e) {
    if (e.keyCode === ENTER_KEY) {
        this.triggerChange(e);
    }
  },
  triggerChange: function(v) {
    var parsedVal = parseInt(v);
    var newVal = '';

    if (parsedVal > 60) {
      newVal = '59';
    } else if (parsedVal <= 0) {
      newVal = '00';
    } else {
      if (Number.isInteger(parsedVal)) {
        newVal = v;
      } else {
        newVal = '00';
      }
    }

    this.props.onChange(newVal);
  },
  render: function() {
    return (
      React.createElement('div', {className: 'setSeconds'},
        React.createElement('button', {
          className: 'setSeconds__btn setSeconds__btn--minus',
          children: '-',
          onClick: this.decreaseSeconds
        }),
        React.createElement('input', {
          className: 'setSeconds__input',
          value: this.state.seconds,
          onChange: this.handleChange,
          onKeyDown: this.handleKeyDown
        }),
        React.createElement('button', {
          className: 'setSeconds__btn setSeconds__btn--plus',
          children: '+',
          onClick: this.increaseSeconds
        })
      )
    )
  }
});

var SetMinutesUI = React.createClass({
  getInitialState: function() {
    return {
      minutes: this.props.minutes
    };
  },
  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({minutes: nextProps.minutes});
    }
  },
  increaseMinutes: function() {
    var currentMins = parseInt(this.state.minutes);
    var newMins = 0;

    if (currentMins >= 59) {
      newMins = '00';
    } else {
      newMins = (currentMins + 1).pad();
      String(newMins);
    }

    this.props.onChange(newMins);
  },
  decreaseMinutes: function() {
    var currentMins = parseInt(this.state.minutes);
    var newMins = 0;

    if (currentMins == 0) {
      newMins = '59';
    } else {
      newMins = (currentMins - 1).pad();
      String(newMins);
    }

    this.props.onChange(newMins);
  },
  handleChange: function(value) {
    clearTimeout(this.timer);

    this.setState({ minutes: value.target.value });

    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
  },
  handleKeyDown: function(e) {
    if (e.keyCode === ENTER_KEY) {
        this.triggerChange(e);
    }
  },
  triggerChange: function() {
    var parsedVal = parseInt(this.state.minutes);
    var newVal = '';

    if (parsedVal > 60) {
      newVal = '59';
    } else if (parsedVal <= 0) {
      newVal = '00';
    } else {
      if (Number.isInteger(parsedVal)) {
        newVal = this.state.minutes;
      } else {
        newVal = '00';
      }
    }

    this.props.onChange(newVal);
  },
  render: function() {
    return (
      React.createElement('div', {className: 'setMinutes'},
        React.createElement('button', {
          className: 'setMinutes__btn setMinutes__btn--minus',
          children: '-',
          onClick: this.decreaseMinutes
        }),
        React.createElement('input', {
          className: 'setMinutes__input',
          value: this.state.minutes,
          onChange: this.handleChange,
          onKeyDown: this.handleKeyDown
        }),
        React.createElement('button', {
          className: 'setMinutes__btn setMinutes__btn--plus',
          children: '+',
          onClick: this.increaseMinutes
        })
      )
    )
  }
});

var SetTimeUI = React.createClass({
  propTypes: {
    minutes: React.PropTypes.string,
    seconds: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      timerState: 'stopped',
      minutes: '01',
      seconds: '00',
      renderedMinutes: '01',
      renderedSeconds: '00'
    }
  },
  updateState: function(state) {
    if (state === 'stopped') {
      this.setState({
        renderedMinutes: this.state.minutes,
        renderedSeconds: this.state.seconds
      });
    }
    this.setState({
      timerState: state
    });
  },
  setMinutes: function(m) {
    this.setState({
      minutes: m,
      renderedMinutes: m
    });
  },
  setSeconds: function(s) {
    this.setState({
      seconds: s,
      renderedSeconds: s
    });
  },
  updateTime: function(m, s) {
    this.setState({
      renderedMinutes: m,
      renderedSeconds: s
    });
  },
  render: function() {
    if (this.state.timerState === 'started') {
      appClassName = 'appContainer appContainer--started';
    } else if (this.state.timerState === 'paused') {
      appClassName = 'appContainer appContainer--paused';
    } else {
      appClassName = 'appContainer';
    }

    return (
      React.createElement('div', {className: appClassName},
        React.createElement(RenderTime, {
          timerState: this.state.timerState,
          updateState: this.updateState,
          minutes: this.state.renderedMinutes,
          seconds: this.state.renderedSeconds,
          updateTime: this.updateTime
        }),
        React.createElement('div', {className: 'setTimeContainer'},
          React.createElement(SetMinutesUI, {
            minutes: this.state.minutes,
            onChange: this.setMinutes
          }),
          React.createElement(SetSecondsUI, {
            seconds: this.state.seconds,
            onChange: this.setSeconds
          })
        )
      )
    )
  }
});

var rootElement = React.createElement(SetTimeUI);

ReactDOM.render(rootElement, document.getElementById('tymer-app'));