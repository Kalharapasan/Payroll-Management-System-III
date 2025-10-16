(function() {
    'use strict';
    const modalEl = document.getElementById('modalRow');
    const bsModal = new bootstrap.Modal(modalEl);
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
    }

    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toastId = 'toast-' + Date.now();
        
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
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
                .filter((_, idx) => idx < 8) 
                .map(col => {
                    let text = col.textContent.trim();
                    text = text.replace(/"/g, '""'); 
                    return `"${text}"`;
                });
            csv.push(cols.join(','));
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


    let sortDirection = {};
    
    function sortTable(columnIndex, headerElement) {
        const table = document.querySelector('.table tbody');
        const rows = Array.from(table.querySelectorAll('tr'));
        
  
        const column = headerElement.textContent.trim();
        sortDirection[column] = sortDirection[column] === 'asc' ? 'desc' : 'asc';
        
        rows.sort((a, b) => {
            const aText = a.querySelectorAll('td')[columnIndex]?.textContent.trim() || '';
            const bText = b.querySelectorAll('td')[columnIndex]?.textContent.trim() || '';
            
      
            const aNum = parseFloat(aText.replace(/[£,]/g, ''));
            const bNum = parseFloat(bText.replace(/[£,]/g, ''));
            
            let comparison = 0;
            if (!isNaN(aNum) && !isNaN(bNum)) {
                comparison = aNum - bNum;
            } else {
                comparison = aText.localeCompare(bText);
            }
            
            return sortDirection[column] === 'asc' ? comparison : -comparison;
        });
        
        rows.forEach(row => table.appendChild(row));
        
    
        document.querySelectorAll('.table-dark th').forEach(th => {
            th.classList.remove('sorted-asc', 'sorted-desc');
        });
        headerElement.classList.add(sortDirection[column] === 'asc' ? 'sorted-asc' : 'sorted-desc');
        
        showToast(`Sorted by ${column} (${sortDirection[column]})`, 'info');
    }

    function setupSearchShortcut() {
        const searchInput = document.querySelector('input[name="q"]');
        
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
        
       
        if (searchInput.value) {
            const clearBtn = document.createElement('button');
            clearBtn.className = 'btn btn-sm btn-outline-secondary';
            clearBtn.innerHTML = '×';
            clearBtn.type = 'button';
            clearBtn.onclick = () => {
                searchInput.value = '';
                window.location.href = window.location.pathname;
            };
            searchInput.parentElement.appendChild(clearBtn);
        }
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
        if (exportBtn) {
            exportBtn.addEventListener('click', exportToCSV);
        }

        const printBtn = document.getElementById('btnPrint');
        if (printBtn) {
            printBtn.addEventListener('click', printTable);
        }

      
        frm.addEventListener('submit', (e) => {
            if (!validateForm()) {
                e.preventDefault();
                return false;
            }
        });

       
        document.querySelectorAll('.table-dark th').forEach((th, index) => {
            if (index < 8) { 
                th.style.cursor = 'pointer';
                th.title = 'Click to sort';
                th.addEventListener('click', () => sortTable(index, th));
            }
        });

        
        if (localStorage.getItem('payrollTheme') === 'dark') {
            document.getElementById('btnTheme').textContent = 'Light Mode';
        }
    }


    function showLoading() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay active';
        overlay.id = 'loadingOverlay';
        overlay.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(overlay);
    }

    function hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
    }


    function setupRowHighlight() {
        document.querySelectorAll('.table tbody tr').forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
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
        

        document.querySelectorAll('.stat-card, .card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
    });

    
    window.PayrollApp = {
        showToast,
        exportToCSV,
        printTable,
        openAddModal
    };

})();