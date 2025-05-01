class TimerComponent extends HTMLElement {
  constructor(duration) {
    super();
    this.duration = duration || 0;
    this.time = this.duration;
    this.intervalId = null; // returned by setInterval

    const shadowRoot = this.attachShadow({
      mode: 'open'
    }); // Attach shadow DOM

    // Define the template
    const style = document.createElement('style');
    style.innerHTML = `
      :host {
        display: block;
        color: #333;
      }
      .timer {
        font-weight: bold;
        display: inline-block;
        color: rgb(150, 37, 0);
      }
      .timer.running {
        color: rgb(0, 82, 163);
      }
      button {
        margin: 0 5px;
        padding: 5px 10px;
        font-size: 1rem;
      }
    `;

    // Clone the template and append it to the shadow DOM
    shadowRoot.appendChild(style);
    const template = this.querySelector("template");
    if (template) {
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
    this.timerDiv = shadowRoot.querySelector('.timer');
    if (!this.timerDiv) {
      console.log('No timer div found, creating one');
      this.timerDiv = document.createElement('div');
      this.timerDiv.classList.add('timer');
      this.timerDiv.textContent = `Not set`;
      shadowRoot.appendChild(this.timerDiv);
    }
    // Get references to elements in the shadow DOM
    shadowRoot.querySelectorAll('#start').forEach((b) => b.addEventListener('click', () => this.start()));
    shadowRoot.querySelectorAll('#stop').forEach((b) => b.addEventListener('click', () => this.stop()));
    shadowRoot.querySelectorAll('#reset').forEach((b) => b.addEventListener('click', () => this.reset()));
  }

  static get observedAttributes() {
    return ['duration', 'time'];
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
    if (this.intervalId) {
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