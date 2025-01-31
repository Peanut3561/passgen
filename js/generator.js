document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const categoryButtons = document.querySelectorAll('.category-btn');
    const passwordOutput = document.getElementById('passwordOutput');
    const copyButton = document.getElementById('copyButton');
    const generateButton = document.getElementById('generateButton');
    const lengthSlider = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    const uppercaseCheck = document.getElementById('uppercase');
    const numbersCheck = document.getElementById('numbers');
    const symbolsCheck = document.getElementById('symbols');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    // Track current category
    let currentCategory = 'random';

    // Word lists for different types of passwords
    const wordLists = {
        adjectives: ['happy', 'clever', 'brave', 'bright', 'calm', 'kind', 'swift', 'wise'],
        nouns: ['tiger', 'mountain', 'river', 'sunset', 'eagle', 'forest', 'ocean', 'star'],
        verbs: ['jump', 'dance', 'sing', 'run', 'fly', 'swim', 'dream', 'smile']
    };

    // Update length value display
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });

    // Handle category button clicks
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Update current category
            currentCategory = button.dataset.type;
            // Generate new password
            generatePassword();
        });
    });

    // Generate password based on category
    function generatePassword() {
        let password = '';
        
        switch(currentCategory) {
            case 'memorable':
                password = generateMemorablePassword();
                break;
            case 'pronounceable':
                password = generatePronounceablePassword();
                break;
            case 'pins':
                password = generatePIN();
                break;
            case 'phrases':
                password = generatePassphrase();
                break;
            default:
                password = generateRandomPassword();
        }

        passwordOutput.value = password;
        updateStrengthMeter(password);
        updateAnalytics(password);
        
        // Save to history
        saveToHistory(password);
    }

    // Generate memorable password (adjective + noun + number)
    function generateMemorablePassword() {
        const adjective = wordLists.adjectives[Math.floor(Math.random() * wordLists.adjectives.length)];
        const noun = wordLists.nouns[Math.floor(Math.random() * wordLists.nouns.length)];
        const number = Math.floor(Math.random() * 999) + 1;
        const special = '!@#$%^&*'[Math.floor(Math.random() * 8)];
        
        return capitalizeFirst(adjective) + capitalizeFirst(noun) + number + special;
    }

    // Generate pronounceable password
    function generatePronounceablePassword() {
        const consonants = 'bcdfghjklmnpqrstvwxyz';
        const vowels = 'aeiou';
        let password = '';
        const length = Math.min(parseInt(lengthSlider.value), 12);

        for (let i = 0; i < length; i += 2) {
            password += consonants[Math.floor(Math.random() * consonants.length)];
            if (i + 1 < length) {
                password += vowels[Math.floor(Math.random() * vowels.length)];
            }
        }

        // Add number and special character for security
        password += Math.floor(Math.random() * 99);
        password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
        return capitalizeFirst(password);
    }

    // Generate PIN
    function generatePIN() {
        const length = Math.min(parseInt(lengthSlider.value), 12);
        let pin = '';
        for (let i = 0; i < length; i++) {
            pin += Math.floor(Math.random() * 10);
        }
        return pin;
    }

    // Generate passphrase
    function generatePassphrase() {
        const words = [
            ...wordLists.adjectives,
            ...wordLists.nouns,
            ...wordLists.verbs
        ];
        let phrase = [];
        
        // Generate 4 random words
        for (let i = 0; i < 4; i++) {
            phrase.push(words[Math.floor(Math.random() * words.length)]);
        }

        // Add number and special character
        return phrase.map(capitalizeFirst).join('-') + 
               Math.floor(Math.random() * 99) + 
               '!@#$%^&*'[Math.floor(Math.random() * 8)];
    }

    // Generate random password (original functionality)
    function generateRandomPassword() {
        const length = parseInt(lengthSlider.value);
        const useUppercase = uppercaseCheck.checked;
        const useNumbers = numbersCheck.checked;
        const useSymbols = symbolsCheck.checked;

        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let chars = lowercase;
        if (useUppercase) chars += uppercase;
        if (useNumbers) chars += numbers;
        if (useSymbols) chars += symbols;

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return password;
    }

    // Helper function to capitalize first letter
    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Calculate password strength
    function calculateStrength(password) {
        let strength = 0;
        
        if (password.length >= 12) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;

        return strength;
    }

    // Update strength indicator
    function updateStrengthIndicator(strength) {
        strengthBar.style.width = `${strength}%`;
        
        if (strength <= 25) {
            strengthBar.style.backgroundColor = '#ff4444';
            strengthText.textContent = 'Weak';
        } else if (strength <= 50) {
            strengthBar.style.backgroundColor = '#ffbb33';
            strengthText.textContent = 'Moderate';
        } else if (strength <= 75) {
            strengthBar.style.backgroundColor = '#00C851';
            strengthText.textContent = 'Strong';
        } else {
            strengthBar.style.backgroundColor = '#007E33';
            strengthText.textContent = 'Very Strong';
        }
    }

    // Update strength meter
    function updateStrengthMeter(password) {
        const strength = calculateStrength(password);
        updateStrengthIndicator(strength);
    }

    // Generate button click handler
    generateButton.addEventListener('click', generatePassword);

    // Copy button click handler
    copyButton.addEventListener('click', () => {
        passwordOutput.select();
        document.execCommand('copy');
        
        // Show feedback
        copyButton.textContent = '✓';
        setTimeout(() => {
            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
    });

    // Save password to history
    function saveToHistory(password) {
        let history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
        history.unshift({
            password: password,
            date: new Date().toISOString(),
            strength: calculateStrength(password)
        });
        
        // Keep only last 10 passwords
        history = history.slice(0, 10);
        localStorage.setItem('passwordHistory', JSON.stringify(history));
    }

    // Generate initial password
    generatePassword();

    // Add to generator.js
    function visualizePasswordStrength(password) {
        const criteria = {
            length: password.length >= 12,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /[0-9]/.test(password),
            symbols: /[^A-Za-z0-9]/.test(password)
        };

        // Create visual checklist
        const strengthChecklist = document.createElement('div');
        strengthChecklist.className = 'strength-checklist';
        
        Object.entries(criteria).forEach(([key, met]) => {
            const item = document.createElement('div');
            item.className = `checklist-item ${met ? 'met' : 'unmet'}`;
            item.innerHTML = `
                <i class="fas fa-${met ? 'check' : 'times'}"></i>
                <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
            `;
            strengthChecklist.appendChild(item);
        });
    }

    // Add to generator.html
    const passwordCategories = document.createElement('div');
    passwordCategories.className = 'password-categories';
    passwordCategories.innerHTML = `
        <button class="category-btn" data-type="memorable">Memorable</button>
        <button class="category-btn" data-type="pronounceable">Pronounceable</button>
        <button class="category-btn" data-type="pins">PIN</button>
        <button class="category-btn" data-type="phrases">Passphrase</button>
    `;
    document.querySelector('.generator-container').appendChild(passwordCategories);

    // Add to generator.js
    function trackPasswordStats() {
        let stats = JSON.parse(localStorage.getItem('passwordStats') || '{}');
        stats.totalGenerated = (stats.totalGenerated || 0) + 1;
        stats.averageLength = calculateAverageLength(stats);
        localStorage.setItem('passwordStats', JSON.stringify(stats));
    }

    // Add to generator.js
    function generateQRCode(password) {
        const qrContainer = document.getElementById('qrCode');
        new QRCode(qrContainer, {
            text: password,
            width: 128,
            height: 128
        });
    }

    // Add to generator.js
    function generateRecoveryPhrase(password) {
        const words = ['apple', 'banana', 'cherry', /* more words */];
        const phrase = [];
        for(let i = 0; i < 4; i++) {
            phrase.push(words[Math.floor(Math.random() * words.length)]);
        }
        return phrase.join('-');
    }

    // Add this after your existing code in generator.js
    function updateAnalytics(password) {
        // Get existing stats or initialize new ones
        let stats = JSON.parse(localStorage.getItem('passwordStats') || '{}');
        
        // Update total passwords generated
        stats.totalGenerated = (stats.totalGenerated || 0) + 1;
        
        // Update average length
        let totalLength = (stats.averageLength || 0) * ((stats.totalGenerated - 1) || 1);
        totalLength += password.length;
        stats.averageLength = Math.round((totalLength / stats.totalGenerated) * 10) / 10;
        
        // Save updated stats
        localStorage.setItem('passwordStats', JSON.stringify(stats));
        
        // Update display
        displayAnalytics();
    }

    function displayAnalytics() {
        const stats = JSON.parse(localStorage.getItem('passwordStats') || '{}');
        
        // Update the display elements
        document.getElementById('totalGenerated').textContent = stats.totalGenerated || 0;
        document.getElementById('averageLength').textContent = stats.averageLength || 0;
    }

    // Initialize analytics display when page loads
    displayAnalytics();
});
