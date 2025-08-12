// =========================================================
// Helper Functions for Data Management
// Using localStorage as a mock database
// Replace with fetch() calls to your MongoDB API when ready
// =========================================================



// Global data arrays (mocking your database collections)
let products = getLocalStorageData('products');
let categories = getLocalStorageData('categories');
let orders = getLocalStorageData('orders');
let customers = getLocalStorageData('customers');
let appointments = getLocalStorageData('appointments');
let discounts = getLocalStorageData('discounts');
let messages = getLocalStorageData('messages');

// =========================================================
// Core Dashboard Functions
// =========================================================

// Toggles the navigation menu for mobile views
function togglelink() {
    const nav = document.querySelector('.admin-nav');
    const toggleBtn = document.getElementById('toggle-Link');

    nav.classList.toggle('is-open');
    toggleBtn.classList.toggle('active');

    const icon = toggleBtn.querySelector('i');
    if (toggleBtn.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Logs the user out and clears the session
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userLoggedIn');
        window.location.href = '../index.html';
    }
}



// Updates the stats in the dashboard overview section
function updateDashboardStats() {
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalCustomers').textContent = customers.length;
    document.getElementById('totalOrders').textContent = orders.length;

    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total.replace('$', '')), 0);
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;

    const pendingAppointments = appointments.filter(app => app.status === 'scheduled').length;
    document.getElementById('pendingAppointments').textContent = pendingAppointments;

    const newMessages = messages.filter(msg => msg.status === 'pending').length;
    document.getElementById('newMessages').textContent = newMessages;
}

// =========================================================
// Product Management
// =========================================================

function renderProducts() {
    const tableBody = document.querySelector('#productsTable tbody');
    tableBody.innerHTML = '';
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="ID">${product.id}</td>
            <td data-label="Product"><img src="${product.image}" alt="${product.name}"> ${product.name}</td>
            <td data-label="Category">${product.category}</td>
            <td data-label="Price">$${product.price}</td>
            <td data-label="Stock">${product.stock}</td>
            <td data-label="Status"><span class="status-badge ${product.status}">${product.status}</span></td>
            <td data-label="Actions" class="action-buttons">
                <button class="btn btn-secondary edit-product-btn" data-id="${product.id}">Edit</button>
                <button class="btn btn-primary delete-product-btn" data-id="${product.id}">Delete</button>
                <button class="btn btn-secondary toggle-status-btn" data-id="${product.id}">${product.status === 'active' ? 'Deactivate' : 'Activate'}</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function showAddProductForm(product = {}) {
    const form = document.getElementById('addProductForm');
    const table = document.getElementById('productsTable');
    if (!form || !table) return;
    document.getElementById('newProductId').value = product.id || '';
    document.getElementById('newProductName').value = product.name || '';
    document.getElementById('newProductCategory').value = product.category || '';
    document.getElementById('newProductPrice').value = product.price || '';
    document.getElementById('newProductStock').value = product.stock || '';
    form.style.display = 'block';
    table.style.display = 'none';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideAddProductForm() {
    const form = document.getElementById('addProductForm');
    const table = document.getElementById('productsTable');
    if (!form || !table) return;
    form.style.display = 'none';
    table.style.display = 'table';
    form.reset();
}

function saveProduct() {
    const id = document.getElementById('newProductId').value.trim();
    const name = document.getElementById('newProductName').value.trim();
    const category = document.getElementById('newProductCategory').value.trim();
    const price = parseFloat(document.getElementById('newProductPrice').value).toFixed(2);
    const stock = document.getElementById('newProductStock').value.trim();
    const imageFile = document.getElementById('newProductImage').files[0];
    const image = imageFile ? URL.createObjectURL(imageFile) : "https://via.placeholder.com/50";
    if (!id || !name || !category || isNaN(price) || !stock) {
        alert('Please fill in all product fields.');
        return;
    }
    const newProduct = { id, name, category, price, stock, image, status: 'active' };
    const existingIndex = products.findIndex(p => p.id === id);
    if (existingIndex > -1) {
        products[existingIndex] = { ...products[existingIndex], ...newProduct };
        alert('Product updated successfully!');
    } else {
        products.push(newProduct);
        alert('Product added successfully!');
    }
    saveToLocalStorage('products', products);
    renderProducts();
    hideAddProductForm();
    updateDashboardStats();
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        saveToLocalStorage('products', products);
        renderProducts();
        updateDashboardStats();
        alert('Product deleted!');
    }
}

function toggleProductStatus(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.status = product.status === 'active' ? 'inactive' : 'active';
        saveToLocalStorage('products', products);
        renderProducts();
        alert('Product status toggled!');
    }
}

// =========================================================
// Category Management
// =========================================================

function renderCategories() {
    const tableBody = document.querySelector('#categoriesTable tbody');
    tableBody.innerHTML = '';
    categories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="ID">${category.id}</td>
            <td data-label="Category Name">${category.name}</td>
            <td data-label="Type">${category.type}</td>
            <td data-label="Actions" class="action-buttons">
                <button class="btn btn-secondary edit-category-btn" data-id="${category.id}">Edit</button>
                <button class="btn btn-primary delete-category-btn" data-id="${category.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function showAddCategoryForm(category = {}) {
    const form = document.getElementById('addCategoryForm');
    const table = document.getElementById('categoriesTable');
    if (!form || !table) return;
    document.getElementById('newCategoryIdHidden').value = category.id || '';
    document.getElementById('newCategoryName').value = category.name || '';
    document.getElementById('newCategoryType').value = category.type || 'Product';
    form.style.display = 'block';
    table.style.display = 'none';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideAddCategoryForm() {
    const form = document.getElementById('addCategoryForm');
    const table = document.getElementById('categoriesTable');
    if (!form || !table) return;
    form.style.display = 'none';
    table.style.display = 'table';
    form.reset();
}

function saveCategory() {
    const id = document.getElementById('newCategoryIdHidden').value || `#CAT${(categories.length + 1).toString().padStart(3, '0')}`;
    const name = document.getElementById('newCategoryName').value.trim();
    const type = document.getElementById('newCategoryType').value;
    if (!name) {
        alert('Please enter a category name.');
        return;
    }
    const newCategory = { id, name, type };
    const existingIndex = categories.findIndex(c => c.id === id);
    if (existingIndex > -1) {
        categories[existingIndex] = newCategory;
        alert('Category updated successfully!');
    } else {
        categories.push(newCategory);
        alert('Category added successfully!');
    }
    saveToLocalStorage('categories', categories);
    renderCategories();
    hideAddCategoryForm();
}

function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        categories = categories.filter(c => c.id !== id);
        saveToLocalStorage('categories', categories);
        renderCategories();
        alert('Category deleted!');
    }
}

// =========================================================
// Order Management
// =========================================================

function renderOrders() {
    const tableBody = document.querySelector('#ordersTable tbody');
    tableBody.innerHTML = '';
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="ID">${order.id}</td>
            <td data-label="Customer">${order.customer}</td>
            <td data-label="Date">${order.date}</td>
            <td data-label="Total">${order.total}</td>
            <td data-label="Status"><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
            <td data-label="Actions" class="action-buttons">
                <button class="btn btn-secondary edit-order-btn" data-id="${order.id}">Edit</button>
                <button class="btn btn-primary delete-order-btn" data-id="${order.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function showEditOrderForm(order = {}) {
    const form = document.getElementById('editOrderForm');
    const table = document.getElementById('ordersTable');
    if (!form || !table) return;
    document.getElementById('editOrderIdHidden').value = order.id || '';
    document.getElementById('editOrderCustomer').value = order.customer || '';
    document.getElementById('editOrderDate').value = order.date || '';
    document.getElementById('editOrderTotal').value = parseFloat(order.total.replace('$', '')) || '';
    document.getElementById('editOrderStatus').value = order.status || '';
    form.style.display = 'block';
    table.style.display = 'none';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideEditOrderForm() {
    const form = document.getElementById('editOrderForm');
    const table = document.getElementById('ordersTable');
    if (!form || !table) return;
    form.style.display = 'none';
    table.style.display = 'table';
    form.reset();
}

function saveOrderChanges() {
    const id = document.getElementById('editOrderIdHidden').value;
    const customer = document.getElementById('editOrderCustomer').value.trim();
    const date = document.getElementById('editOrderDate').value;
    const total = parseFloat(document.getElementById('editOrderTotal').value).toFixed(2);
    const status = document.getElementById('editOrderStatus').value;
    if (!customer || !date || isNaN(total) || !status) {
        alert('Please fill in all order fields.');
        return;
    }
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex > -1) {
        orders[orderIndex] = { ...orders[orderIndex], customer, date, total: `$${total}`, status };
        saveToLocalStorage('orders', orders);
        renderOrders();
        hideEditOrderForm();
        updateDashboardStats();
        alert('Order updated successfully!');
    }
}

function deleteOrder(id) {
    if (confirm('Are you sure you want to delete this order?')) {
        orders = orders.filter(o => o.id !== id);
        saveToLocalStorage('orders', orders);
        renderOrders();
        updateDashboardStats();
        alert('Order deleted!');
    }
}

// =========================================================
// Customer Management
// =========================================================

function renderCustomers() {
    const tableBody = document.querySelector('#customersTable tbody');
    tableBody.innerHTML = '';
    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="ID">${customer.id}</td>
            <td data-label="Name">${customer.name}</td>
            <td data-label="Email">${customer.email}</td>
            <td data-label="Status"><span class="status-badge ${customer.status.toLowerCase()}">${customer.status}</span></td>
            <td data-label="Actions" class="action-buttons">
                <button class="btn btn-secondary view-orders-btn" data-id="${customer.id}">View Orders</button>
                <button class="btn btn-primary toggle-customer-status-btn" data-id="${customer.id}">${customer.status === 'Active' ? 'Disable' : 'Enable'}</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function toggleCustomerStatus(id) {
    const customer = customers.find(c => c.id === id);
    if (customer) {
        customer.status = customer.status === 'Active' ? 'Disabled' : 'Active';
        saveToLocalStorage('customers', customers);
        renderCustomers();
        alert('Customer status toggled!');
    }
}

// =========================================================
// Appointment Management
// =========================================================

function renderAppointments() {
    const tableBody = document.querySelector('#appointmentsTable tbody');
    tableBody.innerHTML = '';
    appointments.forEach(app => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="ID">${app.id}</td>
            <td data-label="Customer">${app.customer}</td>
            <td data-label="Service">${app.service}</td>
            <td data-label="Beautician">${app.beautician || 'N/A'}</td>
            <td data-label="Date">${app.date}</td>
            <td data-label="Time">${app.time}</td>
            <td data-label="Status"><span class="status-badge ${app.status.toLowerCase()}">${app.status}</span></td>
            <td data-label="Actions" class="action-buttons">
                <button class="btn btn-secondary edit-appointment-btn" data-id="${app.id}">Edit</button>
                <button class="btn btn-primary accept-appointment-btn" data-id="${app.id}" style="display: ${app.status === 'scheduled' ? 'inline-block' : 'none'}">Accept</button>
                <button class="btn btn-primary reject-appointment-btn" data-id="${app.id}" style="display: ${app.status === 'scheduled' ? 'inline-block' : 'none'}">Reject</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function showAddAppointmentForm(appointment = {}) {
    const form = document.getElementById('addAppointmentForm');
    const table = document.getElementById('appointmentsTable');
    if (!form || !table) return;
    document.getElementById('appointmentIdHidden').value = appointment.id || '';
    document.getElementById('appointmentCustomerName').value = appointment.customer || '';
    document.getElementById('appointmentService').value = appointment.service || '';
    document.getElementById('appointmentBeautician').value = appointment.beautician || '';
    document.getElementById('appointmentDate').value = appointment.date || '';
    document.getElementById('appointmentTime').value = appointment.time || '';
    form.style.display = 'block';
    table.style.display = 'none';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideAddAppointmentForm() {
    const form = document.getElementById('addAppointmentForm');
    const table = document.getElementById('appointmentsTable');
    if (!form || !table) return;
    form.style.display = 'none';
    table.style.display = 'table';
    form.reset();
}

function saveAppointment() {
    const id = document.getElementById('appointmentIdHidden').value || `#APP${(appointments.length + 1).toString().padStart(3, '0')}`;
    const customerName = document.getElementById('appointmentCustomerName').value.trim();
    const service = document.getElementById('appointmentService').value.trim();
    const beautician = document.getElementById('appointmentBeautician').value.trim();
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    if (!customerName || !service || !date || !time) {
        alert('Please fill in all appointment fields.');
        return;
    }
    const newAppointment = { id, customer: customerName, service, beautician, date, time, status: 'scheduled' };
    const existingIndex = appointments.findIndex(app => app.id === id);
    if (existingIndex > -1) {
        appointments[existingIndex] = newAppointment;
        alert('Appointment updated successfully!');
    } else {
        appointments.push(newAppointment);
        alert('Appointment saved successfully!');
    }
    saveToLocalStorage('appointments', appointments);
    renderAppointments();
    hideAddAppointmentForm();
    updateDashboardStats();
}

function acceptAppointment(id) {
    const appointment = appointments.find(app => app.id === id);
    if (appointment) {
        appointment.status = 'accepted';
        saveToLocalStorage('appointments', appointments);
        renderAppointments();
        updateDashboardStats();
        alert('Appointment accepted!');
    }
}

function rejectAppointment(id) {
    const appointment = appointments.find(app => app.id === id);
    if (appointment) {
        appointment.status = 'rejected';
        saveToLocalStorage('appointments', appointments);
        renderAppointments();
        updateDashboardStats();
        alert('Appointment rejected!');
    }
}

function deleteAppointment(id) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        appointments = appointments.filter(app => app.id !== id);
        saveToLocalStorage('appointments', appointments);
        renderAppointments();
        updateDashboardStats();
        alert('Appointment deleted!');
    }
}

// =========================================================
// Discount Management
// =========================================================

function renderDiscounts() {
    const tableBody = document.querySelector('#discountsTable tbody');
    tableBody.innerHTML = '';
    discounts.forEach(discount => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Code">${discount.code}</td>
            <td data-label="Product ID">${discount.productId || 'N/A'}</td>
            <td data-label="Image"><img src="${discount.image}" alt="Product Image"></td>
            <td data-label="Type">${discount.type}</td>
            <td data-label="Value">${discount.value}</td>
            <td data-label="Min. Purchase">${discount.minPurchase}</td>
            <td data-label="Expiry Date">${discount.expiry}</td>
            <td data-label="Actions" class="action-buttons">
                <button class="btn btn-secondary edit-discount-btn" data-id="${discount.code}">Edit</button>
                <button class="btn btn-primary delete-discount-btn" data-id="${discount.code}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function showAddDiscountForm(discount = {}) {
    const form = document.getElementById('discountForm');
    const table = document.getElementById('discountsTable');
    if (!form || !table) return;
    document.getElementById('discountIdHidden').value = discount.code || '';
    document.getElementById('discountCode').value = discount.code || '';
    document.getElementById('discountProductId').value = discount.productId || '';
    document.getElementById('discountType').value = discount.type || 'Percentage';
    document.getElementById('discountValue').value = discount.value || '';
    document.getElementById('discountMinPurchase').value = discount.minPurchase ? parseFloat(discount.minPurchase.replace('$', '')) : '';
    document.getElementById('discountExpiry').value = discount.expiry || '';
    form.style.display = 'block';
    table.style.display = 'none';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideDiscountForm() {
    const form = document.getElementById('discountForm');
    const table = document.getElementById('discountsTable');
    if (!form || !table) return;
    form.style.display = 'none';
    table.style.display = 'table';
    form.reset();
}

function saveDiscount() {
    const code = document.getElementById('discountCode').value.trim();
    const productId = document.getElementById('discountProductId').value.trim();
    const imageFile = document.getElementById('discountImage').files[0];
    const image = imageFile ? URL.createObjectURL(imageFile) : "https://via.placeholder.com/50";
    const type = document.getElementById('discountType').value;
    const value = document.getElementById('discountValue').value.trim();
    const minPurchase = `$${parseFloat(document.getElementById('discountMinPurchase').value).toFixed(2)}`;
    const expiry = document.getElementById('discountExpiry').value;
    if (!code || !type || !value || isNaN(parseFloat(minPurchase.replace('$', ''))) || !expiry) {
        alert('Please fill in all discount fields.');
        return;
    }
    const newDiscount = { code, productId: productId || 'N/A', image, type, value, minPurchase, expiry };
    const existingIndex = discounts.findIndex(d => d.code === code);
    if (existingIndex > -1) {
        discounts[existingIndex] = newDiscount;
        alert(`Discount ${code} updated successfully!`);
    } else {
        discounts.push(newDiscount);
        alert(`New discount ${code} added successfully!`);
    }
    saveToLocalStorage('discounts', discounts);
    renderDiscounts();
    hideDiscountForm();
}

function deleteDiscount(code) {
    if (confirm('Are you sure you want to delete this discount?')) {
        discounts = discounts.filter(d => d.code !== code);
        saveToLocalStorage('discounts', discounts);
        renderDiscounts();
        alert('Discount deleted!');
    }
}

// =========================================================
// Message Management
// =========================================================

function renderMessages() {
    const tableBody = document.querySelector('#messagesTable tbody');
    tableBody.innerHTML = '';
    messages.forEach(msg => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Sender">${msg.sender}</td>
            <td data-label="Email">${msg.email}</td>
            <td data-label="Message">${msg.message}</td>
            <td data-label="Status"><span class="status-badge ${msg.status}">${msg.status}</span></td>
            <td data-label="Actions" class="action-buttons">
                <button class="btn btn-secondary view-msg-btn" data-id="${msg.id}">View</button>
                <button class="btn btn-primary mark-replied-btn" data-id="${msg.id}">Mark Replied</button>
                <button class="btn btn-danger delete-msg-btn" data-id="${msg.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function viewMessage(id) {
    const message = messages.find(msg => msg.id === id);
    if (message) {
        alert(`Message from: ${message.sender} (${message.email})\n\nMessage: ${message.message}`);
    }
}

function markMessageReplied(id) {
    const message = messages.find(msg => msg.id === id);
    if (message) {
        message.status = 'replied';
        saveToLocalStorage('messages', messages);
        renderMessages();
        updateDashboardStats();
        alert('Message marked as replied!');
    }
}

function deleteMessage(id) {
    if (confirm('Are you sure you want to delete this message?')) {
        messages = messages.filter(msg => msg.id !== id);
        saveToLocalStorage('messages', messages);
        renderMessages();
        updateDashboardStats();
        alert('Message deleted!');
    }
}

// =========================================================
// Admin Settings
// =========================================================

function changeAdminPassword() {
    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmNewPass = document.getElementById('confirmNewPassword').value;
    if (currentPass !== 'password') { // Mock current password
        alert('Incorrect current password.');
        return;
    }
    if (newPass.length < 6) {
        alert('New password must be at least 6 characters long.');
        return;
    }
    if (newPass !== confirmNewPass) {
        alert('New password and confirmation do not match.');
        return;
    }
    alert('Password changed successfully! (Mock action)');
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
}

function saveWebsiteContent() {
    const websiteLogoFile = document.getElementById('websiteLogo').files[0];
    const homeBannerText = document.getElementById('homeBannerText').value;
    const aboutUsText = document.getElementById('aboutUsText').value;
    if (websiteLogoFile) {
        alert(`Website logo updated: ${websiteLogoFile.name} (Mock action)`);
    }
    alert('Website content saved successfully! (Mock action)');
}

// =========================================================
// Event Listeners and Initial Load
// =========================================================

document.addEventListener('DOMContentLoaded', function() {
    // Basic login check
    if (!localStorage.getItem('userLoggedIn')) {
        window.location.href = '../login.html';
        return;
    }

    // Render all data from localStorage
    renderProducts();
    renderCategories();
    renderOrders();
    renderCustomers();
    renderAppointments();
    renderDiscounts();
    renderMessages();
    updateDashboardStats();

    // Event Delegation for action buttons (more efficient)
    document.addEventListener('click', function(event) {
        const target = event.target;
        const id = target.dataset.id;

        // Product Management
        if (target.classList.contains('edit-product-btn')) {
            const product = products.find(p => p.id === id);
            if (product) showAddProductForm(product);
        } else if (target.classList.contains('delete-product-btn')) {
            deleteProduct(id);
        } else if (target.classList.contains('toggle-status-btn')) {
            toggleProductStatus(id);
        }

        // Category Management
        else if (target.classList.contains('edit-category-btn')) {
            const category = categories.find(c => c.id === id);
            if (category) showAddCategoryForm(category);
        } else if (target.classList.contains('delete-category-btn')) {
            deleteCategory(id);
        }

        // Order Management
        else if (target.classList.contains('edit-order-btn')) {
            const order = orders.find(o => o.id === id);
            if (order) showEditOrderForm(order);
        } else if (target.classList.contains('delete-order-btn')) {
            deleteOrder(id);
        }

        // Customer Management
        else if (target.classList.contains('toggle-customer-status-btn')) {
            toggleCustomerStatus(id);
        }

        // Appointment Management
        else if (target.classList.contains('edit-appointment-btn')) {
            const appointment = appointments.find(app => app.id === id);
            if (appointment) showAddAppointmentForm(appointment);
        } else if (target.classList.contains('accept-appointment-btn')) {
            acceptAppointment(id);
        } else if (target.classList.contains('reject-appointment-btn')) {
            rejectAppointment(id);
        } else if (target.classList.contains('delete-appointment-btn')) {
            deleteAppointment(id);
        }

        // Discount Management
        else if (target.classList.contains('edit-discount-btn')) {
            const discount = discounts.find(d => d.code === id);
            if (discount) showAddDiscountForm(discount);
        } else if (target.classList.contains('delete-discount-btn')) {
            deleteDiscount(id);
        }

        // Message Management
        else if (target.classList.contains('view-msg-btn')) {
            viewMessage(id);
        } else if (target.classList.contains('mark-replied-btn')) {
            markMessageReplied(id);
        } else if (target.classList.contains('delete-msg-btn')) {
            deleteMessage(id);
        }
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.admin-nav a');
    const sections = document.querySelectorAll('.admin-section');
    const navUl = document.querySelector('.admin-nav');

    const setActiveLink = () => {
        let currentActive = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentActive = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && link.getAttribute('href').includes(currentActive)) {
                link.classList.add('active');
            }
        });
    };

    setActiveLink();
    window.addEventListener('scroll', setActiveLink);

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            if (window.innerWidth <= 768) {
                navUl.classList.remove('is-open');
            }
        });
    });

    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', togglelink);
    }
});