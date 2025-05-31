class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25 minutes in seconds
        this.breakTime = 5 * 60; // 5 minutes in seconds
        this.timeLeft = this.workTime;
        this.isRunning = false;
        this.isWorkMode = true;
        this.timerId = null;

        // DOM elements
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.startButton = document.getElementById('start-btn');
        this.pauseButton = document.getElementById('pause-btn');
        this.resetButton = document.getElementById('reset-btn');
        this.workModeButton = document.getElementById('work-mode');
        this.breakModeButton = document.getElementById('break-mode');

        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.resetButton.addEventListener('click', () => this.reset());
        this.workModeButton.addEventListener('click', () => this.setMode(true));
        this.breakModeButton.addEventListener('click', () => this.setMode(false));
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => this.tick(), 1000);
            this.startButton.disabled = true;
            this.pauseButton.disabled = false;
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timerId);
            this.startButton.disabled = false;
            this.pauseButton.disabled = true;
        }
    }

    reset() {
        this.pause();
        this.timeLeft = this.isWorkMode ? this.workTime : this.breakTime;
        this.updateDisplay();
    }

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            this.handleTimerComplete();
        }
    }

    handleTimerComplete() {
        this.pause();
        // Play notification sound
        const audio = new Audio(chrome.runtime.getURL('assets/notification.mp3'));
        audio.play();
        
        // Show completion message
        const quoteElement = document.getElementById('quote-text');
        quoteElement.textContent = getRandomQuote();
        
        // Switch modes automatically
        this.setMode(!this.isWorkMode);
    }

    setMode(isWork) {
        this.isWorkMode = isWork;
        this.workModeButton.classList.toggle('active', isWork);
        this.breakModeButton.classList.toggle('active', !isWork);
        this.timeLeft = isWork ? this.workTime : this.breakTime;
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.minutesElement.textContent = minutes.toString().padStart(2, '0');
        this.secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
}

// Initialize timer when the popup opens
document.addEventListener('DOMContentLoaded', () => {
    const timer = new PomodoroTimer();
}); 