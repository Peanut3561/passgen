document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const settingsForm = document.getElementById('settingsForm');
    const defaultLength = document.getElementById('defaultLength');
    const defaultUppercase = document.getElementById('defaultUppercase');
    const defaultNumbers = document.getElementById('defaultNumbers');
    const defaultSymbols = document.getElementById('defaultSymbols');
    const saveHistory = document.getElementById('saveHistory');
    const autoCopy = document.getElementById('autoCopy');

    // Default settings
    const defaultSettings = {
        defaultLength: 12,
        defaultUppercase: true,
        defaultNumbers: true,
        defaultSymbols: true,
        saveHistory: true,
        autoCopy: true
    };

    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem('passwordSettings') || '{}');
        const settings = { ...defaultSettings, ...savedSettings };

        // Apply settings to form
        defaultLength.value = settings.defaultLength;
        defaultUppercase.checked = settings.defaultUppercase;
        defaultNumbers.checked = settings.defaultNumbers;
        defaultSymbols.checked = settings.defaultSymbols;
        saveHistory.checked = settings.saveHistory;
        autoCopy.checked = settings.autoCopy;

        return settings;
    }

    // Save settings to localStorage
    function saveSettings(settings) {
        localStorage.setItem('passwordSettings', JSON.stringify(settings));
        showSaveSuccess();
    }

    // Show success message
    function showSaveSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'settings-success';
        successMessage.textContent = 'Settings saved successfully!';
        
        settingsForm.appendChild(successMessage);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }

    // Validate settings
    function validateSettings(settings) {
        const errors = [];

        if (settings.defaultLength < 8) {
            errors.push('Password length must be at least 8 characters');
        }
        if (settings.defaultLength > 32) {
            errors.push('Password length must not exceed 32 characters');
        }

        return errors;
    }

    // Show validation errors
    function showErrors(errors) {
        // Remove any existing error messages
        const existingErrors = document.querySelectorAll('.settings-error');
        existingErrors.forEach(error => error.remove());

        // Create and show new error messages
        const errorContainer = document.createElement('div');
        errorContainer.className = 'settings-error';
        
        errors.forEach(error => {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = error;
            errorContainer.appendChild(errorMessage);
        });

        settingsForm.insertBefore(errorContainer, settingsForm.firstChild);
    }

    // Handle form submission
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get current settings from form
        const currentSettings = {
            defaultLength: parseInt(defaultLength.value),
            defaultUppercase: defaultUppercase.checked,
            defaultNumbers: defaultNumbers.checked,
            defaultSymbols: defaultSymbols.checked,
            saveHistory: saveHistory.checked,
            autoCopy: autoCopy.checked
        };

        // Validate settings
        const errors = validateSettings(currentSettings);

        if (errors.length > 0) {
            showErrors(errors);
            return;
        }

        // Save settings
        saveSettings(currentSettings);

        // Update any active generator instances
        if (window.updateGeneratorSettings) {
            window.updateGeneratorSettings(currentSettings);
        }
    });

    // Handle number input validation
    defaultLength.addEventListener('input', () => {
        const value = parseInt(defaultLength.value);
        if (value < 8) defaultLength.value = 8;
        if (value > 32) defaultLength.value = 32;
    });

    // Reset settings button
    const resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'btn btn-secondary';
    resetButton.textContent = 'Reset to Defaults';
    resetButton.onclick = () => {
        if (confirm('Are you sure you want to reset all settings to default values?')) {
            localStorage.removeItem('passwordSettings');
            loadSettings();
        }
    };

    // Add reset button to form
    settingsForm.appendChild(resetButton);

    // Load settings when page loads
    loadSettings();

    // Add to settings.js
    function setupDarkMode() {
        const darkModeToggle = document.createElement('div');
        darkModeToggle.className = 'dark-mode-toggle';
        darkModeToggle.innerHTML = `
            <label class="switch">
                <input type="checkbox" id="darkModeSwitch">
                <span class="slider round"></span>
            </label>
            <span>Dark Mode</span>
        `;

        document.querySelector('.settings-container').prepend(darkModeToggle);
    }

    // Add to settings.js
    function exportSettings() {
        const settings = JSON.parse(localStorage.getItem('passwordSettings'));
        const blob = new Blob([JSON.stringify(settings)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'password-settings.json';
        a.click();
    }
});
