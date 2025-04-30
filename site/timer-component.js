class TimerComponent extends HTMLElement {
  constructor() {
    super();
    this.duration = 30;
    this.intervalId = null; // Store the interval ID for cleanup if needed
  }

  static get observedAttributes() {
    return ['duration'];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (property) {
      case 'duration':
        this.duration = parseInt(newValue, 10);
        break;
      default:
        this[property] = newValue;
        break;
    }
    this.render();
  }

  connectedCallback() {
    this.render();

    // Run tick() every second
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  disconnectedCallback() {
    // Clear the interval when the component is removed from the DOM
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  tick() {
    if (this.duration > 0) {
      this.duration--;
      this.render();
    } else {
      clearInterval(this.intervalId); // Stop the timer when it reaches 0
    }
  }

  render() {
    this.textContent = `Timer: ${this.duration}s`;
  }
}

customElements.define('timer-component', TimerComponent);