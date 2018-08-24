const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

// Non React functions
function pad(s, size) {
  let o = s.toString();
  while (o.length < (size || 2)) {
    o = `0${o}`;
  }
  return o;
}

// React

const RenderTime = React.createClass({
  countdown: null,
  countdownTime: 0,
  componentWillReceiveProps(nextProps) {
    if (nextProps.timerState === "stopped") {
      this.countdownStop();
    }
  },
  countdownStart(m, s) {
    const targetTime = m * 60 + s * 1;

    this.updateState("started");
    this.countdownTime = targetTime * 1000;
    this.countdown = setInterval(this.countdownCalculate, 1000);
  },
  countdownStop() {
    clearInterval(this.countdown);
  },
  countdownComplete() {
    this.countdownStop();
    this.updateState("stopped");
  },
  countdownPause() {
    this.countdownStop();
    this.updateState("paused");
  },
  countdownRestart() {
    this.countdown = setInterval(this.countdownCalculate, 1000);
    this.updateState("started");
  },
  countdownCalculate() {
    if (this.countdownTime === 0) {
      this.countdownComplete();
      return;
    }

    this.countdownTime = this.countdownTime - 1000;

    const remainingSecs = this.calculateRemainingSeconds(this.countdownTime);
    let remainingMins = Math.floor(this.countdownTime / 60000);
    const remainingHours = Math.floor(this.countdownTime / 3600000);

    // Deal with 60 mins equalling 1 hour & 1 hour equalling 00 mins in time format 01:00:00
    if (remainingHours >= 1) {
      remainingMins = 60;
    }

    this.updateTime(pad(remainingMins), pad(remainingSecs));
  },
  calculateRemainingSeconds(ms) {
    const secs = ms / 1000;
    const mins = secs / 60;

    return Math.round((mins % 1) * 60);
  },
  handleClick() {
    if (this.props.timerState !== "started") {
      this.countdownStart(
        parseInt(this.props.minutes, 10),
        parseInt(this.props.seconds, 10)
      );
    } else if (this.props.timerState === "paused") {
      this.countdownRestart();
    } else {
      this.countdownPause();
    }
  },
  updateTime(m, s) {
    this.props.updateTime(m, s);
  },
  updateState(state) {
    this.props.updateState(state);
  },
  generateClassName() {
    if (this.props.timerState === "started") {
      return "timeContainer timeContainer--started";
    } else if (this.props.timerState === "paused") {
      return "timeContainer timeContainer--paused";
    }

    return "timeContainer";
  },
  render() {
    const minsPos0 = `digit digit--mins digit--${
      this.props.minutes.split("")[0]
    }`;
    const minsPos1 = `digit digit--mins digit--${
      this.props.minutes.split("")[1]
    }`;
    const secsPos0 = `digit digit--secs digit--${
      this.props.seconds.split("")[0]
    }`;
    const secsPos1 = `digit digit--secs digit--${
      this.props.seconds.split("")[1]
    }`;

    return React.createElement(
      "div",
      {
        className: this.generateClassName(),
        onClick: this.handleClick
      },
      React.createElement(
        "div",
        { className: "digitsContainer" },
        React.createElement("div", {
          className: minsPos0
        }),
        React.createElement("div", {
          className: minsPos1
        })
      ),
      React.createElement("div", {
        className: "digitSeperator"
      }),
      React.createElement(
        "div",
        { className: "digitsContainer" },
        React.createElement("div", {
          className: secsPos0
        }),
        React.createElement("div", {
          className: secsPos1
        })
      ),
    );
  }
});

const SetSecondsUI = React.createClass({
  getInitialState() {
    return {
      seconds: this.props.seconds
    };
  },
  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({ seconds: nextProps.seconds });
    }
  },
  increaseSeconds() {
    const currentSecs = parseInt(this.state.seconds, 10);
    let newSecs = 0;

    if (currentSecs >= 59) {
      newSecs = "00";
    } else {
      newSecs = pad(currentSecs + 1);
      String(newSecs);
    }

    this.props.onChange(newSecs);
  },
  decreaseSeconds() {
    const currentSecs = parseInt(this.state.seconds, 10);
    let newSecs = 0;

    if (currentSecs === 0) {
      newSecs = "59";
    } else {
      newSecs = pad(currentSecs - 1);
      String(newSecs);
    }

    this.props.onChange(newSecs);
  },
  handleChange(value) {
    clearTimeout(this.timer);

    this.setState({ seconds: value.target.value });

    this.timer = setTimeout(
      this.triggerChange,
      WAIT_INTERVAL,
      value.target.value
    );
  },
  handleKeyDown(e) {
    if (e.keyCode === ENTER_KEY) {
      this.triggerChange(e);
    }
  },
  triggerChange(v) {
    const parsedVal = parseInt(v, 10);
    let newVal = "";

    if (parsedVal > 60) {
      newVal = "59";
    } else if (parsedVal <= 0) {
      newVal = "00";
    } else if (Number.isInteger(parsedVal)) {
      newVal = v;
    } else {
      newVal = "00";
    }

    this.props.onChange(newVal);
  },
  render() {
    return React.createElement(
      "div",
      { className: "setSeconds" },
      React.createElement("button", {
        className: "setSeconds__btn setSeconds__btn--minus",
        children: "-",
        onClick: this.decreaseSeconds
      }),
      React.createElement("input", {
        className: "setSeconds__input",
        value: this.state.seconds,
        onChange: this.handleChange,
        onKeyDown: this.handleKeyDown
      }),
      React.createElement("button", {
        className: "setSeconds__btn setSeconds__btn--plus",
        children: "+",
        onClick: this.increaseSeconds
      })
    );
  }
});

const SetMinutesUI = React.createClass({
  getInitialState() {
    return {
      minutes: this.props.minutes
    };
  },
  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({ minutes: nextProps.minutes });
    }
  },
  increaseMinutes() {
    const currentMins = parseInt(this.state.minutes, 10);
    let newMins = 0;

    if (currentMins >= 59) {
      newMins = "00";
    } else {
      newMins = pad(currentMins + 1);
      String(newMins);
    }

    this.props.onChange(newMins);
  },
  decreaseMinutes() {
    const currentMins = parseInt(this.state.minutes, 10);
    let newMins = 0;

    if (currentMins === 0) {
      newMins = "59";
    } else {
      newMins = pad(currentMins - 1);
      String(newMins);
    }

    this.props.onChange(newMins);
  },
  handleChange(value) {
    clearTimeout(this.timer);

    this.setState({ minutes: value.target.value });

    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
  },
  handleKeyDown(e) {
    if (e.keyCode === ENTER_KEY) {
      this.triggerChange(e);
    }
  },
  triggerChange() {
    const parsedVal = parseInt(this.state.minutes, 10);
    let newVal = "";

    if (parsedVal > 60) {
      newVal = "59";
    } else if (parsedVal <= 0) {
      newVal = "00";
    } else if (Number.isInteger(parsedVal)) {
      newVal = this.state.minutes;
    } else {
      newVal = "00";
    }

    this.props.onChange(newVal);
  },
  render() {
    return React.createElement(
      "div",
      { className: "setMinutes" },
      React.createElement("button", {
        className: "setMinutes__btn setMinutes__btn--minus",
        children: "-",
        onClick: this.decreaseMinutes
      }),
      React.createElement("input", {
        className: "setMinutes__input",
        value: this.state.minutes,
        onChange: this.handleChange,
        onKeyDown: this.handleKeyDown
      }),
      React.createElement("button", {
        className: "setMinutes__btn setMinutes__btn--plus",
        children: "+",
        onClick: this.increaseMinutes
      })
    );
  }
});

const ResetTimer = React.createClass({
  propTypes: {
    timerState: React.PropTypes.string
  },
  handleClick() {
    this.props.resetTime();
  },
  render() {
    const className =
      this.props.timerState !== "stopped"
        ? "resetTimeContainer isActive"
        : "resetTimeContainer";
    return React.createElement(
      "div",
      { className },
      React.createElement("button", {
        className: "resetTime",
        children: "Reset",
        onClick: this.handleClick
      })
    );
  }
});

const TimerDone = React.createClass({
  handleClick() {
    this.props.closeDoneMsg();
  },
  render() {
    const className = this.props.timerDone ? "timerDone isActive" : "timerDone";
    return React.createElement(
      "div",
      { className },
      React.createElement("button", {
        className: "timerDone__btn",
        children: "Tymer Completed",
        onClick: this.handleClick
      })
    );
  }
});

// SetTimeUI is the "parent" component
const SetTimeUI = React.createClass({
  propTypes: {
    minutes: React.PropTypes.string,
    seconds: React.PropTypes.string
  },
  getInitialState() {
    return {
      uiReady: false,
      timerState: "stopped",
      timerDone: false,
      minutes: "01",
      seconds: "00",
      renderedMinutes: "01",
      renderedSeconds: "00"
    };
  },
  componentDidMount() {
    // Fake loading...
    const that = this;

    window.setTimeout(() => {
      that.setState({
        uiReady: true
      });
    }, 1000);
  },
  updateState(state) {
    if (state === "stopped") {
      this.setState({
        renderedMinutes: this.state.minutes,
        renderedSeconds: this.state.seconds,
        timerDone: true
      });
    }
    this.setState({
      timerState: state
    });
  },
  setMinutes(m) {
    this.setState({
      minutes: m,
      renderedMinutes: m
    });
  },
  setSeconds(s) {
    this.setState({
      seconds: s,
      renderedSeconds: s
    });
  },
  updateTime(m, s) {
    this.setState({
      renderedMinutes: m,
      renderedSeconds: s
    });
  },
  resetTime() {
    this.setState({
      timerState: "stopped",
      timerDone: false,
      minutes: "01",
      seconds: "00",
      renderedMinutes: "01",
      renderedSeconds: "00"
    });
  },
  closeDoneMsg() {
    this.resetTime();
  },
  render() {
    const isReadyClass = this.state.uiReady
      ? "appContainer isReady"
      : "appContainer";

    return React.createElement(
      "div",
      { className: isReadyClass },
      React.createElement(RenderTime, {
        timerState: this.state.timerState,
        updateState: this.updateState,
        minutes: this.state.renderedMinutes,
        seconds: this.state.renderedSeconds,
        updateTime: this.updateTime
      }),
      React.createElement(
        "div",
        { className: "setTimeContainer" },
        React.createElement(SetMinutesUI, {
          minutes: this.state.minutes,
          onChange: this.setMinutes
        }),
        React.createElement(SetSecondsUI, {
          seconds: this.state.seconds,
          onChange: this.setSeconds
        })
      ),
      React.createElement(ResetTimer, {
        timerState: this.state.timerState,
        resetTime: this.resetTime
      }),
      React.createElement(TimerDone, {
        timerDone: this.state.timerDone,
        closeDoneMsg: this.closeDoneMsg
      })
    );
  }
});

const rootElement = React.createElement(SetTimeUI);

ReactDOM.render(rootElement, document.getElementById("tymer-app"));
