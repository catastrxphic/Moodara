/**                              Emotional Release class
 * Handles the emotional release animation and interaction
 * This class manages the canvas animation, GPT integration, and user interface
 */
class EmotionalRelease {
    constructor() {
        console.log('EmotionalRelease constructor called');
        
        // Dialogflow configuration
        this.DIALOGFLOW_PROJECT_ID = config.DIALOGFLOW_PROJECT_ID;
        this.DIALOGFLOW_API_KEY = config.DIALOGFLOW_API_KEY;
        this.sessionId = this.generateSessionId();
        
        console.log('Configuration loaded:', {
            projectId: this.DIALOGFLOW_PROJECT_ID,
            hasApiKey: !!this.DIALOGFLOW_API_KEY,
            sessionId: this.sessionId
        });
        
        // Get references to DOM elements
        this.canvas = document.getElementById('release-animation'); // Canvas element for animations
        this.ctx = this.canvas.getContext('2d'); // 2D rendering context for canvas
        this.animationContainer = document.getElementById('animation-container'); // Container for animation
        this.releaseMessage = document.getElementById('release-message'); // Message display element
        this.textarea = document.getElementById('negative-thoughts'); // Input textarea for thoughts
        this.releaseButton = document.getElementById('release-btn'); // Release button element
        
        // Settings elements
        this.settingsToggle = document.getElementById('settings-toggle');
        this.settingsPanel = document.getElementById('settings-panel');
        this.apiKeyInput = document.getElementById('api-key-input');
        this.saveApiKeyButton = document.getElementById('save-api-key');
        this.apiKeyStatus = document.getElementById('api-key-status');
        
        console.log('DOM elements initialized:', {
            canvas: !!this.canvas,
            ctx: !!this.ctx,
            animationContainer: !!this.animationContainer,
            releaseMessage: !!this.releaseMessage,
            textarea: !!this.textarea,
            releaseButton: !!this.releaseButton
        });
        
        this.initializeEventListeners(); // Set up event handlers
        this.setupCanvas(); // Configure canvas dimensions
        this.init(); // Initialize async operations
    }
    
    /**
     * Initialize async operations
     */
    async init() {
        console.log('Initializing with API key:', this.DIALOGFLOW_API_KEY ? 'Key exists' : 'No key found');
    }

    /**
     * Generate a unique session ID for Dialogflow
     * @returns {string} A unique session identifier
     */
    generateSessionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `${timestamp}-${random}`;
    }

    /**
     * Set up event listeners for user interactions
     */
    initializeEventListeners() {
        console.log('Setting up event listeners');
        if (this.releaseButton) {
            this.releaseButton.addEventListener('click', () => {
                console.log('Release button clicked through class method');
                this.handleRelease();
            });
        } else {
            console.error('Release button not found!');
        }
        
        // Settings toggle
        this.settingsToggle.addEventListener('click', () => {
            this.settingsPanel.classList.toggle('hidden');
        });
        
        // Save API key
        this.saveApiKeyButton.addEventListener('click', () => this.saveApiKey());
        
        // API key input focus
        this.apiKeyInput.addEventListener('focus', () => {
            if (this.apiKeyInput.value === '•'.repeat(20)) {
                this.apiKeyInput.value = '';
            }
        });
    }

    /**
     * Save the API key to Chrome storage
     */
    async saveApiKey() {
        const apiKey = this.apiKeyInput.value.trim();
        
        if (!apiKey) {
            this.showApiKeyStatus('Please enter an API key', 'error');
            return;
        }

        try {
            // Test the API key with a simple request to Dialogflow
            const response = await fetch(`https://dialogflow.googleapis.com/v2/projects/${this.DIALOGFLOW_PROJECT_ID}/agent`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error('Invalid API key');
            }

            // Save the API key
            await new Promise((resolve) => {
                chrome.storage.sync.set({ openaiApiKey: apiKey }, () => {
                    this.DIALOGFLOW_API_KEY = apiKey;
                    this.showApiKeyStatus('API key saved successfully!', 'success');
                    resolve();
                });
            });

            // Mask the API key in the input
            this.apiKeyInput.value = '•'.repeat(20);
        } catch (error) {
            console.error('Error saving API key:', error);
            this.showApiKeyStatus('Invalid API key. Please try again.', 'error');
        }
    }

    /**
     * Show API key status message
     * @param {string} message - Status message
     * @param {string} type - Status type (success/error)
     */
    showApiKeyStatus(message, type) {
        this.apiKeyStatus.textContent = message;
        this.apiKeyStatus.className = 'api-key-status ' + type;
        
        // Clear status after 3 seconds
        setTimeout(() => {
            this.apiKeyStatus.textContent = '';
            this.apiKeyStatus.className = 'api-key-status';
        }, 3000);
    }

    /**
     * Configure canvas dimensions to match container size
     */
    setupCanvas() {
        // Get the container dimensions
        const containerWidth = this.animationContainer.offsetWidth;
        const containerHeight = this.animationContainer.offsetHeight;
        
        // Set canvas size to match container
        this.canvas.width = containerWidth;
        this.canvas.height = containerHeight;
        
        console.log('Container size:', containerWidth, 'x', containerHeight);
        console.log('Canvas size set to:', this.canvas.width, 'x', this.canvas.height);
    }

    /**
     * Get response from Dialogflow API for emotional support
     * @param {string} text - User's negative thoughts
     * @returns {Object} Summary and advice from Dialogflow
     */
    async getDialogflowResponse(text) {
        if (!this.DIALOGFLOW_API_KEY) {
            console.error('No API key available');
            return {
                summary: "Negative thoughts",
                advice: "Stay strong and positive"
            };
        }

        try {
            console.log('Making API call with key:', this.DIALOGFLOW_API_KEY ? 'Key exists' : 'No key found');
            
            // Make API request to Dialogflow
            const response = await fetch(`https://dialogflow.googleapis.com/v2/projects/${this.DIALOGFLOW_PROJECT_ID}/agent/sessions/${this.sessionId}:detectIntent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.DIALOGFLOW_API_KEY}`
                },
                body: JSON.stringify({
                    queryInput: {
                        text: {
                            text: text,
                            languageCode: "en-US"
                        }
                    },
                    queryParams: {
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                    }
                })
            });

            const data = await response.json();
            console.log('Raw API Response:', data);

            // Error handling for API response
            if (!response.ok) {
                console.error('API Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: data
                });
                throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }

            // Extract the response from Dialogflow
            if (!data.queryResult || !data.queryResult.fulfillmentText) {
                console.error('Invalid Dialogflow response structure:', data);
                throw new Error('Invalid Dialogflow response structure');
            }

            // Parse the response text to extract summary and advice
            const responseText = data.queryResult.fulfillmentText;
            const parts = responseText.split('|');
            
            let summary = "Negative thoughts";
            let advice = "Stay strong and positive";

            if (parts.length >= 2) {
                summary = parts[0].trim();
                advice = parts[1].trim();
            } else {
                // If the response doesn't have the expected format, use the whole text as advice
                advice = responseText.trim();
            }

            return {
                summary: summary,
                advice: advice
            };
        } catch (error) {
            console.error('Error in getDialogflowResponse:', error);
            return {
                summary: "Negative thoughts",
                advice: "Stay strong and positive"
            };
        }
    }

    /**
     * Handle the release button click event
     */
    async handleRelease() {
        const text = this.textarea.value.trim();
        console.log('Release button clicked with text:', text);
        
        if (text) {
            this.textarea.value = ''; // Clear textarea
            this.animationContainer.classList.remove('hidden'); // Show animation container
            this.releaseMessage.classList.add('hidden'); // Hide release message
            this.canvas.width = this.animationContainer.offsetWidth; // Update canvas size
            this.canvas.height = this.animationContainer.offsetHeight;
            
            console.log('Making API call to Dialogflow...');
            // Get Dialogflow response for emotional support
            const dialogflowResponse = await this.getDialogflowResponse(text);
            console.log('Dialogflow Response:', {
                summary: dialogflowResponse.summary,
                advice: dialogflowResponse.advice
            });
            
            // Store advice for later display
            this.currentAdvice = dialogflowResponse.advice;
            
            // Ensure we have a summary
            if (!dialogflowResponse.summary) {
                console.error('No summary received from Dialogflow');
                dialogflowResponse.summary = "Negative thoughts";
            }
            
            console.log('Starting animation with summary:', dialogflowResponse.summary);
            // Start the animation
            this.animateRelease(dialogflowResponse.summary);
        } else {
            console.log('No text entered');
        }
    }

    /**
     * Animate the release of negative thoughts
     * @param {string} summary - Summary of negative thoughts
     */
    animateRelease(summary) {
        console.log('Animation started with summary:', summary);
        let burnProgress = 0;
        let animationFrame = 0;

        // Set timeout for showing release message
        const animationTimeout = setTimeout(() => {
            console.log('Animation complete, showing advice message');
            this.showReleaseMessage();
        }, 5000);

        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw paper with burning effect
            const paperWidth = Math.min(this.canvas.width - 60, 280);
            const paperHeight = Math.min(this.canvas.height - 60, 200);
            const startX = (this.canvas.width - paperWidth) / 2;
            const startY = (this.canvas.height - paperHeight) / 2;
            
            this.drawPaper(startX, startY, paperWidth, paperHeight, burnProgress);

            // Update burn progress
            if (animationFrame < 100) {
                burnProgress = animationFrame / 100;
            }

            animationFrame++;

            // Continue animation or show message
            if (burnProgress < 1) {
                requestAnimationFrame(animate);
            } else {
                console.log('Burn animation complete');
                clearTimeout(animationTimeout);
                this.showReleaseMessage();
            }
        };

        animate();
    }

    /**
     * Show the release message with Dialogflow's advice
     */
    showReleaseMessage() {
        console.log('Showing advice message:', this.currentAdvice);
        this.animationContainer.classList.add('hidden');
        this.releaseMessage.classList.remove('hidden');
        
        // Update message with Dialogflow's advice
        const messageElement = this.releaseMessage.querySelector('p');
        if (messageElement && this.currentAdvice) {
            messageElement.textContent = this.currentAdvice;
        }
        
        // Hide message after delay
        setTimeout(() => {
            console.log('Hiding advice message');
            this.releaseMessage.classList.add('hidden');
        }, 2500);
    }

    /**
     * Create a fire particle for the burning animation
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Object} Fire particle properties
     */
    createFireParticle(x, y) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        return {
            x,
            y,
            vx: Math.cos(angle) * speed * 0.5,
            vy: -Math.random() * 3 - 1,
            size: Math.random() * 3 + 2,
            color: `hsl(${Math.random() * 30 + 15}, 100%, ${Math.random() * 30 + 50}%)`,
            opacity: 1,
            flicker: Math.random() * 0.2 + 0.8
        };
    }

    /**
     * Create an ash particle for the burning animation
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Object} Ash particle properties
     */
    createAshParticle(x, y) {
        return {
            x,
            y,
            vx: (Math.random() - 0.5) * 1,
            vy: Math.random() * 2,
            size: Math.random() * 2 + 1,
            color: `rgba(50, 50, 50, ${Math.random() * 0.5 + 0.5})`,
            opacity: 1
        };
    }

    /**
     * Draw the paper with burning effect
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} width - Paper width
     * @param {number} height - Paper height
     * @param {number} burnProgress - Burning animation progress (0-1)
     */
    drawPaper(x, y, width, height, burnProgress) {
        // Create paper gradient
        const paperGradient = this.ctx.createLinearGradient(x, y, x, y + height);
        paperGradient.addColorStop(0, `rgba(245, 222, 179, ${1 - burnProgress * 0.7})`);
        paperGradient.addColorStop(0.5, `rgba(245, 222, 179, ${1 - burnProgress * 0.7})`);
        paperGradient.addColorStop(1, `rgba(245, 222, 179, ${1 - burnProgress * 0.7})`);

        // Draw paper with gradient
        this.ctx.fillStyle = paperGradient;
        this.ctx.fill();

        // Draw burn spots
        this.ctx.beginPath();
        this.ctx.arc(x + width/2, y + height/2, 10, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(139, 69, 19, ${burnProgress * 0.8})`;
        this.ctx.fill();
    }
}

// Initialize emotional release when the popup opens
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing EmotionalRelease');
    try {
        window.emotionalRelease = new EmotionalRelease();
        console.log('EmotionalRelease initialized successfully');
        
        // Verify DOM elements
        const elements = {
            textarea: document.getElementById('negative-thoughts'),
            releaseButton: document.getElementById('release-btn'),
            animationContainer: document.getElementById('animation-container'),
            releaseMessage: document.getElementById('release-message'),
            canvas: document.getElementById('release-animation')
        };
        
        console.log('DOM Elements check:', {
            textarea: !!elements.textarea,
            releaseButton: !!elements.releaseButton,
            animationContainer: !!elements.animationContainer,
            releaseMessage: !!elements.releaseMessage,
            canvas: !!elements.canvas
        });
        
        // Add direct click handler for testing
        elements.releaseButton.addEventListener('click', () => {
            console.log('Release button clicked directly');
        });
        
    } catch (error) {
        console.error('Error initializing EmotionalRelease:', error);
    }
});    