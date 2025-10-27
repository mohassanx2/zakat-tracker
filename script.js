// Zakat & Charity Tracker - Main JavaScript File
class ZakatTracker {
    constructor() {
        this.currentMonth = this.getCurrentMonth();
        this.categories = [];
        this.activities = [];
        this.summary = {
            favoriteCategory: '',
            impactfulCase: '',
            nextMonthIntention: ''
        };
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateUI();
        this.generateCurrentMonth();
    }

    getCurrentMonth() {
        const months = [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        const now = new Date();
        return `${months[now.getMonth()]} ${now.getFullYear()}`;
    }

    // Data Management
    loadData() {
        const savedData = localStorage.getItem('zakatTrackerData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.categories = data.categories || [];
            this.activities = data.activities || [];
            this.summary = data.summary || this.summary;
        }
        
        // If no data exists, create default categories
        if (this.categories.length === 0) {
            this.createDefaultCategories();
        }
    }

    saveData() {
        const data = {
            categories: this.categories,
            activities: this.activities,
            summary: this.summary,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('zakatTrackerData', JSON.stringify(data));
    }

    createDefaultCategories() {
        this.categories = [
            {
                id: 1,
                name: 'الفقراء والمساكين',
                icon: '🧍‍♂️',
                percentage: 30,
                amount: 300,
                paidAmount: 0,
                isPaid: false,
                notes: 'للأسر المحتاجة والفقراء'
            },
            {
                id: 2,
                name: 'العلاج والدواء',
                icon: '💊',
                percentage: 20,
                amount: 200,
                paidAmount: 0,
                isPaid: false,
                notes: 'للمرضى والمحتاجين للعلاج'
            },
            {
                id: 3,
                name: 'التعليم / طلاب محتاجين',
                icon: '🏫',
                percentage: 15,
                amount: 150,
                paidAmount: 0,
                isPaid: false,
                notes: 'للطلاب والأسر التعليمية'
            },
            {
                id: 4,
                name: 'وجبات وطعام',
                icon: '🍞',
                percentage: 10,
                amount: 100,
                paidAmount: 0,
                isPaid: false,
                notes: 'للوجبات السريعة والفورية'
            },
            {
                id: 5,
                name: 'خدمية (سبيل / مسجد)',
                icon: '💧',
                percentage: 10,
                amount: 100,
                paidAmount: 0,
                isPaid: false,
                notes: 'للخدمات العامة والخيرية'
            },
            {
                id: 6,
                name: 'صدقة جارية',
                icon: '🕊️',
                percentage: 10,
                amount: 100,
                paidAmount: 0,
                isPaid: false,
                notes: 'للبناء الخيري المستمر'
            },
            {
                id: 7,
                name: 'حالات طارئة أو إنسانية',
                icon: '🌍',
                percentage: 5,
                amount: 50,
                paidAmount: 0,
                isPaid: false,
                notes: 'للحالات الطارئة والعاجلة'
            }
        ];
        this.saveData();
    }

    // UI Updates
    updateUI() {
        this.updateProgressBar();
        this.renderCategories();
        this.renderActivities();
        this.updateHeaderStats();
        this.loadSummary();
    }

    updateProgressBar() {
        const totalAmount = this.categories.reduce((sum, cat) => sum + cat.amount, 0);
        const paidAmount = this.categories.reduce((sum, cat) => sum + (cat.isPaid ? cat.amount : 0), 0);
        const progressPercentage = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

        document.getElementById('progressBar').style.width = `${progressPercentage}%`;
        document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;
        document.getElementById('amountPaid').textContent = `${paidAmount} جنيه`;
        document.getElementById('amountRemaining').textContent = `${totalAmount - paidAmount} جنيه متبقي`;
    }

    updateHeaderStats() {
        document.getElementById('currentMonth').textContent = this.currentMonth;
        const totalAmount = this.categories.reduce((sum, cat) => sum + cat.amount, 0);
        document.getElementById('monthlyGoal').textContent = `${totalAmount} جنيه`;
    }

    renderCategories() {
        const grid = document.getElementById('categoriesGrid');
        grid.innerHTML = '';

        this.categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card fade-in';
            
            const progress = category.isPaid ? 100 : 0;
            const statusText = category.isPaid ? '✅ تم الدفع' : '⏳ معلق';
            
            categoryCard.innerHTML = `
                <div class="category-header">
                    <div>
                        <div class="category-icon">${category.icon}</div>
                        <div class="category-name">${category.name}</div>
                    </div>
                    <div class="amount-text">${category.amount} <span class="amount-currency">جنيه</span></div>
                </div>
                
                <div class="category-amount">
                    <div class="progress-text">
                        <span>${category.percentage}% من الإجمالي</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progress}%;"></div>
                    </div>
                </div>
                
                <div class="category-status">
                    <strong>الحالة: ${statusText}</strong>
                    ${category.notes ? `<br><small>${category.notes}</small>` : ''}
                </div>
                
                <div class="category-actions">
                    <button class="action-btn btn-pay" onclick="tracker.markAsPaid(${category.id})" ${category.isPaid ? 'disabled' : ''}>
                        ${category.isPaid ? '✅ مدفوع' : '💰 ادفع'}
                    </button>
                    <button class="action-btn btn-undo" onclick="tracker.markAsUnpaid(${category.id})" ${!category.isPaid ? 'disabled' : ''}>
                        ↩️ تراجع
                    </button>
                    <button class="action-btn btn-edit" onclick="tracker.editCategory(${category.id})">
                        ✏️ تعديل
                    </button>
                    <button class="action-btn btn-delete" onclick="tracker.deleteCategory(${category.id})">
                        🗑️ حذف
                    </button>
                </div>
            `;
            
            grid.appendChild(categoryCard);
        });
    }

    renderActivities() {
        const list = document.getElementById('activitiesList');
        list.innerHTML = '';

        if (this.activities.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: #718096;">لا توجد أنشطة بعد</p>';
            return;
        }

        // Show last 10 activities
        const recentActivities = this.activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);

        recentActivities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item fade-in';
            
            const timeAgo = this.getTimeAgo(new Date(activity.timestamp));
            
            activityItem.innerHTML = `
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${timeAgo}</div>
            `;
            
            list.appendChild(activityItem);
        });
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / 60000);
        
        if (diffInMinutes < 1) return 'الآن';
        if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `منذ ${diffInDays} يوم`;
    }

    // Category Management
    markAsPaid(categoryId) {
        const category = this.categories.find(cat => cat.id === categoryId);
        if (category) {
            category.isPaid = true;
            category.paidAmount = category.amount;
            
            this.addActivity(
                '💰',
                `تم دفع ${category.amount} جنيه لـ ${category.name}`
            );
            
            this.saveData();
            this.updateUI();
            this.showNotification(`تم تسجيل دفع ${category.name} بنجاح!`, 'success');
        }
    }

    markAsUnpaid(categoryId) {
        const category = this.categories.find(cat => cat.id === categoryId);
        if (category) {
            category.isPaid = false;
            category.paidAmount = 0;
            
            this.addActivity(
                '↩️',
                `تم إلغاء دفع ${category.amount} جنيه لـ ${category.name}`
            );
            
            this.saveData();
            this.updateUI();
            this.showNotification(`تم إلغاء دفع ${category.name}`, 'info');
        }
    }

    addCategory(categoryData) {
        const newCategory = {
            id: Date.now(),
            name: categoryData.name,
            icon: categoryData.icon,
            percentage: parseFloat(categoryData.percentage),
            amount: parseFloat(categoryData.amount),
            paidAmount: 0,
            isPaid: false,
            notes: categoryData.notes || ''
        };

        this.categories.push(newCategory);
        
        this.addActivity(
            '➕',
            `تم إضافة فئة جديدة: ${newCategory.name} (${newCategory.amount} جنيه)`
        );
        
        this.saveData();
        this.updateUI();
        this.showNotification(`تم إضافة فئة ${newCategory.name} بنجاح!`, 'success');
    }

    editCategory(categoryId) {
        const category = this.categories.find(cat => cat.id === categoryId);
        if (!category) return;

        // Simple prompt-based editing (could be enhanced with modal)
        const newName = prompt('اسم الفئة:', category.name);
        if (newName && newName !== category.name) {
            const oldName = category.name;
            category.name = newName;
            
            this.addActivity(
                '✏️',
                `تم تعديل اسم الفئة من "${oldName}" إلى "${newName}"`
            );
        }

        const newAmount = prompt('المبلغ:', category.amount);
        if (newAmount && !isNaN(newAmount) && parseFloat(newAmount) !== category.amount) {
            const oldAmount = category.amount;
            category.amount = parseFloat(newAmount);
            
            this.addActivity(
                '💰',
                `تم تعديل مبلغ "${category.name}" من ${oldAmount} إلى ${newAmount} جنيه`
            );
        }

        this.saveData();
        this.updateUI();
        this.showNotification(`تم تعديل فئة ${category.name} بنجاح!`, 'success');
    }

    deleteCategory(categoryId) {
        const category = this.categories.find(cat => cat.id === categoryId);
        if (!category) return;

        if (confirm(`هل أنت متأكد من حذف فئة "${category.name}"؟`)) {
            this.categories = this.categories.filter(cat => cat.id !== categoryId);
            
            this.addActivity(
                '🗑️',
                `تم حذف فئة: ${category.name} (${category.amount} جنيه)`
            );
            
            this.saveData();
            this.updateUI();
            this.showNotification(`تم حذف فئة ${category.name}`, 'warning');
        }
    }

    // Activity Management
    addActivity(icon, description) {
        const activity = {
            id: Date.now(),
            icon,
            description,
            timestamp: new Date().toISOString()
        };
        
        this.activities.push(activity);
        
        // Keep only last 50 activities
        if (this.activities.length > 50) {
            this.activities = this.activities.slice(-50);
        }
    }

    // Summary Management
    saveSummary() {
        this.summary.favoriteCategory = document.getElementById('favoriteCategory').value;
        this.summary.impactfulCase = document.getElementById('impactfulCase').value;
        this.summary.nextMonthIntention = document.getElementById('nextMonthIntention').value;
        
        this.saveData();
        this.showNotification('تم حفظ الملخص بنجاح!', 'success');
    }

    loadSummary() {
        document.getElementById('favoriteCategory').value = this.summary.favoriteCategory || '';
        document.getElementById('impactfulCase').value = this.summary.impactfulCase || '';
        document.getElementById('nextMonthIntention').value = this.summary.nextMonthIntention || '';
    }

    // Utility Functions
    generateCurrentMonth() {
        // This function can be extended to generate new monthly reports
        console.log('Current month generated:', this.currentMonth);
    }

    resetMonth() {
        if (confirm('هل أنت متأكد من إعادة تعيين الشهر؟ سيتم حذف جميع المدفوعات والأنشطة.')) {
            this.categories.forEach(category => {
                category.isPaid = false;
                category.paidAmount = 0;
            });
            
            this.activities = [];
            
            this.addActivity(
                '🔄',
                `تم إعادة تعيين شهر ${this.currentMonth}`
            );
            
            this.saveData();
            this.updateUI();
            this.showNotification('تم إعادة تعيين الشهر بنجاح!', 'info');
        }
    }

    exportData() {
        const dataToExport = {
            month: this.currentMonth,
            categories: this.categories,
            activities: this.activities,
            summary: this.summary,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `zakat-tracker-${this.currentMonth.replace(' ', '-')}.json`;
        link.click();
        
        this.showNotification('تم تصدير البيانات بنجاح!', 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#48bb78' : type === 'warning' ? '#ed8936' : '#4299e1'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1001;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideDown 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('addCategoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    handleFormSubmission() {
        const formData = {
            name: document.getElementById('categoryName').value,
            percentage: document.getElementById('categoryPercentage').value,
            amount: document.getElementById('categoryAmount').value,
            icon: document.getElementById('categoryIcon').value,
            notes: document.getElementById('categoryNotes').value
        };

        this.addCategory(formData);
        this.closeModal();
        
        // Reset form
        document.getElementById('addCategoryForm').reset();
    }

    generateCurrentMonth() {
        document.getElementById('currentMonth').textContent = this.currentMonth;
    }
}

// Modal Functions
function showAddModal() {
    document.getElementById('addModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialize the tracker
const tracker = new ZakatTracker();

// Global functions for HTML onclick events
function showAddModal() {
    tracker.showAddModal();
}

function closeModal() {
    tracker.closeModal();
}

function resetMonth() {
    tracker.resetMonth();
}

function exportData() {
    tracker.exportData();
}

function saveSummary() {
    tracker.saveSummary();
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);