document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const exportHistoryBtn = document.getElementById('exportHistory');

    // Load and display password history
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
        historyList.innerHTML = ''; // Clear current list

        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="history-empty">
                    <p>No passwords in history yet.</p>
                </div>
            `;
            return;
        }

        history.forEach((entry, index) => {
            const date = new Date(entry.date).toLocaleString();
            const strengthClass = getStrengthClass(entry.strength);
            
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="password-info">
                    <div class="password-text">${maskPassword(entry.password)}</div>
                    <div class="password-meta">
                        <span class="date">${date}</span>
                        <span class="strength ${strengthClass}">${getStrengthLabel(entry.strength)}</span>
                    </div>
                </div>
                <div class="password-actions">
                    <button class="btn btn-icon show-btn" title="Show/Hide Password">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-icon copy-btn" title="Copy Password">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn btn-icon delete-btn" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Add event listeners for buttons
            const showBtn = historyItem.querySelector('.show-btn');
            const copyBtn = historyItem.querySelector('.copy-btn');
            const deleteBtn = historyItem.querySelector('.delete-btn');
            const passwordText = historyItem.querySelector('.password-text');

            // Show/Hide password
            showBtn.addEventListener('click', () => {
                if (passwordText.textContent === maskPassword(entry.password)) {
                    passwordText.textContent = entry.password;
                    showBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    passwordText.textContent = maskPassword(entry.password);
                    showBtn.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });

            // Copy password
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(entry.password).then(() => {
                    showCopyFeedback(copyBtn);
                });
            });

            // Delete password
            deleteBtn.addEventListener('click', () => {
                history.splice(index, 1);
                localStorage.setItem('passwordHistory', JSON.stringify(history));
                loadHistory();
            });

            historyList.appendChild(historyItem);
        });
    }

    // Helper functions
    function maskPassword(password) {
        return '•'.repeat(password.length);
    }

    function getStrengthClass(strength) {
        if (strength <= 25) return 'weak';
        if (strength <= 50) return 'moderate';
        if (strength <= 75) return 'strong';
        return 'very-strong';
    }

    function getStrengthLabel(strength) {
        if (strength <= 25) return 'Weak';
        if (strength <= 50) return 'Moderate';
        if (strength <= 75) return 'Strong';
        return 'Very Strong';
    }

    function showCopyFeedback(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    }

    // Clear history button handler
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all password history?')) {
            localStorage.removeItem('passwordHistory');
            loadHistory();
        }
    });

    // Export history button handler
    exportHistoryBtn.addEventListener('click', () => {
        const history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
        const exportData = history.map(entry => ({
            password: entry.password,
            date: new Date(entry.date).toLocaleString(),
            strength: getStrengthLabel(entry.strength)
        }));

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'password-history.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Load history when page loads
    loadHistory();
});
