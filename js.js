(function() {
    'use strict';
    const modalEl = document.getElementById('modalRow');
    const analyticsModalEl = document.getElementById('modalAnalytics');
    const bsModal = new bootstrap.Modal(modalEl);
    const bsAnalyticsModal = new bootstrap.Modal(analyticsModalEl);
    const frm = document.getElementById('frmRow');
    const calcEls = {
        gross: document.getElementById('calc_gross'),
        taxable: document.getElementById('calc_taxable'),
        pension: document.getElementById('calc_pension'),
        student: document.getElementById('calc_student'),
        ni: document.getElementById('calc_ni'),
        ded: document.getElementById('calc_ded'),
        net: document.getElementById('calc_net')
    };

    let charts = {
        monthly: null,
        gender: null,
        department: null
    };

    function initTheme() {
        const savedTheme = localStorage.getItem('payrollTheme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('payrollTheme', isDark ? 'dark' : 'light');
        showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled', 'info');
        
        // Update charts if they exist
        if (charts.monthly) updateChartTheme();
    }

    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toastId = 'toast-' + Date.now();
        
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();
        
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    function recalc() {
        const inner = parseFloat(document.getElementById('inner_city').value || 0);
        const basic = parseFloat(document.getElementById('basic_salary').value || 0);
        const overtime = parseFloat(document.getElementById('overtime').value || 0);
        
        const gross = inner + basic + overtime;
        const taxable = gross * 0.09;
        const pension = gross * 0.055;
        const student = gross * 0.025;
        const ni = gross * 0.023;
        const ded = taxable + pension + student + ni;
        const net = gross - ded;
        
        calcEls.gross.textContent = '£' + gross.toFixed(2);
        calcEls.taxable.textContent = '£' + taxable.toFixed(2);
        calcEls.pension.textContent = '£' + pension.toFixed(2);
        calcEls.student.textContent = '£' + student.toFixed(2);
        calcEls.ni.textContent = '£' + ni.toFixed(2);
        calcEls.ded.textContent = '£' + ded.toFixed(2);
        calcEls.net.textContent = '£' + net.toFixed(2);
    }

    function validateForm() {
        const employeeName = document.getElementById('employee_name').value.trim();
        
        if (!employeeName) {
            showToast('Employee name is required', 'danger');
            document.getElementById('employee_name').focus();
            return false;
        }
        
        if (employeeName.length < 2) {
            showToast('Employee name must be at least 2 characters', 'warning');
            return false;
        }
        
        return true;
    }

    function openAddModal() {
        frm.reset();
        document.getElementById('formAction').value = 'add';
        document.getElementById('formId').value = 0;
        document.getElementById('modalTitle').textContent = 'Add New Employee';
        document.getElementById('modalSave').textContent = 'Add Employee';
 
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('pay_date').value = today;
        
        recalc();
        bsModal.show();
 
        setTimeout(() => {
            document.getElementById('employee_name').focus();
        }, 300);
    }

    function openEditModal(row) {
        document.getElementById('formAction').value = 'update';
        document.getElementById('formId').value = row.id;
        
        for (const k in row) {
            const el = document.getElementById(k);
            if (el) el.value = row[k] ?? '';
        }
        
        document.getElementById('modalTitle').textContent = 'Edit Employee #' + row.id;
        document.getElementById('modalSave').textContent = 'Update Employee';
        recalc();
        bsModal.show();
    }

    function openViewModal(row) {
        frm.reset();
        
        for (const k in row) {
            const el = document.getElementById(k);
            if (el) el.value = row[k] ?? '';
        }
        
        Array.from(frm.elements).forEach(i => i.disabled = true);
        document.getElementById('modalSave').style.display = 'none';
        document.getElementById('modalTitle').textContent = 'View Employee #' + row.id;
        recalc();
        bsModal.show();
        
        modalEl.addEventListener('hidden.bs.modal', function _reen() {
            Array.from(frm.elements).forEach(i => i.disabled = false);
            document.getElementById('modalSave').style.display = '';
            modalEl.removeEventListener('hidden.bs.modal', _reen);
        });
    }

    function exportToCSV() {
        const table = document.querySelector('.table');
        const rows = Array.from(table.querySelectorAll('tr'));
        
        let csv = [];
        rows.forEach(row => {
            const cols = Array.from(row.querySelectorAll('th, td'))
                .filter((_, idx) => idx > 0 && idx < 9)
                .map(col => {
                    let text = col.textContent.trim();
                    text = text.replace(/"/g, '""');
                    return `"${text}"`;
                });
            if (cols.length > 0) csv.push(cols.join(','));
        });
        
        const csvContent = csv.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `payroll_export_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Data exported to CSV successfully!', 'success');
    }

    function printTable() {
        window.print();
        showToast('Print dialog opened', 'info');
    }

    // Bulk selection functionality
    function updateBulkButton() {
        const selected = document.querySelectorAll('.row-select:checked');
        const bulkBtn = document.getElementById('btnBulkActions');
        
        if (selected.length > 0) {
            bulkBtn.style.display = 'inline-block';
            bulkBtn.textContent = `Delete Selected (${selected.length})`;
        } else {
            bulkBtn.style.display = 'none';
        }
    }

    function handleBulkDelete() {
        const selected = Array.from(document.querySelectorAll('.row-select:checked')).map(cb => cb.value);
        
        if (selected.length === 0) return;
        
        if (!confirm(`⚠️ Delete ${selected.length} employee(s)?\n\nThis action cannot be undone.`)) {
            return;
        }
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.innerHTML = '<input type="hidden" name="action" value="bulk_delete">';
        
        selected.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'ids[]';
            input.value = id;
            form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
    }

    // Advanced filtering
    function applyFilters() {
        const search = document.getElementById('searchInput').value;
        const gender = document.getElementById('filterGender').value;
        const employer = document.getElementById('filterEmployer').value;
        const perPage = document.getElementById('perPage').value;
        
        const params = new URLSearchParams();
        if (search) params.set('q', search);
        if (gender) params.set('gender', gender);
        if (employer) params.set('employer', employer);
        if (perPage) params.set('per_page', perPage);
        
        window.location.href = '?' + params.toString();
    }

    // Sortable columns
    function setupSorting() {
        document.querySelectorAll('.sortable').forEach(th => {
            th.style.cursor = 'pointer';
            th.addEventListener('click', () => {
                const sort = th.dataset.sort;
                const currentUrl = new URL(window.location.href);
                const currentSort = currentUrl.searchParams.get('sort');
                const currentDir = currentUrl.searchParams.get('dir');
                
                let newDir = 'ASC';
                if (currentSort === sort && currentDir === 'ASC') {
                    newDir = 'DESC';
                }
                
                currentUrl.searchParams.set('sort', sort);
                currentUrl.searchParams.set('dir', newDir);
                window.location.href = currentUrl.toString();
            });
        });
    }

    // Analytics functionality
    async function loadAnalytics() {
        try {
            const response = await fetch('?ajax=analytics');
            const data = await response.json();
            
            createMonthlyChart(data.monthly);
            createGenderChart(data.gender);
            createDepartmentChart(data.departments);
            
            bsAnalyticsModal.show();
        } catch (error) {
            showToast('Failed to load analytics', 'danger');
            console.error(error);
        }
    }

    function getChartColors() {
        const isDark = document.body.classList.contains('dark-mode');
        return {
            primary: '#667eea',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#06b6d4',
            text: isDark ? '#e2e8f0' : '#0f172a',
            grid: isDark ? '#334155' : '#e2e8f0'
        };
    }

    function createMonthlyChart(data) {
        const ctx = document.getElementById('monthlyChart');
        const colors = getChartColors();
        
        if (charts.monthly) charts.monthly.destroy();
        
        charts.monthly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.month).reverse(),
                datasets: [
                    {
                        label: 'Gross Pay',
                        data: data.map(d => parseFloat(d.total_gross)).reverse(),
                        borderColor: colors.success,
                        backgroundColor: colors.success + '20',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Net Pay',
                        data: data.map(d => parseFloat(d.total_net)).reverse(),
                        borderColor: colors.primary,
                        backgroundColor: colors.primary + '20',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Deductions',
                        data: data.map(d => parseFloat(d.total_deductions)).reverse(),
                        borderColor: colors.warning,
                        backgroundColor: colors.warning + '20',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: colors.text }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            color: colors.text,
                            callback: value => '£' + value.toLocaleString()
                        },
                        grid: { color: colors.grid }
                    },
                    x: {
                        ticks: { color: colors.text },
                        grid: { color: colors.grid }
                    }
                }
            }
        });
    }

    function createGenderChart(data) {
        const ctx = document.getElementById('genderChart');
        const colors = getChartColors();
        
        if (charts.gender) charts.gender.destroy();
        
        const labels = data.map(d => d.gender === 'm' ? 'Male' : d.gender === 'f' ? 'Female' : 'Not Specified');
        
        charts.gender = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data.map(d => parseInt(d.count)),
                    backgroundColor: [colors.primary, colors.danger, colors.warning],
                    borderWidth: 2,
                    borderColor: document.body.classList.contains('dark-mode') ? '#1e293b' : '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: colors.text }
                    }
                }
            }
        });
    }

    function createDepartmentChart(data) {
        const ctx = document.getElementById('departmentChart');
        const colors = getChartColors();
        
        if (charts.department) charts.department.destroy();
        
        charts.department = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.employer || 'Not Specified'),
                datasets: [{
                    label: 'Total Payroll',
                    data: data.map(d => parseFloat(d.total)),
                    backgroundColor: colors.primary + '80',
                    borderColor: colors.primary,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: colors.text }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            color: colors.text,
                            callback: value => '£' + value.toLocaleString()
                        },
                        grid: { color: colors.grid }
                    },
                    x: {
                        ticks: { 
                            color: colors.text,
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: { color: colors.grid }
                    }
                }
            }
        });
    }

    function updateChartTheme() {
        if (charts.monthly) {
            const colors = getChartColors();
            
            [charts.monthly, charts.gender, charts.department].forEach(chart => {
                if (chart) {
                    chart.options.plugins.legend.labels.color = colors.text;
                    if (chart.options.scales) {
                        if (chart.options.scales.x) {
                            chart.options.scales.x.ticks.color = colors.text;
                            chart.options.scales.x.grid.color = colors.grid;
                        }
                        if (chart.options.scales.y) {
                            chart.options.scales.y.ticks.color = colors.text;
                            chart.options.scales.y.grid.color = colors.grid;
                        }
                    }
                    chart.update();
                }
            });
        }
    }

    function setupSearchShortcut() {
        const searchInput = document.getElementById('searchInput');
        
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                openAddModal();
            }
        });
    }

    function initEventListeners() {
        ['inner_city', 'basic_salary', 'overtime'].forEach(id => {
            document.getElementById(id).addEventListener('input', recalc);
        });

        document.getElementById('floatingAdd').addEventListener('click', openAddModal);

        document.querySelectorAll('.btnEdit').forEach(btn => {
            btn.addEventListener('click', () => {
                const row = JSON.parse(btn.getAttribute('data-row'));
                openEditModal(row);
            });
        });

        document.querySelectorAll('.btnView').forEach(btn => {
            btn.addEventListener('click', () => {
                const row = JSON.parse(btn.getAttribute('data-row'));
                openViewModal(row);
            });
        });

        document.getElementById('btnTheme').addEventListener('click', toggleTheme);
        
        const exportBtn = document.getElementById('btnExportCSV');
        if (exportBtn) exportBtn.addEventListener('click', exportToCSV);

        const printBtn = document.getElementById('btnPrint');
        if (printBtn) printBtn.addEventListener('click', printTable);

        const analyticsBtn = document.getElementById('btnAnalytics');
        if (analyticsBtn) analyticsBtn.addEventListener('click', loadAnalytics);

        frm.addEventListener('submit', (e) => {
            if (!validateForm()) {
                e.preventDefault();
                return false;
            }
        });

        // Bulk selection
        document.getElementById('selectAll').addEventListener('change', (e) => {
            document.querySelectorAll('.row-select').forEach(cb => {
                cb.checked = e.target.checked;
            });
            updateBulkButton();
        });

        document.querySelectorAll('.row-select').forEach(cb => {
            cb.addEventListener('change', updateBulkButton);
        });

        const bulkBtn = document.getElementById('btnBulkActions');
        if (bulkBtn) {
            bulkBtn.addEventListener('click', handleBulkDelete);
        }

        // Filter button
        document.getElementById('btnApplyFilters').addEventListener('click', applyFilters);

        // Enter key on search
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFilters();
            }
        });
    }

    function setupRowHighlight() {
        document.querySelectorAll('.table tbody tr').forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.01)';
            });
            row.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initEventListeners();
        setupSearchShortcut();
        setupRowHighlight();
        setupSorting();

        document.querySelectorAll('.stat-card, .card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
    });

    window.PayrollApp = {
        showToast,
        exportToCSV,
        printTable,
        openAddModal,
        loadAnalytics
    };

})();