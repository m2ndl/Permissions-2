document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    let state = {
        used: 0,
        history: []
    };
    let currentMonthDetails = UmAlQuraCalendar.getMonthDetails();
    let currentStorageKey = `permissions_${currentMonthDetails.year}_${currentMonthDetails.month}`;

    // --- DOM ELEMENTS ---
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    // Home Page Elements
    const hijriMonthYearEl = document.getElementById('hijri-month-year');
    const gregorianDatesEl = document.getElementById('gregorian-dates');
    const workdaysEl = document.getElementById('workdays');
    const permissionsUsedEl = document.getElementById('permissions-used');
    const progressBarEl = document.getElementById('progress-bar');
    const permissionsRemainingEl = document.getElementById('permissions-remaining');
    const btnLate = document.getElementById('use-late-arrival');
    const btnEarly = document.getElementById('use-early-departure');

    // History Page Elements
    const historyLogEl = document.getElementById('history-log');
    const historyPlaceholderEl = document.getElementById('history-placeholder');

    // Settings Page Elements
    const appStatusEl = document.getElementById('app-status');
    const installButton = document.getElementById('install-button');

    // Modal Elements
    const modal = document.getElementById('confirmation-modal');
    const modalText = document.getElementById('modal-text');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    
    // --- FUNCTIONS ---
    
    const loadState = () => {
        const savedState = localStorage.getItem(currentStorageKey);
        if (savedState) {
            state = JSON.parse(savedState);
        } else {
            // New month, reset state
            state = { used: 0, history: [] };
        }
    };

    const saveState = () => {
        localStorage.setItem(currentStorageKey, JSON.stringify(state));
    };

    const renderUI = () => {
        // Home Page
        hijriMonthYearEl.textContent = `${currentMonthDetails.name} ${currentMonthDetails.year}`;
        gregorianDatesEl.textContent = `${currentMonthDetails.gregorianStart} - ${currentMonthDetails.gregorianEnd}`;
        workdaysEl.textContent = `(${currentMonthDetails.workdays} Workdays)`;
        permissionsUsedEl.textContent = state.used;
        permissionsRemainingEl.textContent = 10 - state.used;
        const progressPercentage = (state.used / 10) * 100;
        progressBarEl.style.width = `${progressPercentage}%`;

        // Disable buttons if limit is reached
        if (state.used >= 10) {
            btnLate.disabled = true;
            btnEarly.disabled = true;
            btnLate.style.backgroundColor = '#B0BEC5';
            btnEarly.style.backgroundColor = '#B0BEC5';
        }
        
        // History Page
        historyLogEl.innerHTML = ''; // Clear previous entries
        if (state.history.length === 0) {
            historyLogEl.appendChild(historyPlaceholderEl);
        } else {
            // Newest first
            state.history.slice().reverse().forEach(item => {
                const logItem = document.createElement('div');
                logItem.className = 'log-item';
                logItem.innerHTML = `
                    <p class="type">${item.type}</p>
                    <p class="date">${item.date}</p>
                `;
                historyLogEl.appendChild(logItem);
            });
        }
    };

    const showModal = (permissionType, callback) => {
        modalText.textContent = `Are you sure you want to use a "${permissionType}" permission?`;
        modal.style.display = 'flex';
        
        const confirmHandler = () => {
            callback(true);
            hideModal();
            removeListeners();
        };
        const cancelHandler = () => {
            callback(false);
            hideModal();
            removeListeners();
        };

        const removeListeners = () => {
            modalConfirmBtn.removeEventListener('click', confirmHandler);
            modalCancelBtn.removeEventListener('click', cancelHandler);
        };
        
        modalConfirmBtn.addEventListener('click', confirmHandler);
        modalCancelBtn.addEventListener('click', cancelHandler);
    };

    const hideModal = () => {
        modal.style.display = 'none';
    };
    
    const usePermission = (type) => {
        if (state.used >= 10) return;
        
        showModal(type, (confirmed) => {
            if (confirmed) {
                state.used++;
                state.history.push({
                    type: type,
                    date: UmAlQuraCalendar.getCurrentHijriDateString()
                });
                saveState();
                renderUI();
            }
        });
    };
    
    const setupEventListeners = () => {
        btnLate.addEventListener('click', () => usePermission('Late Arrival'));
        btnEarly.addEventListener('click', () => usePermission('Early Departure'));

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetPageId = button.dataset.page;
                
                // Update button active state
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show the target page
                pages.forEach(page => {
                    page.classList.toggle('active', page.id === targetPageId);
                });
            });
        });
    };

    const setupPWA = () => {
        // Register Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('Service Worker registered.', reg))
                    .catch(err => console.error('Service Worker registration failed:', err));
            });
        }
        
        // App Status Check
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            appStatusEl.textContent = 'Installed on device';
            installButton.style.display = 'none';
        } else {
            appStatusEl.textContent = 'Running in browser';
        }
        
        // Install Logic
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installButton.style.display = 'block';
            
            installButton.addEventListener('click', async () => {
                installButton.style.display = 'none';
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                deferredPrompt = null;
            });
        });
    };

    // --- INITIALIZATION ---
    function init() {
        loadState();
        renderUI();
        setupEventListeners();
        setupPWA();
    }
    
    init();
});
