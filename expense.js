document.addEventListener('DOMContentLoaded', function () {
    let expenses = [];
    let savings = [];

    const form = document.getElementById('financeForm');
    const itemsList = document.getElementById('itemsList');
    const totalExpensesElement = document.getElementById('totalExpenses');
    const totalSavingsElement = document.getElementById('totalSavings');
    const netBalanceElement = document.getElementById('netBalance');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const type = document.getElementById('type').value;
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);

        if (type && description && amount > 0) {
            addEntry(type, description, amount);
            form.reset();
        }
    });

    function addEntry(type, description, amount) {
        const entry = {
            id: Date.now(),
            type,
            description,
            amount,
            date: new Date().toLocaleDateString()
        };

        if (type === 'expense') {
            expenses.push(entry);
        } else {
            savings.push(entry);
        }

        renderItems();
        updateSummary();
    }

    window.deleteEntry = function (id, type) {
        if (confirm('Are you sure you want to delete this entry?')) {
            if (type === 'expense') {
                expenses = expenses.filter(exp => exp.id !== id);
            } else {
                savings = savings.filter(save => save.id !== id);
            }

            renderItems();
            updateSummary();
        }
    };

    function renderItems() {
        const allItems = [...expenses, ...savings].sort((a, b) => b.id - a.id);

        if (allItems.length === 0) {
            itemsList.innerHTML = `
                <div class="empty-state">
                    <h3>No entries yet</h3>
                    <p>Add your first expense or savings entry using the form above</p>
                </div>`;
            return;
        }

        itemsList.innerHTML = allItems.map(item => `
            <div class="item ${item.type}">
                <div class="item-details">
                    <div class="item-description">${item.description}</div>
                    <div class="item-amount">₹${item.amount.toFixed(2)}</div>
                    <div class="item-date">${item.date} • ${capitalize(item.type)}</div>
                </div>
                <button class="delete-btn" onclick="deleteEntry(${item.id}, '${item.type}')">Delete</button>
            </div>
        `).join('');
    }

    function updateSummary() {
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalSavings = savings.reduce((sum, saving) => sum + saving.amount, 0);
        const netBalance = totalSavings - totalExpenses;

        totalExpensesElement.textContent = `₹${totalExpenses.toFixed(2)}`;
        totalSavingsElement.textContent = `₹${totalSavings.toFixed(2)}`;
        netBalanceElement.textContent = `₹${netBalance.toFixed(2)}`;

        netBalanceElement.style.color = netBalance >= 0 ? '#28a745' : '#ff4757';
    }

    function capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    // Tabs switcher
    document.querySelectorAll('.tab').forEach((tab, index) => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            document.querySelectorAll('.tab-content')[index].classList.add('active');
        });
    });

    // Initialize
    renderItems();
    updateSummary();
});
