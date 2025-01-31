class DarkModeManager {
    constructor() {
        this.init();
    }

    init() {
        // Check for saved dark mode preference
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        
        // Apply saved preference
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
        }

        // Find dark mode toggle if it exists
        const darkModeToggle = document.getElementById('darkModeSwitch');
        if (darkModeToggle) {
            // Set initial state
            darkModeToggle.checked = savedDarkMode;
            
            // Add event listener
            darkModeToggle.addEventListener('change', () => {
                this.toggleDarkMode(darkModeToggle.checked);
            });
        }
    }

    toggleDarkMode(enable) {
        if (enable) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    }
}

// Initialize dark mode manager when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.darkModeManager = new DarkModeManager();
});
