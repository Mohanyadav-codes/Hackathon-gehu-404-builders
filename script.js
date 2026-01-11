// ============================================
// CRED TRACKER - Frontend JavaScript
// Complete Backend Integration
// ============================================

// ⚙️ CONFIGURATION - UPDATE WITH YOUR BACKEND URL
const API_BASE_URL = 'https://fastapi-for-first-hackathon-su9r.onrender.com';

// API Endpoints
const API = {
    getUserProfile: '/user/profile',
    getCreditScore: '/credit/score',
    getCreditHistory: '/credit/history',
    getUpcomingBills: '/bills/upcoming',
    payBill: '/bills/pay',
    getPrioritizedEMIs: '/emis/prioritized',
    payEMI: '/emis/pay',
    getHiddenDebt: '/debt/hidden',
    scanForDebt: '/debt/scan'
};

// ============================================
// API REQUEST HANDLER
// ============================================

async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Failed:', error);
        showToast('error', 'Failed to fetch data. Please check backend connection.');
        throw error;
    }
}

// ============================================
// DATA LOADING FUNCTIONS
// ============================================

async function loadUserProfile() {
    try {
        const data = await apiRequest(API.getUserProfile);
        
        const userAvatar = document.getElementById('userAvatar');
        userAvatar.textContent = data.name ? data.name.charAt(0).toUpperCase() : 'U';
        userAvatar.classList.remove('skeleton');
        
        const userName = document.getElementById('userName');
        userName.textContent = data.name || 'User';
        userName.classList.remove('skeleton-text');
        
        const userStatus = document.getElementById('userStatus');
        userStatus.textContent = data.isPremium ? 'Premium Member' : 'Free User';
        userStatus.classList.remove('skeleton-text');
        
    } catch (error) {
        console.error('Failed to load user profile:', error);
        document.getElementById('userAvatar').textContent = 'U';
        document.getElementById('userName').textContent = 'User';
        document.getElementById('userStatus').textContent = 'Error loading';
    }
}

async function loadCreditScore() {
    try {
        const data = await apiRequest(API.getCreditScore);
        
        document.getElementById('scoreValue').textContent = data.score || '---';
        
        const scoreProgress = document.getElementById('scoreProgress');
        const scorePercent = ((data.score || 0) / 850) * 100;
        scoreProgress.style.setProperty('--score-percent', scorePercent);
        
        document.getElementById('scoreDate').textContent = `Last updated: ${formatDate(data.date)}`;
        
        const scoreTrend = document.getElementById('scoreTrend');
        scoreTrend.classList.remove('skeleton');
        
        if (data.trend && data.trend !== 0) {
            scoreTrend.classList.add(data.trend > 0 ? 'positive' : 'negative');
            scoreTrend.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${data.trend > 0 
                        ? '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>'
                        : '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>'
                    }
                </svg>
                <span>${data.trend > 0 ? '+' : ''}${data.trend} pts</span>
            `;
        }
        
        const ratingBadge = document.getElementById('ratingBadge');
        ratingBadge.classList.remove('skeleton');
        ratingBadge.textContent = data.rating || 'N/A';
        ratingBadge.className = `rating-badge ${(data.rating || '').toLowerCase()}`;
        
        document.getElementById('ratingMessage').textContent = getRatingMessage(data.rating);
        
        if (data.factors) {
            updateCreditFactors(data.factors);
        }
        
    } catch (error) {
        console.error('Failed to load credit score:', error);
    }
}

function updateCreditFactors(factors) {
    const factorElements = {
        factorPayment: factors.paymentHistory || 0,
        factorUtilization: factors.creditUtilization || 0,
        factorAge: factors.creditAge || 0
    };
    
    Object.entries(factorElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.style.width = `${value}%`;
        }
    });
}

async function loadUpcomingBills() {
    try {
        const billsList = document.getElementById('billsList');
        const data = await apiRequest(API.getUpcomingBills);
        
        if (!data || !data.bills || data.bills.length === 0) {
            billsList.innerHTML = '<div class="no-data">No upcoming bills found</div>';
            document.getElementById('upcomingBillsCount').textContent = '0';
            document.getElementById('upcomingBillsMeta').textContent = 'No bills due';
            return;
        }
        
        document.getElementById('upcomingBillsCount').textContent = data.bills.length;
        const nextBill = data.bills[0];
        document.getElementById('upcomingBillsMeta').textContent = 
            `Next due: ${getDaysText(nextBill.dueDate)}`;
        
        billsList.innerHTML = data.bills.map((bill, index) => `
            <div class="bill-card ${bill.urgent ? 'urgent' : ''}" 
                 style="animation-delay: ${index * 0.1}s">
                <div class="bill-icon">${bill.icon || '💳'}</div>
                <div class="bill-info">
                    <h4>${bill.name}</h4>
                    <p>${bill.dueText || getDaysText(bill.dueDate)}</p>
                </div>
                <div class="bill-amount">
                    <span class="amount">₹${bill.amount.toLocaleString('en-IN')}</span>
                    <button class="pay-btn" onclick="payBill('${bill.id}')">Pay Now</button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Failed to load bills:', error);
        document.getElementById('billsList').innerHTML = 
            '<div class="no-data">Failed to load bills</div>';
    }
}

async function loadEMIs() {
    try {
        const emiTimeline = document.getElementById('emiTimeline');
        const data = await apiRequest(API.getPrioritizedEMIs);
        
        if (!data || !data.emis || data.emis.length === 0) {
            emiTimeline.innerHTML = '<div class="no-data">No active EMIs found</div>';
            document.getElementById('activeEMIsCount').textContent = '0';
            document.getElementById('activeEMIsMeta').textContent = 'No active EMIs';
            return;
        }
        
        document.getElementById('activeEMIsCount').textContent = data.emis.length;
        document.getElementById('activeEMIsMeta').textContent = 
            `Total: ₹${data.totalMonthly.toLocaleString('en-IN')}/mo`;
        
        emiTimeline.innerHTML = data.emis.map((emi, index) => `
            <div class="emi-item priority-${emi.priority}" 
                 style="animation-delay: ${index * 0.1}s">
                <div class="emi-marker">${index + 1}</div>
                <div class="emi-content">
                    <div class="emi-header">
                        <h4>${emi.name}</h4>
                        <span class="priority-badge ${emi.priority}">
                            ${capitalizeFirst(emi.priority)} Priority
                        </span>
                    </div>
                    <p class="emi-due">${emi.dueText || getDaysText(emi.dueDate)}</p>
                    <div class="emi-details">
                        <span>Amount: ₹${emi.amount.toLocaleString('en-IN')}</span>
                        <span>•</span>
                        <span>${emi.note || 'Regular payment'}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Failed to load EMIs:', error);
        document.getElementById('emiTimeline').innerHTML = 
            '<div class="no-data">Failed to load EMIs</div>';
    }
}

async function loadHiddenDebt() {
    try {
        const hiddenDebtGrid = document.getElementById('hiddenDebtGrid');
        const data = await apiRequest(API.getHiddenDebt);
        
        if (!data || !data.categories || data.categories.length === 0) {
            hiddenDebtGrid.innerHTML = '<div class="no-data">No hidden debt detected</div>';
            document.getElementById('totalHiddenDebt').textContent = 'Total: ₹0/month';
            document.getElementById('hiddenDebtAmount').textContent = '₹0';
            document.getElementById('hiddenDebtMeta').textContent = 'No subscriptions';
            return;
        }
        
        document.getElementById('hiddenDebtAmount').textContent = 
            `₹${data.totalHiddenDebt.toLocaleString('en-IN')}`;
        document.getElementById('hiddenDebtMeta').textContent = 
            `${data.totalSubscriptions} subscriptions`;
        document.getElementById('totalHiddenDebt').textContent = 
            `Total: ₹${data.totalHiddenDebt.toLocaleString('en-IN')}/month`;
        
        hiddenDebtGrid.innerHTML = data.categories.map((category, index) => `
            <div class="debt-category" style="animation-delay: ${index * 0.1}s">
                <div class="category-header">
                    <span class="category-icon">${category.icon}</span>
                    <h4>${category.name}</h4>
                </div>
                <div class="category-amount">₹${category.total.toLocaleString('en-IN')}</div>
                <div class="category-items">
                    ${category.items.map(item => `
                        <div class="debt-item">
                            <span>${item.name}</span>
                            <span>₹${item.amount.toLocaleString('en-IN')}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Failed to load hidden debt:', error);
        document.getElementById('hiddenDebtGrid').innerHTML = 
            '<div class="no-data">Failed to load hidden debt</div>';
    }
}

async function loadCreditHistory(period = '6m') {
    try {
        const creditTimeline = document.getElementById('creditTimeline');
        const data = await apiRequest(`${API.getCreditHistory}?period=${period}`);
        
        if (!data || !data.history || data.history.length === 0) {
            creditTimeline.innerHTML = '<div class="no-data">No credit history available</div>';
            return;
        }
        
        creditTimeline.innerHTML = data.history.map(event => `
            <div class="timeline-event ${event.impact > 0 ? 'positive' : 'negative'}">
                <div class="event-date">${formatDate(event.date)}</div>
                <div class="event-score">Score: ${event.score}</div>
                <div class="event-description">${event.event}</div>
                <div class="event-impact">Impact: ${event.impact > 0 ? '+' : ''}${event.impact}</div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Failed to load credit history:', error);
        document.getElementById('creditTimeline').innerHTML = 
            '<div class="no-data">Failed to load credit history</div>';
    }
}

// ============================================
// ACTION FUNCTIONS
// ============================================

async function payBill(billId) {
    const button = event.target;
    button.disabled = true;
    button.textContent = 'Processing...';
    
    try {
        showToast('info', 'Processing payment...');
        
        const response = await apiRequest(API.payBill, 'POST', { billId });
        
        if (response.success) {
            showToast('success', 'Payment successful!');
            await loadUpcomingBills();
            await loadCreditScore();
        } else {
            throw new Error('Payment failed');
        }
        
    } catch (error) {
        console.error('Payment failed:', error);
        showToast('error', 'Payment failed. Please try again.');
        button.disabled = false;
        button.textContent = 'Pay Now';
    }
}

async function scanForHiddenDebt() {
    const button = document.getElementById('scanDebtBtn');
    button.disabled = true;
    button.innerHTML = '<div class="spinner"></div> Scanning...';
    
    try {
        showToast('info', 'Scanning for hidden expenses...');
        
        const response = await apiRequest(API.scanForDebt, 'POST');
        
        if (response.success) {
            showToast('success', `Found ${response.newItems} new recurring expenses`);
            await loadHiddenDebt();
        } else {
            throw new Error('Scan failed');
        }
        
    } catch (error) {
        console.error('Scan failed:', error);
        showToast('error', 'Scan failed. Please try again.');
    } finally {
        button.disabled = false;
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Scan Expenses
        `;
    }
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================

function showToast(type, message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getDaysText(dateString) {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    return `Due in ${diffDays} days`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getRatingMessage(rating) {
    const messages = {
        'excellent': "You're in great shape! Keep it up.",
        'good': 'Good credit health. Keep maintaining it.',
        'fair': 'Room for improvement. Pay bills on time.',
        'poor': 'Needs attention. Focus on timely payments.'
    };
    return messages[rating?.toLowerCase()] || 'Loading...';
}

// ============================================
// NAVIGATION & EVENT HANDLERS
// ============================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const page = item.dataset.page;
            
            const titles = {
                overview: 'Dashboard Overview',
                bills: 'Bills & Alerts',
                emis: 'EMI Scheduler',
                hidden: 'Hidden Debt Detection',
                credit: 'Credit Score Replay'
            };
            
            document.getElementById('pageTitle').textContent = titles[page];
            
            if (page === 'credit') {
                document.getElementById('creditReplaySection').style.display = 'block';
                loadCreditHistory();
            } else {
                document.getElementById('creditReplaySection').style.display = 'none';
            }
        });
    });
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        const bills = document.querySelectorAll('.bill-card');
        bills.forEach(bill => {
            const text = bill.textContent.toLowerCase();
            bill.style.display = text.includes(query) ? 'flex' : 'none';
        });
        
        const emis = document.querySelectorAll('.emi-item');
        emis.forEach(emi => {
            const text = emi.textContent.toLowerCase();
            emi.style.display = text.includes(query) ? 'flex' : 'none';
        });
    });
}

function initButtons() {
    document.getElementById('scanBillsBtn').addEventListener('click', () => {
        loadUpcomingBills();
        showToast('success', 'Bills refreshed');
    });
    
    document.getElementById('scanDebtBtn').addEventListener('click', scanForHiddenDebt);
    
    document.getElementById('filterEMIBtn').addEventListener('click', () => {
        showToast('info', 'Filter options coming soon');
    });
    
    document.getElementById('notificationBtn').addEventListener('click', () => {
        showToast('info', 'Notifications feature coming soon');
    });
    
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            loadCreditHistory(e.target.dataset.period);
        });
    });
}

function setupAutoRefresh() {
    setInterval(() => {
        loadCreditScore();
        loadUpcomingBills();
        loadEMIs();
        loadHiddenDebt();
    }, 5 * 60 * 1000);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 CRED TRACKER Dashboard Initialized');
    console.log('🔗 API Base URL:', API_BASE_URL);
    
    initNavigation();
    initSearch();
    initButtons();
    
    try {
        await Promise.all([
            loadUserProfile(),
            loadCreditScore(),
            loadUpcomingBills(),
            loadEMIs(),
            loadHiddenDebt()
        ]);
        
        console.log('✅ All data loaded successfully');
        
    } catch (error) {
        console.error('❌ Failed to load dashboard data:', error);
        showToast('error', 'Failed to load data. Please check backend connection.');
    }
    
    setupAutoRefresh();
    document.documentElement.style.scrollBehavior = 'smooth';
});

window.payBill = payBill;
window.scanForHiddenDebt = scanForHiddenDebt;