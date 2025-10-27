/**
 * نظام إدارة البيانات للمستخدمين
 * Data Manager System for Users
 * 
 * هذا الملف يوفر نظام شامل لإدارة البيانات الشخصية للمستخدمين
 * This file provides a comprehensive data management system for users
 */

class UserDataManager {
    constructor() {
        this.storageKey = 'zakatUserData';
        this.backupKey = 'zakatBackupData';
        this.currentUserData = null;
        this.init();
    }

    /**
     * تهيئة النظام
     * Initialize the system
     */
    async init() {
        await this.loadUserData();
        this.setupAutoBackup();
    }

    /**
     * تحميل بيانات المستخدم
     * Load user data
     */
    async loadUserData() {
        try {
            const storedData = localStorage.getItem(this.storageKey);
            if (storedData) {
                this.currentUserData = JSON.parse(storedData);
                return this.currentUserData;
            }
            
            // إذا لم توجد بيانات، قم بتحميل القالب الافتراضي
            // If no data exists, load default template
            await this.loadDefaultTemplate();
            return this.currentUserData;
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            await this.loadDefaultTemplate();
        }
    }

    /**
     * تحميل القالب الافتراضي
     * Load default template
     */
    async loadDefaultTemplate() {
        try {
            const response = await fetch('./user-data-template.json');
            const template = await response.json();
            
            // تحديث التاريخ والوقت
            template.appInfo.createdDate = new Date().toISOString();
            template.appInfo.lastUpdated = new Date().toISOString();
            
            this.currentUserData = template;
            await this.saveUserData();
            
            return this.currentUserData;
        } catch (error) {
            console.error('خطأ في تحميل القالب الافتراضي:', error);
            // إنشاء بيانات افتراضية في حالة عدم تحميل الملف
            this.createDefaultData();
        }
    }

    /**
     * إنشاء بيانات افتراضية
     * Create default data
     */
    createDefaultData() {
        this.currentUserData = {
            appInfo: {
                version: "1.0.0",
                userName: "",
                createdDate: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                theme: "default"
            },
            categories: [
                { id: 1, name: "الفقير", icon: "fas fa-heart", percentage: 25, targetAmount: 0, currentAmount: 0, paid: false, color: "#e74c3c" },
                { id: 2, name: "المسكين", icon: "fas fa-hands-helping", percentage: 20, targetAmount: 0, currentAmount: 0, paid: false, color: "#3498db" },
                { id: 3, name: "العمال", icon: "fas fa-user-tie", percentage: 15, targetAmount: 0, currentAmount: 0, paid: false, color: "#2ecc71" },
                { id: 4, name: "المؤلفة قلوبهم", icon: "fas fa-smile", percentage: 10, targetAmount: 0, currentAmount: 0, paid: false, color: "#f39c12" },
                { id: 5, name: "في الرقاب", icon: "fas fa-key", percentage: 10, targetAmount: 0, currentAmount: 0, paid: false, color: "#9b59b6" },
                { id: 6, name: "في سبيل الله", icon: "fas fa-crosshairs", percentage: 10, targetAmount: 0, currentAmount: 0, paid: false, color: "#e67e22" },
                { id: 7, name: "ابن السبيل", icon: "fas fa-route", percentage: 10, targetAmount: 0, currentAmount: 0, paid: false, color: "#1abc9c" }
            ],
            activities: [],
            summary: {
                totalZakat: 0,
                totalDonations: 0,
                completedCategories: 0,
                progressPercentage: 0,
                reflections: "",
                monthlyGoal: 0,
                yearlyGoal: 0
            },
            settings: {
                notifications: true,
                autoBackup: true,
                backupFrequency: "weekly",
                currency: "SAR",
                language: "ar",
                reminderEnabled: true,
                reminderDays: [1, 15]
            }
        };
    }

    /**
     * حفظ بيانات المستخدم
     * Save user data
     */
    async saveUserData() {
        if (!this.currentUserData) return;
        
        try {
            this.currentUserData.appInfo.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(this.currentUserData));
            
            // إنشاء نسخة احتياطية
            await this.createBackup();
            
            return true;
        } catch (error) {
            console.error('خطأ في حفظ البيانات:', error);
            return false;
        }
    }

    /**
     * إنشاء نسخة احتياطية
     * Create backup
     */
    async createBackup() {
        try {
            const backup = {
                data: this.currentUserData,
                timestamp: new Date().toISOString(),
                version: "1.0.0"
            };
            
            const backups = this.getBackupHistory();
            backups.unshift(backup);
            
            // الاحتفاظ بآخر 5 نسخ احتياطية فقط
            if (backups.length > 5) {
                backups.splice(5);
            }
            
            localStorage.setItem(this.backupKey, JSON.stringify(backups));
        } catch (error) {
            console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
        }
    }

    /**
     * الحصول على تاريخ النسخ الاحتياطية
     * Get backup history
     */
    getBackupHistory() {
        try {
            const backupData = localStorage.getItem(this.backupKey);
            return backupData ? JSON.parse(backupData) : [];
        } catch (error) {
            console.error('خطأ في قراءة النسخ الاحتياطية:', error);
            return [];
        }
    }

    /**
     * تصدير البيانات
     * Export data
     */
    async exportData(filename = null) {
        if (!this.currentUserData) return null;
        
        const timestamp = new Date().toISOString().split('T')[0];
        const exportData = {
            exportInfo: {
                exportDate: timestamp,
                version: "1.0.0",
                userAgent: navigator.userAgent
            },
            data: this.currentUserData
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(dataBlob);
        downloadLink.download = filename || `zakat-data-${timestamp}.json`;
        downloadLink.click();
        
        URL.revokeObjectURL(downloadLink.href);
        
        return exportData;
    }

    /**
     * استيراد البيانات
     * Import data
     */
    async importData(file) {
        try {
            const fileContent = await this.readFileAsText(file);
            const importData = JSON.parse(fileContent);
            
            if (!importData.data) {
                throw new Error('ملف البيانات غير صحيح');
            }
            
            // التحقق من صحة البيانات
            if (!this.validateImportedData(importData.data)) {
                throw new Error('تنسيق البيانات غير متوافق');
            }
            
            // إنشاء نسخة احتياطية من البيانات الحالية قبل الاستيراد
            await this.createBackup();
            
            this.currentUserData = importData.data;
            await this.saveUserData();
            
            return true;
        } catch (error) {
            console.error('خطأ في استيراد البيانات:', error);
            throw error;
        }
    }

    /**
     * قراءة الملف كنص
     * Read file as text
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(e);
            reader.readAsText(file, 'UTF-8');
        });
    }

    /**
     * التحقق من صحة البيانات المستوردة
     * Validate imported data
     */
    validateImportedData(data) {
        const requiredFields = ['categories', 'activities', 'summary', 'settings'];
        
        for (const field of requiredFields) {
            if (!(field in data)) {
                return false;
            }
        }
        
        // التحقق من صحة الفئات
        if (!Array.isArray(data.categories) || data.categories.length === 0) {
            return false;
        }
        
        return true;
    }

    /**
     * استعادة من نسخة احتياطية
     * Restore from backup
     */
    async restoreFromBackup(backupIndex = 0) {
        try {
            const backups = this.getBackupHistory();
            if (backupIndex >= backups.length) {
                throw new Error('رقم النسخة الاحتياطية غير صحيح');
            }
            
            const backup = backups[backupIndex];
            this.currentUserData = backup.data;
            await this.saveUserData();
            
            return true;
        } catch (error) {
            console.error('خطأ في استعادة النسخة الاحتياطية:', error);
            throw error;
        }
    }

    /**
     * إعادة تعيين البيانات
     * Reset data
     */
    async resetData() {
        if (confirm('هل أنت متأكد من إعادة تعيين جميع البيانات؟ سيتم إنشاء نسخة احتياطية أولاً.')) {
            await this.createBackup();
            this.currentUserData = null;
            localStorage.removeItem(this.storageKey);
            await this.loadDefaultTemplate();
            return true;
        }
        return false;
    }

    /**
     * الحصول على إحصائيات الاستخدام
     * Get usage statistics
     */
    getUsageStatistics() {
        if (!this.currentUserData) return null;
        
        const data = this.currentUserData;
        const stats = {
            totalCategories: data.categories.length,
            completedCategories: data.categories.filter(cat => cat.paid).length,
            totalActivities: data.activities.length,
            totalDonation: data.activities.reduce((sum, act) => sum + act.amount, 0),
            daysUsing: Math.floor((new Date() - new Date(data.appInfo.createdDate)) / (1000 * 60 * 60 * 24)),
            lastActivity: data.activities.length > 0 ? 
                Math.max(...data.activities.map(act => new Date(act.date))) : null
        };
        
        return stats;
    }

    /**
     * إعداد النسخ الاحتياطي التلقائي
     * Setup automatic backup
     */
    setupAutoBackup() {
        if (!this.currentUserData?.settings?.autoBackup) return;
        
        const frequency = this.currentUserData.settings.backupFrequency;
        let interval;
        
        switch (frequency) {
            case 'daily':
                interval = 24 * 60 * 60 * 1000; // 24 hours
                break;
            case 'weekly':
                interval = 7 * 24 * 60 * 60 * 1000; // 7 days
                break;
            case 'monthly':
                interval = 30 * 24 * 60 * 60 * 1000; // 30 days
                break;
            default:
                return;
        }
        
        setInterval(() => {
            this.createBackup();
        }, interval);
    }

    /**
     * الحصول على بيانات المستخدم الحالية
     * Get current user data
     */
    getCurrentUserData() {
        return this.currentUserData;
    }

    /**
     * تحديث بيانات المستخدم
     * Update user data
     */
    updateUserData(newData) {
        this.currentUserData = { ...this.currentUserData, ...newData };
        return this.saveUserData();
    }
}

// تصدير الكلاس للاستخدام
window.UserDataManager = UserDataManager;