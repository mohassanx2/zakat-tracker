/**
 * واجهة إدارة البيانات للمستخدمين
 * User Data Management Interface
 * 
 * يوفر واجهة بسيطة وسهلة لإدارة البيانات الشخصية
 * Provides simple and easy interface for managing personal data
 */

class DataInterface {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.isVisible = false;
        this.init();
    }

    /**
     * تهيئة الواجهة
     * Initialize interface
     */
    init() {
        this.createInterface();
        this.bindEvents();
    }

    /**
     * إنشاء واجهة إدارة البيانات
     * Create data management interface
     */
    createInterface() {
        const container = document.createElement('div');
        container.id = 'data-management-panel';
        container.className = 'data-management-panel';
        container.innerHTML = `
            <div class="data-header">
                <h3>إدارة البيانات الشخصية</h3>
                <button class="close-btn" onclick="dataInterface.togglePanel()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="data-content">
                <!-- إحصائيات الاستخدام -->
                <div class="stats-section">
                    <h4>إحصائيات الاستخدام</h4>
                    <div class="stats-grid" id="usage-stats">
                        <!-- سيتم ملؤها ديناميكياً -->
                    </div>
                </div>

                <!-- نسخ احتياطية -->
                <div class="backup-section">
                    <h4>النسخ الاحتياطية</h4>
                    <div class="backup-actions">
                        <button onclick="dataInterface.exportData()" class="btn btn-primary">
                            <i class="fas fa-download"></i> تصدير البيانات
                        </button>
                        <button onclick="dataInterface.importData()" class="btn btn-secondary">
                            <i class="fas fa-upload"></i> استيراد البيانات
                        </button>
                        <input type="file" id="import-file" accept=".json" style="display: none;" onchange="dataInterface.handleFileImport(event)">
                    </div>
                    <div class="backup-list" id="backup-list">
                        <!-- سيتم ملؤها ديناميكياً -->
                    </div>
                </div>

                <!-- إعدادات البيانات -->
                <div class="settings-section">
                    <h4>إعدادات البيانات</h4>
                    <div class="settings-form">
                        <div class="form-group">
                            <label>اسم المستخدم (اختياري)</label>
                            <input type="text" id="user-name" placeholder="أدخل اسمك">
                        </div>
                        <div class="form-group">
                            <label>العملة المفضلة</label>
                            <select id="currency">
                                <option value="SAR">ريال سعودي</option>
                                <option value="AED">درهم إماراتي</option>
                                <option value="USD">دولار أمريكي</option>
                                <option value="EUR">يورو</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>النسخ الاحتياطي التلقائي</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="auto-backup" checked>
                                <label for="auto-backup"></label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>تكرار النسخ الاحتياطي</label>
                            <select id="backup-frequency">
                                <option value="daily">يومي</option>
                                <option value="weekly" selected>أسبوعي</option>
                                <option value="monthly">شهري</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- أدوات الصيانة -->
                <div class="maintenance-section">
                    <h4>أدوات الصيانة</h4>
                    <div class="maintenance-actions">
                        <button onclick="dataInterface.clearCache()" class="btn btn-warning">
                            <i class="fas fa-trash"></i> مسح الذاكرة المؤقتة
                        </button>
                        <button onclick="dataInterface.resetData()" class="btn btn-danger">
                            <i class="fas fa-redo"></i> إعادة تعيين البيانات
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        this.loadCurrentSettings();
    }

    /**
     * ربط الأحداث
     * Bind events
     */
    bindEvents() {
        // حفظ الإعدادات
        document.getElementById('user-name').addEventListener('change', (e) => {
            this.updateSetting('appInfo.userName', e.target.value);
        });
        
        document.getElementById('currency').addEventListener('change', (e) => {
            this.updateSetting('settings.currency', e.target.value);
        });
        
        document.getElementById('auto-backup').addEventListener('change', (e) => {
            this.updateSetting('settings.autoBackup', e.target.checked);
        });
        
        document.getElementById('backup-frequency').addEventListener('change', (e) => {
            this.updateSetting('settings.backupFrequency', e.target.value);
        });
    }

    /**
     * تبديل عرض/إخفاء اللوحة
     * Toggle panel visibility
     */
    togglePanel() {
        this.isVisible = !this.isVisible;
        const panel = document.getElementById('data-management-panel');
        panel.style.display = this.isVisible ? 'block' : 'none';
        
        if (this.isVisible) {
            this.refreshPanel();
        }
    }

    /**
     * تحديث لوحة البيانات
     * Refresh data panel
     */
    refreshPanel() {
        this.loadUsageStatistics();
        this.loadBackupList();
        this.loadCurrentSettings();
    }

    /**
     * تحميل إحصائيات الاستخدام
     * Load usage statistics
     */
    loadUsageStatistics() {
        const stats = this.dataManager.getUsageStatistics();
        const statsContainer = document.getElementById('usage-stats');
        
        if (!stats) return;
        
        const days = stats.daysUsing || 0;
        const lastActivity = stats.lastActivity ? 
            new Date(stats.lastActivity).toLocaleDateString('ar-SA') : 
            'لم يتم تسجيل أي نشاط';
        
        statsContainer.innerHTML = `
            <div class="stat-card">
                <i class="fas fa-layer-group"></i>
                <div class="stat-number">${stats.totalCategories}</div>
                <div class="stat-label">إجمالي الفئات</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-check-circle"></i>
                <div class="stat-number">${stats.completedCategories}</div>
                <div class="stat-label">فئات مكتملة</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-list"></i>
                <div class="stat-number">${stats.totalActivities}</div>
                <div class="stat-label">إجمالي الأنشطة</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-coins"></i>
                <div class="stat-number">${stats.totalDonation.toLocaleString('ar-SA')}</div>
                <div class="stat-label">إجمالي التبرعات</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-calendar-day"></i>
                <div class="stat-number">${days}</div>
                <div class="stat-label">أيام الاستخدام</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-clock"></i>
                <div class="stat-number">${lastActivity}</div>
                <div class="stat-label">آخر نشاط</div>
            </div>
        `;
    }

    /**
     * تحميل قائمة النسخ الاحتياطية
     * Load backup list
     */
    loadBackupList() {
        const backups = this.dataManager.getBackupHistory();
        const backupContainer = document.getElementById('backup-list');
        
        if (backups.length === 0) {
            backupContainer.innerHTML = '<p class="no-backups">لا توجد نسخ احتياطية</p>';
            return;
        }
        
        backupContainer.innerHTML = backups.map((backup, index) => `
            <div class="backup-item">
                <div class="backup-info">
                    <i class="fas fa-file-archive"></i>
                    <span>نسخة احتياطية ${index + 1}</span>
                    <small>${new Date(backup.timestamp).toLocaleString('ar-SA')}</small>
                </div>
                <button onclick="dataInterface.restoreBackup(${index})" class="btn btn-sm">
                    استعادة
                </button>
            </div>
        `).join('');
    }

    /**
     * تحميل الإعدادات الحالية
     * Load current settings
     */
    loadCurrentSettings() {
        const data = this.dataManager.getCurrentUserData();
        if (!data) return;
        
        document.getElementById('user-name').value = data.appInfo.userName || '';
        document.getElementById('currency').value = data.settings.currency;
        document.getElementById('auto-backup').checked = data.settings.autoBackup;
        document.getElementById('backup-frequency').value = data.settings.backupFrequency;
    }

    /**
     * تحديث إعداد معين
     * Update specific setting
     */
    updateSetting(path, value) {
        const data = this.dataManager.getCurrentUserData();
        if (!data) return;
        
        // تحديث المسار المحدد
        const keys = path.split('.');
        let current = data;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        
        this.dataManager.updateUserData(data);
    }

    /**
     * تصدير البيانات
     * Export data
     */
    async exportData() {
        try {
            await this.dataManager.exportData();
            this.showMessage('تم تصدير البيانات بنجاح!', 'success');
        } catch (error) {
            this.showMessage('خطأ في تصدير البيانات', 'error');
            console.error(error);
        }
    }

    /**
     * استيراد البيانات
     * Import data
     */
    importData() {
        document.getElementById('import-file').click();
    }

    /**
     * معالجة ملف الاستيراد
     * Handle import file
     */
    async handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (confirm('سيتم استبدال جميع البيانات الحالية. هل أنت متأكد؟')) {
            try {
                await this.dataManager.importData(file);
                this.showMessage('تم استيراد البيانات بنجاح!', 'success');
                this.refreshPanel();
                
                // إعادة تحميل الصفحة لتطبيق البيانات الجديدة
                setTimeout(() => location.reload(), 2000);
            } catch (error) {
                this.showMessage('خطأ في استيراد البيانات: ' + error.message, 'error');
            }
        }
        
        // إعادة تعيين عنصر الملف
        event.target.value = '';
    }

    /**
     * استعادة نسخة احتياطية
     * Restore backup
     */
    async restoreBackup(index) {
        if (confirm('سيتم استبدال البيانات الحالية. هل أنت متأكد؟')) {
            try {
                await this.dataManager.restoreFromBackup(index);
                this.showMessage('تم استعادة النسخة الاحتياطية بنجاح!', 'success');
                this.refreshPanel();
                
                // إعادة تحميل الصفحة لتطبيق البيانات الجديدة
                setTimeout(() => location.reload(), 2000);
            } catch (error) {
                this.showMessage('خطأ في استعادة النسخة الاحتياطية', 'error');
            }
        }
    }

    /**
     * مسح الذاكرة المؤقتة
     * Clear cache
     */
    clearCache() {
        if (confirm('سيتم مسح الذاكرة المؤقتة للتطبيق. هل أنت متأكد؟')) {
            // مسح جميع بيانات التطبيق
            const keys = Object.keys(localStorage).filter(key => 
                key.startsWith('zakat') || key.startsWith('zakatBackup')
            );
            
            keys.forEach(key => localStorage.removeItem(key));
            
            this.showMessage('تم مسح الذاكرة المؤقتة بنجاح!', 'success');
            this.refreshPanel();
        }
    }

    /**
     * إعادة تعيين البيانات
     * Reset data
     */
    async resetData() {
        if (confirm('سيتم حذف جميع البيانات وإعادة تعيين التطبيق. هل أنت متأكد؟')) {
            try {
                await this.dataManager.resetData();
                this.showMessage('تم إعادة تعيين البيانات بنجاح!', 'success');
                this.refreshPanel();
                
                // إعادة تحميل الصفحة لتطبيق التغييرات
                setTimeout(() => location.reload(), 2000);
            } catch (error) {
                this.showMessage('خطأ في إعادة تعيين البيانات', 'error');
            }
        }
    }

    /**
     * عرض رسالة
     * Show message
     */
    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `data-message ${type}`;
        message.textContent = text;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// تصدير الكلاس للاستخدام
window.DataInterface = DataInterface;