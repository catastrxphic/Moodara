const quotes = [
    "You're stronger than you think! 💪",
    "Every small step counts towards your goals. 🌟",
    "You've got this! Believe in yourself. ✨",
    "Take a deep breath and keep going. 🌸",
    "Your potential is limitless! 🚀",
    "Today is a new opportunity to shine. 🌞",
    "You're making progress, even if it doesn't feel like it. 🌱",
    "Stay positive, stay strong! 💫",
    "Your hard work will pay off. 🌈",
    "You're capable of amazing things. 🌺",
    "Keep going, you're doing great! 🎯",
    "Every challenge makes you stronger. 💎",
    "Believe in your journey. 🌠",
    "You're not alone in this. 🤗",
    "Your future is bright! 🌅",
    "Take it one step at a time. 🦋",
    "You're making a difference. 🌍",
    "Stay focused on your goals. 🎯",
    "Your efforts are worth it. 💫",
    "Keep shining your light! ✨"
];

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

// Update quote when the popup opens
document.addEventListener('DOMContentLoaded', () => {
    const quoteElement = document.getElementById('quote-text');
    if (quoteElement) {
        quoteElement.textContent = getRandomQuote();
    }
}); 