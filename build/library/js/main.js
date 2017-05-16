const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

var RenderTime = React.createClass({
  render: function() {
    return (
      React.createElement('div', {className: 'timeContainer'},
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
      minutes: '01',
      seconds: '00'
    }
  },
  setMinutes: function(m) {
    this.setState({
      minutes: m
    });
  },
  setSeconds: function(s) {
    this.setState({
      seconds: s
    });
  },
  render: function() {
    return (
      React.createElement('div', {className: 'appContainer'},
        React.createElement(RenderTime, {
          minutes: this.state.minutes,
          seconds: this.state.seconds
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