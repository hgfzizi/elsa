document.addEventListener('DOMContentLoaded', function() {
    initClearButtons();
    initInputValidation();
    initSearchButton();
    initExportButton();
    initSelectAll();
    initPagination();
    initTopNav();
});

function initClearButtons() {
    const clearButtons = document.querySelectorAll('.clear-btn');
    
    clearButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.dataset.target;
            const targetInput = document.getElementById(targetId);
            
            if (targetInput) {
                targetInput.value = '';
                targetInput.classList.remove('error');
                
                const event = new Event('input', { bubbles: true });
                targetInput.dispatchEvent(event);
                
                hideClearButton(this);
            }
        });
    });
    
    const inputs = document.querySelectorAll('.search-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const clearBtn = this.nextElementSibling;
            if (clearBtn && clearBtn.classList.contains('clear-btn')) {
                if (this.value) {
                    clearBtn.style.opacity = '1';
                    clearBtn.style.visibility = 'visible';
                } else {
                    hideClearButton(clearBtn);
                }
            }
        });
        
        input.addEventListener('focus', function() {
            const clearBtn = this.nextElementSibling;
            if (clearBtn && clearBtn.classList.contains('clear-btn') && this.value) {
                clearBtn.style.opacity = '1';
                clearBtn.style.visibility = 'visible';
            }
        });
        
        input.addEventListener('blur', function() {
            setTimeout(() => {
                const clearBtn = this.nextElementSibling;
                if (clearBtn && clearBtn.classList.contains('clear-btn') && !document.activeElement.classList.contains('clear-btn')) {
                    if (!this.value) {
                        hideClearButton(clearBtn);
                    }
                }
            }, 200);
        });
    });
}

function hideClearButton(button) {
    button.style.opacity = '0';
    button.style.visibility = 'hidden';
}

function initInputValidation() {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    
    numberInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateNumberInput(this);
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('error');
        });
    });
    
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateDateInput(this);
        });
    });
    
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateTextInput(this);
        });
    });
}

function validateNumberInput(input) {
    if (input.value === '') return;
    
    const value = parseFloat(input.value);
    
    if (isNaN(value)) {
        input.classList.add('error');
        showToast('请输入有效的数字');
        return;
    }
    
    if (input.min !== '' && value < parseFloat(input.min)) {
        input.classList.add('error');
        showToast(`数值不能小于 ${input.min}`);
        return;
    }
    
    input.classList.remove('error');
}

function validateDateInput(input) {
    if (input.value === '') return;
    
    const dateFrom = document.getElementById('createDateFrom');
    const dateTo = document.getElementById('createDateTo');
    
    if (dateFrom && dateTo && dateFrom.value && dateTo.value) {
        if (dateFrom.value > dateTo.value) {
            dateFrom.classList.add('error');
            dateTo.classList.add('error');
            showToast('开始日期不能晚于结束日期');
            return;
        }
    }
    
    input.classList.remove('error');
}

function validateTextInput(input) {
    if (input.value === '') return;
    
    input.classList.remove('error');
}

function initSearchButton() {
    const searchBtn = document.getElementById('searchBtn');
    
    searchBtn.addEventListener('click', function() {
        const inputs = document.querySelectorAll('.search-input');
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.classList.contains('error')) {
                isValid = false;
            }
        });
        
        const weightFrom = document.getElementById('weightFrom');
        const weightTo = document.getElementById('weightTo');
        
        if (weightFrom.value && weightTo.value) {
            if (parseFloat(weightFrom.value) > parseFloat(weightTo.value)) {
                weightFrom.classList.add('error');
                weightTo.classList.add('error');
                isValid = false;
                showToast('最小重量不能大于最大重量');
            }
        }
        
        const costFrom = document.getElementById('costFrom');
        const costTo = document.getElementById('costTo');
        
        if (costFrom.value && costTo.value) {
            if (parseFloat(costFrom.value) > parseFloat(costTo.value)) {
                costFrom.classList.add('error');
                costTo.classList.add('error');
                isValid = false;
                showToast('最小费用不能大于最大费用');
            }
        }
        
        if (isValid) {
            showToast('查询成功');
        }
    });
}

function initExportButton() {
    const exportBtn = document.getElementById('exportBtn');
    
    exportBtn.addEventListener('click', function() {
        showToast('正在导出数据...');
        
        setTimeout(() => {
            showToast('导出成功');
        }, 1500);
    });
}

function initSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.data-table tbody input[type="checkbox"]');
    
    selectAllCheckbox.addEventListener('change', function(e) {
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            selectAllCheckbox.checked = allChecked;
        });
    });
}

function initPagination() {
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (btn.disabled) return;
            
            paginationBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const pageText = this.textContent.trim();
            if (pageText !== 'First' && pageText !== 'Last' && pageText !== '< Previous' && pageText !== 'Next >') {
                showToast(`跳转到第 ${pageText} 页`);
            }
        });
    });
}

function initTopNav() {
    const navItems = document.querySelectorAll('.top-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showToast(message) {
    let toast = document.getElementById('toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}