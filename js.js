(function(){
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

    function recalc() {
        const inner = parseFloat(document.getElementById('inner_city').value||0);
        const basic = parseFloat(document.getElementById('basic_salary').value||0);
        const overtime = parseFloat(document.getElementById('overtime').value||0);
        const gross = inner + basic + overtime;
        const taxable = gross * 0.09;
        const pension = gross * 0.055;
        const student = gross * 0.025;
        const ni = gross * 0.023;
        const ded = taxable + pension + student + ni;
        const net = gross - ded;
        calcEls.gross.textContent = gross.toFixed(2);
        calcEls.taxable.textContent = taxable.toFixed(2);
        calcEls.pension.textContent = pension.toFixed(2);
        calcEls.student.textContent = student.toFixed(2);
        calcEls.ni.textContent = ni.toFixed(2);
        calcEls.ded.textContent = ded.toFixed(2);
        calcEls.net.textContent = net.toFixed(2);
    }
    ['inner_city','basic_salary','overtime'].forEach(id=>{
        document.getElementById(id).addEventListener('input', recalc);
    });

    document.getElementById('floatingAdd').addEventListener('click', ()=>{
        frm.reset();
        document.getElementById('formAction').value = 'add';
        document.getElementById('formId').value = 0;
        document.getElementById('modalTitle').textContent = 'Add Employee';
        document.getElementById('modalSave').textContent = 'Add Employee';
        recalc();
        bsModal.show();
    });

    document.querySelectorAll('.btnEdit').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            const row = JSON.parse(btn.getAttribute('data-row'));
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
        });
    });

    document.querySelectorAll('.btnView').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            const row = JSON.parse(btn.getAttribute('data-row'));
            frm.reset();
            for (const k in row) {
                const el = document.getElementById(k);
                if (el) el.value = row[k] ?? '';
            }
            Array.from(frm.elements).forEach(i=>i.disabled = true);
            document.getElementById('modalSave').style.display = 'none';
            document.getElementById('modalTitle').textContent = 'View Employee #' + row.id;
            recalc();
            bsModal.show();
            modalEl.addEventListener('hidden.bs.modal', function _reen(){
                Array.from(frm.elements).forEach(i=>i.disabled = false);
                document.getElementById('modalSave').style.display = '';
                modalEl.removeEventListener('hidden.bs.modal', _reen);
            });
        });
    });


    document.getElementById('btnTheme').addEventListener('click', ()=>{
        document.body.classList.toggle('dark-mode');
    });

})();