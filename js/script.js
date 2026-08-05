/**
 * Sunway eLearn Redesign - Interactive Prototype
 * PRG3014 UI/UX Design and Development
 * Final Assessment Group Project
 */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // DOM REFERENCES
    // ============================================
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const mainContent = document.getElementById('mainContent');
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('pageTitle');
    const toast = document.getElementById('toast');

    // ============================================
    // DATE DISPLAY
    // ============================================
    function updateDate() {
        const dateEl = document.getElementById('currentDate');
        if (dateEl) {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.textContent = now.toLocaleDateString('en-US', options);
        }
    }
    updateDate();

    // ============================================
    // SIDEBAR TOGGLE (Mobile)
    // ============================================
    let overlay = null;

    function createOverlay() {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.addEventListener('click', closeSidebar);
            document.body.appendChild(overlay);
        }
        return overlay;
    }

    function openSidebar() {
        sidebar.classList.add('open');
        createOverlay().classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            if (sidebar.classList.contains('open') &&
                !sidebar.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                closeSidebar();
            }
        }
    });

    // ============================================
    // PAGE NAVIGATION
    // ============================================
    const pageTitles = {
        dashboard: 'Dashboard',
        courses: 'My Courses',
        notifications: 'Notifications',
        messages: 'Messages',
        calendar: 'Calendar',
        profile: 'Profile'
    };

    function navigateTo(pageId) {
        // Hide all pages
        pages.forEach(p => p.classList.remove('active'));

        // Show target page
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update nav items
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pageId) {
                item.classList.add('active');
            }
        });

        // Update page title
        if (pageTitles[pageId]) {
            pageTitle.textContent = pageTitles[pageId];
        }

        // Close sidebar on mobile
        if (window.innerWidth <= 992) {
            closeSidebar();
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.dataset.page;
            if (pageId) {
                navigateTo(pageId);
            }
        });
    });

    // Handle "View All" and "All Courses" links
    document.querySelectorAll('[data-page]').forEach(el => {
        if (el.classList.contains('card-link') || el.classList.contains('btn')) {
            el.addEventListener('click', function(e) {
                const pageId = this.dataset.page;
                if (pageId) {
                    e.preventDefault();
                    navigateTo(pageId);
                }
            });
        }
    });

    // ============================================
    // NOTIFICATION FILTERS
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Simple filter logic - demo purpose
            const filter = this.textContent.trim().toLowerCase();
            const items = document.querySelectorAll('.notification-item');

            items.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'flex';
                } else if (filter === 'unread') {
                    item.style.display = item.classList.contains('unread') ? 'flex' : 'none';
                } else {
                    // For demo, show all when specific filter is clicked
                    item.style.display = 'flex';
                }
            });
        });
    });

    // ============================================
    // NOTIFICATION DISMISS
    // ============================================
    document.querySelectorAll('.notification-dismiss').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.notification-item');
            if (item) {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'translateX(40px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });

    // ============================================
    // MESSAGE ITEM CLICK (Demo)
    // ============================================
    document.querySelectorAll('.message-item').forEach(item => {
        item.addEventListener('click', function() {
            // Remove unread status
            this.classList.remove('unread');

            // Update the placeholder
            const view = document.querySelector('.message-view');
            if (view) {
                const sender = this.querySelector('.message-sender')?.textContent || 'User';
                view.innerHTML = `
                    <div class="message-view-placeholder" style="padding: 40px;">
                        <i class="fas fa-comment-dots" style="font-size: 48px; color: var(--primary-light); margin-bottom: 12px; display: block;"></i>
                        <h3 style="font-size: 18px; color: var(--text-primary);">${sender}</h3>
                        <p style="font-size: 14px; color: var(--text-light);">Conversation view would appear here</p>
                        <p style="font-size: 13px; color: var(--text-secondary); margin-top: 8px;">This is a prototype demonstration.</p>
                    </div>
                `;
            }

            // Show toast
            showToast('Message Opened', `Viewing conversation with ${sender}`);
        });
    });

    // ============================================
    // CALENDAR NAVIGATION (Demo)
    // ============================================
    document.querySelectorAll('.calendar-nav').forEach(btn => {
        btn.addEventListener('click', function() {
            const monthDisplay = document.querySelector('.calendar-month');
            if (monthDisplay) {
                const current = monthDisplay.textContent;
                const parts = current.split(' ');
                const month = parts[0];
                const year = parts[1];

                const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                let monthIndex = months.indexOf(month);
                let currentYear = parseInt(year);

                if (this.querySelector('.fa-chevron-left')) {
                    monthIndex--;
                    if (monthIndex < 0) { monthIndex = 11;
                        currentYear--; }
                } else {
                    monthIndex++;
                    if (monthIndex > 11) { monthIndex = 0;
                        currentYear++; }
                }

                monthDisplay.textContent = `${months[monthIndex]} ${currentYear}`;
                showToast('Calendar Updated', `Navigated to ${months[monthIndex]} ${currentYear}`);
            }
        });
    });

    // ============================================
    // TOAST SYSTEM
    // ============================================
    let toastTimeout = null;

    function showToast(title, message, icon = 'fa-check-circle', type = 'success') {
        const toastEl = document.getElementById('toast');
        if (!toastEl) return;

        const iconEl = toastEl.querySelector('.toast-icon i');
        const titleEl = toastEl.querySelector('.toast-title');
        const messageEl = toastEl.querySelector('.toast-message');

        if (iconEl) iconEl.className = `fas ${icon}`;
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;

        // Reset animation
        toastEl.classList.remove('show');
        clearTimeout(toastTimeout);

        // Trigger reflow for animation restart
        void toastEl.offsetWidth;

        toastEl.classList.add('show');

        toastTimeout = setTimeout(() => {
            toastEl.classList.remove('show');
        }, 3500);
    }

    // Toast close button
    document.querySelector('.toast-close')?.addEventListener('click', function() {
        const toastEl = document.getElementById('toast');
        if (toastEl) {
            toastEl.classList.remove('show');
            clearTimeout(toastTimeout);
        }
    });

    // ============================================
    // DEMO: Show welcome toast after load
    // ============================================
    setTimeout(() => {
        showToast('Welcome!', 'Explore the redesigned eLearn interface', 'fa-hand-wave', 'success');
    }, 800);

    // ============================================
    // KEYBOARD SHORTCUTS (Accessibility)
    // ============================================
    document.addEventListener('keydown', function(e) {
        // Escape to close sidebar
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }

        // Ctrl+1-6 for page navigation
        if (e.ctrlKey && e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            const pages = ['dashboard', 'courses', 'notifications', 'messages', 'calendar', 'profile'];
            const index = parseInt(e.key) - 1;
            if (pages[index]) {
                navigateTo(pages[index]);
            }
        }
    });

    // ============================================
    // TOGGLE SWITCHES (Demo)
    // ============================================
    document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const label = this.closest('.setting-item')?.querySelector('.setting-label')?.textContent || 'Setting';
            const state = this.checked ? 'enabled' : 'disabled';
            showToast('Setting Updated', `${label} ${state}`);
        });
    });

    // ============================================
    // PROFILE SETTINGS SELECT (Demo)
    // ============================================
    document.querySelectorAll('.setting-select').forEach(select => {
        select.addEventListener('change', function() {
            const label = this.closest('.setting-item')?.querySelector('.setting-label')?.textContent || 'Setting';
            showToast('Setting Updated', `${label} changed to ${this.value}`);
        });
    });

    // ============================================
    // LOGOUT (Demo)
    // ============================================
    document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        showToast('Logged Out', 'You have been successfully logged out', 'fa-sign-out-alt');
    });

    // ============================================
    // COURSE CARD "View Course" Button (Demo)
    // ============================================
    document.querySelectorAll('.course-card .btn-primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.course-card');
            const code = card?.querySelector('.course-code')?.textContent || 'Course';
            showToast('Course Opened', `Viewing ${code}`);
        });
    });

    // ============================================
    // SEARCH FUNCTIONALITY (Demo)
    // ============================================
    const searchInput = document.querySelector('.header-search input');
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim().length > 0) {
                e.preventDefault();
                showToast('Search', `Searching for "${this.value.trim()}"`, 'fa-search');
                this.value = '';
            }
        });
    }

    // ============================================
    // WINDOW RESIZE HANDLER
    // ============================================
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 992 && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        }, 300);
    });

    console.log('🎓 Sunway eLearn Redesign Prototype loaded successfully!');
    console.log('📝 PRG3014 UI/UX Design and Development - Final Assessment');
    console.log('👥 Group: Joey Simon Abrahams, Malcolm Jeremiah Richard, Nicholas Nio Keng Xuan');
});
