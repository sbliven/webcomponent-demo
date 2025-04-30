class TimerComponent extends HTMLElement {
  constructor(duration) {
    super();
    this.duration = duration || 0;
    this.time = this.duration;
    this.intervalId = null; // returned by setInterval

    const shadowRoot = this.attachShadow({ mode: 'open' }); // Attach shadow DOM

    // Create a style element
    const style = document.createElement('style');
    style.textContent = `
:host {
  display: inline-block;
  font-family: Times, serif;
  font-size: 1.8rem;
  color: #333;
}
.timer {
  font-weight: bold;
  display: inline-block;
  color: rgb(150, 37, 0);
}
.timer.running {
  color:rgb(0, 82, 163);
}
`;
    shadowRoot.appendChild(style); // Append the style to the shadow DOM

    const label = document.createElement('label');
    label.textContent = 'Timer: ';
    shadowRoot.appendChild(label);
    // Create a div element for the timer
    this.timerDiv = document.createElement('div');
    this.timerDiv.classList.add('timer');
    this.timerDiv.textContent = `Not set`;
    shadowRoot.appendChild(this.timerDiv); // Append the timer div to the shadow DOM

    // Buttons
    const buttonDiv = document.createElement('div');
    const startButton = document.createElement('button');
    startButton.textContent = 'Start';
    startButton.addEventListener('click', () => {
      this.start();
    });
    buttonDiv.appendChild(startButton);
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop';
    stopButton.addEventListener('click', () => {
      this.stop();
    });
    buttonDiv.appendChild(stopButton);
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => {
      this.reset();
    });
    buttonDiv.appendChild(resetButton);

    shadowRoot.appendChild(buttonDiv); // Append the reset button to the shadow DOM
  }

  static get observedAttributes() {
    return ['duration','time'];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (property) {
      case 'duration':
        this.time = parseInt(newValue, 10);
      case 'time':
        this[property] = parseInt(newValue, 10);
        break;
      default:
        this[property] = newValue;
        break;
    }
    this.render();
  }

  connectedCallback() {
    this.start();
  }

  disconnectedCallback() {
    // Clear the interval when the component is removed from the DOM
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  start() {
    if (this.intervalId ) {
      clearInterval(this.intervalId);
    }
    this.timerDiv.classList.add('running');
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
    this.render();
  }

  stop() {
    this.timerDiv.classList.remove('running');
    clearInterval(this.intervalId); // Stop the timer when it reaches 0
    this.render();
  }

  reset() {
    this.time = this.duration;
    this.render();
  }

  tick() {
    this.time--;
    if (this.time <= 0) {
      this.stop();
    }
    this.render();
  }

  render() {
    this.timerDiv.textContent = `${this.time}s`;
  }
}

customElements.define('timer-component', TimerComponent);