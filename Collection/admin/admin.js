function togglelink() {
  const nav = document.querySelector('.admin-nav');
  const toggleBtn = document.getElementById('toggle-Link');

  nav.classList.toggle('is-open');
  toggleBtn.classList.toggle('active');
  toggleBtn.innerHTML = toggleBtn.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    window.location.href = '../login.html';
  }
}

function performLogin() {
  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const loginMessage = document.getElementById('loginMessage');

  if (email === 'pratapsanap14@gmail.com' && password === 'Pratap@123') {
    window.location.href = "admin/admin.html";

  } else {
    loginMessage.textContent = 'Invalid email or password';
  }
}
        // --- Dashboard Stats Update ---
        function updateDashboardStats() {
            document.getElementById('totalProducts').textContent = document.querySelectorAll('#productsTable tbody tr').length;
            document.getElementById('totalCustomers').textContent = document.querySelectorAll('#customersTable tbody tr').length;
            document.getElementById('totalOrders').textContent = document.querySelectorAll('#ordersTable tbody tr').length;
            
            let totalRevenue = 0;
            document.querySelectorAll('#ordersTable tbody tr').forEach(row => {
                const totalText = row.children[3].textContent; // Get the total column
                totalRevenue += parseFloat(totalText.replace('$', ''));
            });
            document.getElementById('totalRevenue').textContent = totalRevenue.toFixed(2);

            document.getElementById('pendingAppointments').textContent = document.querySelectorAll('#appointmentsTable tbody tr .status-badge.scheduled').length;
            document.getElementById('newMessages').textContent = document.querySelectorAll('#messagesTable tbody tr .status-badge.pending').length;
        }

        // New: Hamburger menu toggle functionality
        function toggleNav() {
            const navUl = document.querySelector('.admin-nav');
            if (navUl) {
                navUl.classList.toggle('is-open');
            }
        }

        // --- Product Management Functions ---
        function showAddProductForm() {
            document.getElementById('addProductForm').style.display = 'block';
            document.getElementById('productsTable').style.display = 'none';
            document.getElementById('addProductForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function hideAddProductForm() {
            document.getElementById('addProductForm').style.display = 'none';
            document.getElementById('productsTable').style.display = 'table';
            document.getElementById('newProductId').value = '';
            document.getElementById('newProductName').value = '';
            document.getElementById('newProductCategory').value = '';
            document.getElementById('newProductPrice').value = '';
            document.getElementById('newProductStock').value = '';
            document.getElementById('newProductImage').value = ''; // Clear file input
            updateDashboardStats();
        }

        function saveProduct() {
            const productId = document.getElementById('newProductId').value.trim();
            const productName = document.getElementById('newProductName').value.trim();
            const productCategory = document.getElementById('newProductCategory').value.trim();
            const productPrice = parseFloat(document.getElementById('newProductPrice').value).toFixed(2);
            const productStock = document.getElementById('newProductStock').value.trim();
            const productImageFile = document.getElementById('newProductImage').files[0];
            const productImageSrc = productImageFile ? URL.createObjectURL(productImageFile) : "https://via.placeholder.com/50";

            if (!productId || !productName || !productCategory || isNaN(productPrice) || !productStock) {
                alert('Please fill in all product fields.');
                return;
            }

            const productsTableBody = document.querySelector('#productsTable tbody');
            const newRow = productsTableBody.insertRow();
            
            newRow.innerHTML = `
                <td data-label="ID">${productId}</td>
                <td data-label="Product"><img src="${productImageSrc}" alt="${productName}"> ${productName}</td>
                <td data-label="Category">${productCategory}</td>
                <td data-label="Price">$${productPrice}</td>
                <td data-label="Stock">${productStock}</td>
                <td data-label="Status"><span class="status-badge active">Active</span></td>
                <td data-label="Actions" class="action-buttons">
                    <button class="btn btn-secondary edit-product-btn">Edit</button>
                    <button class="btn btn-primary delete-product-btn">Delete</button>
                    <button class="btn btn-secondary toggle-status-btn">Deactivate</button>
                </td>
            `;

            attachProductButtonListeners(newRow);
            alert('Product added successfully!');
            hideAddProductForm();
        }

        function attachProductButtonListeners(row) {
            row.querySelector('.edit-product-btn')?.addEventListener('click', function() {
                alert('Edit product functionality coming soon!');
            });
            row.querySelector('.delete-product-btn')?.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this product?')) {
                    row.remove();
                    alert('Product deleted!');
                    updateDashboardStats();
                }
            });
            row.querySelector('.toggle-status-btn')?.addEventListener('click', function() {
                const statusSpan = row.querySelector('.status-badge');
                if (statusSpan.textContent === 'Active') {
                    statusSpan.textContent = 'Inactive';
                    statusSpan.className = 'status-badge inactive';
                    this.textContent = 'Activate';
                } else {
                    statusSpan.textContent = 'Active';
                    statusSpan.className = 'status-badge active';
                    this.textContent = 'Deactivate';
                }
                alert('Product status toggled!');
            });
        }

        // --- Category Management Functions ---
        function showAddCategoryForm() {
            document.getElementById('addCategoryForm').style.display = 'block';
            document.getElementById('categoriesTable').style.display = 'none';
            document.getElementById('addCategoryForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function hideAddCategoryForm() {
            document.getElementById('addCategoryForm').style.display = 'none';
            document.getElementById('categoriesTable').style.display = 'table';
            document.getElementById('newCategoryName').value = '';
            document.getElementById('newCategoryType').value = 'Product';
        }

        function saveCategory() {
            const categoryName = document.getElementById('newCategoryName').value.trim();
            const categoryType = document.getElementById('newCategoryType').value;

            if (!categoryName) {
                alert('Please enter a category name.');
                return;
            }

            const categoriesTableBody = document.querySelector('#categoriesTable tbody');
            const newRow = categoriesTableBody.insertRow();
            const newId = `#CAT${(categoriesTableBody.rows.length + 1).toString().padStart(3, '0')}`;

            newRow.innerHTML = `
                <td data-label="ID">${newId}</td>
                <td data-label="Category Name">${categoryName}</td>
                <td data-label="Type">${categoryType}</td>
                <td data-label="Actions" class="action-buttons">
                    <button class="btn btn-secondary edit-category-btn">Edit</button>
                    <button class="btn btn-primary delete-category-btn">Delete</button>
                </td>
            `;
            attachCategoryButtonListeners(newRow);
            alert('Category added successfully!');
            hideAddCategoryForm();
        }

        function attachCategoryButtonListeners(row) {
            row.querySelector('.edit-category-btn')?.addEventListener('click', function() {
                alert('Edit category functionality coming soon!');
            });
            row.querySelector('.delete-category-btn')?.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this category?')) {
                    row.remove();
                    alert('Category deleted!');
                }
            });
        }

        // --- Order Management Functions ---
        let currentEditingOrderRow = null;
        function showEditOrderForm(orderData, rowElement) {
            const editOrderForm = document.getElementById('editOrderForm');
            if (editOrderForm) {
                document.getElementById('editOrderIdHidden').value = orderData.id;
                document.getElementById('editOrderCustomer').value = orderData.customer;
                document.getElementById('editOrderDate').value = orderData.date;
                document.getElementById('editOrderTotal').value = orderData.total.replace('$', '');
                document.getElementById('editOrderStatus').value = orderData.status;

                editOrderForm.style.display = 'block';
                document.getElementById('ordersTable').style.display = 'none';
                editOrderForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                currentEditingOrderRow = rowElement;
            } else {
                console.error("Element with ID 'editOrderForm' not found.");
            }
        }

        function hideEditOrderForm() {
            const editOrderForm = document.getElementById('editOrderForm');
            if (editOrderForm) {
                editOrderForm.style.display = 'none';
                document.getElementById('ordersTable').style.display = 'table';
                document.getElementById('editOrderIdHidden').value = '';
                document.getElementById('editOrderCustomer').value = '';
                document.getElementById('editOrderDate').value = '';
                document.getElementById('editOrderTotal').value = '';
                document.getElementById('editOrderStatus').value = '';
                currentEditingOrderRow = null;
                updateDashboardStats();
            } else {
                console.error("Element with ID 'editOrderForm' not found.");
            }
        }

        function saveOrderChanges() {
            const orderId = document.getElementById('editOrderIdHidden').value;
            const newCustomer = document.getElementById('editOrderCustomer').value.trim();
            const newDate = document.getElementById('editOrderDate').value;
            const newTotal = `$${parseFloat(document.getElementById('editOrderTotal').value).toFixed(2)}`;
            const newStatus = document.getElementById('editOrderStatus').value;

            if (!newCustomer || !newDate || isNaN(parseFloat(newTotal.replace('$', ''))) || !newStatus) {
                alert('Please fill in all order fields.');
                return;
            }

            if (currentEditingOrderRow) {
                const cells = currentEditingOrderRow.querySelectorAll('td');
                cells[1].textContent = newCustomer;
                cells[2].textContent = newDate;
                cells[3].textContent = newTotal;
                const statusSpan = cells[4].querySelector('.status-badge');
                statusSpan.textContent = newStatus;
                statusSpan.className = 'status-badge ' + newStatus.toLowerCase();
            }

            alert('Order updated successfully!');
            hideEditOrderForm();
        }

        function attachOrderButtonListeners(row) {
            row.querySelector('.edit-order-btn')?.addEventListener('click', function() {
                const cells = row.querySelectorAll('td');
                const orderData = {
                    id: cells[0].textContent.trim(),
                    customer: cells[1].textContent.trim(),
                    date: cells[2].textContent.trim(),
                    total: cells[3].textContent.trim(),
                    status: cells[4].querySelector('.status-badge').textContent.trim()
                };
                showEditOrderForm(orderData, row);
            });
            row.querySelector('.delete-order-btn')?.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this order?')) {
                    row.remove();
                    alert('Order deleted!');
                    updateDashboardStats();
                }
            });
        }

        // --- Customer Management Functions ---
        function attachCustomerButtonListeners(row) {
            row.querySelector('.view-orders-btn')?.addEventListener('click', function() {
                const customerId = row.children[0].textContent.trim();
                alert(`Viewing orders for customer ${customerId} (functionality not fully implemented).`);
            });
            row.querySelector('.toggle-customer-status-btn')?.addEventListener('click', function() {
                const statusSpan = row.querySelector('.status-badge');
                if (statusSpan.textContent === 'Active') {
                    statusSpan.textContent = 'Disabled';
                    statusSpan.className = 'status-badge disabled';
                    this.textContent = 'Enable';
                } else {
                    statusSpan.textContent = 'Active';
                    statusSpan.className = 'status-badge active';
                    this.textContent = 'Disable';
                }
                alert('Customer status toggled!');
            });
        }

        // --- Appointment Management Functions ---
        function showAddAppointmentForm() {
            document.getElementById('addAppointmentForm').style.display = 'block';
            document.getElementById('appointmentsTable').style.display = 'none';
            document.getElementById('addAppointmentForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        function hideAddAppointmentForm() {
            document.getElementById('addAppointmentForm').style.display = 'none';
            document.getElementById('appointmentsTable').style.display = 'table';
            document.getElementById('appointmentCustomerName').value = '';
            document.getElementById('appointmentService').value = '';
            document.getElementById('appointmentBeautician').value = '';
            document.getElementById('appointmentDate').value = '';
            document.getElementById('appointmentTime').value = '';
            updateDashboardStats();
        }

        function saveAppointment() {
            const customerName = document.getElementById('appointmentCustomerName').value.trim();
            const service = document.getElementById('appointmentService').value.trim();
            const beautician = document.getElementById('appointmentBeautician').value.trim();
            const date = document.getElementById('appointmentDate').value;
            const time = document.getElementById('appointmentTime').value;

            if (!customerName || !service || !date || !time) {
                alert('Please fill in all appointment fields.');
                return;
            }

            const appointmentsTableBody = document.querySelector('#appointmentsTable tbody');
            const newRow = appointmentsTableBody.insertRow();
            const newId = `#APP${(appointmentsTableBody.rows.length + 1).toString().padStart(3, '0')}`;

            newRow.innerHTML = `
                <td data-label="ID">${newId}</td>
                <td data-label="Customer">${customerName}</td>
                <td data-label="Service">${service}</td>
                <td data-label="Beautician">${beautician || 'N/A'}</td>
                <td data-label="Date">${date}</td>
                <td data-label="Time">${time}</td>
                <td data-label="Status"><span class="status-badge scheduled">Scheduled</span></td>
                <td data-label="Actions" class="action-buttons">
                    <button class="btn btn-secondary edit-appointment-btn">Edit</button>
                    <button class="btn btn-primary accept-appointment-btn">Accept</button>
                    <button class="btn btn-primary reject-appointment-btn">Reject</button>
                </td>
            `;
            attachAppointmentButtonListeners(newRow);
            alert('Appointment saved successfully!');
            hideAddAppointmentForm();
        }

        function attachAppointmentButtonListeners(row) {
            row.querySelector('.edit-appointment-btn')?.addEventListener('click', function() {
                alert('Edit appointment functionality coming soon!');
            });
            row.querySelector('.accept-appointment-btn')?.addEventListener('click', function() {
                const statusSpan = row.querySelector('.status-badge');
                statusSpan.textContent = 'Accepted';
                statusSpan.className = 'status-badge accepted';
                alert('Appointment accepted!');
                updateDashboardStats();
            });
            row.querySelector('.reject-appointment-btn')?.addEventListener('click', function() {
                const statusSpan = row.querySelector('.status-badge');
                statusSpan.textContent = 'Rejected';
                statusSpan.className = 'status-badge rejected';
                alert('Appointment rejected!');
                updateDashboardStats();
            });
            row.querySelector('.delete-appointment-btn')?.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this appointment?')) {
                    row.remove();
                    alert('Appointment deleted!');
                    updateDashboardStats();
                }
            });
        }

        // --- Discount Management Functions ---
        let currentEditingDiscountRow = null;
        function showAddDiscountForm() {
            document.getElementById('discountForm').style.display = 'block';
            document.getElementById('discountsTable').style.display = 'none';
            document.getElementById('discountForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
            document.getElementById('discountIdHidden').value = '';
            document.getElementById('discountCode').value = '';
            document.getElementById('discountProductId').value = '';
            document.getElementById('discountImage').value = '';
            document.getElementById('discountType').value = 'Percentage';
            document.getElementById('discountValue').value = '';
            document.getElementById('discountMinPurchase').value = '';
            document.getElementById('discountExpiry').value = '';
            currentEditingDiscountRow = null;
        }

        function showEditDiscountForm(discountData, rowElement) {
            const discountForm = document.getElementById('discountForm');
            if (discountForm) {
                document.getElementById('discountIdHidden').value = discountData.code;
                document.getElementById('discountCode').value = discountData.code;
                document.getElementById('discountProductId').value = discountData.productId;
                document.getElementById('discountImage').value = ''; 
                document.getElementById('discountType').value = discountData.type;
                document.getElementById('discountValue').value = discountData.value;
                document.getElementById('discountMinPurchase').value = parseFloat(discountData.minPurchase.replace('$', ''));
                document.getElementById('discountExpiry').value = discountData.expiry;

                discountForm.style.display = 'block';
                document.getElementById('discountsTable').style.display = 'none';
                discountForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                currentEditingDiscountRow = rowElement;
            } else {
                console.error("Element with ID 'discountForm' not found.");
            }
        }

        function hideDiscountForm() {
            const discountForm = document.getElementById('discountForm');
            if (discountForm) {
                discountForm.style.display = 'none';
                document.getElementById('discountsTable').style.display = 'table';
                document.getElementById('discountIdHidden').value = '';
                document.getElementById('discountCode').value = '';
                document.getElementById('discountProductId').value = '';
                document.getElementById('discountImage').value = '';
                document.getElementById('discountType').value = 'Percentage';
                document.getElementById('discountValue').value = '';
                document.getElementById('discountMinPurchase').value = '';
                document.getElementById('discountExpiry').value = '';
                currentEditingDiscountRow = null;
            } else {
                console.error("Element with ID 'discountForm' not found.");
            }
        }

        function saveDiscount() {
            const discountCode = document.getElementById('discountCode').value.trim();
            const discountProductId = document.getElementById('discountProductId').value.trim();
            const discountImageFile = document.getElementById('discountImage').files[0];
            const discountImageSrc = discountImageFile ? URL.createObjectURL(discountImageFile) : "https://via.placeholder.com/50";
            const discountType = document.getElementById('discountType').value;
            const discountValue = document.getElementById('discountValue').value.trim();
            const discountMinPurchase = parseFloat(document.getElementById('discountMinPurchase').value).toFixed(2);
            const discountExpiry = document.getElementById('discountExpiry').value;

            if (!discountCode || !discountType || !discountValue || isNaN(discountMinPurchase) || !discountExpiry) {
                alert('Please fill in all discount fields.');
                return;
            }

            if (currentEditingDiscountRow) {
                const cells = currentEditingDiscountRow.querySelectorAll('td');
                cells[0].textContent = discountCode;
                cells[1].textContent = discountProductId || 'N/A';
                cells[2].innerHTML = `<img src="${discountImageSrc}" alt="Product Image">`;
                cells[3].textContent = discountType;
                cells[4].textContent = discountValue;
                cells[5].textContent = `$${discountMinPurchase}`;
                cells[6].textContent = discountExpiry;
                alert(`Discount ${discountCode} updated successfully!`);
            } else {
                const discountsTableBody = document.querySelector('#discountsTable tbody');
                const newRow = discountsTableBody.insertRow();
                newRow.innerHTML = `
                    <td data-label="Code">${discountCode}</td>
                    <td data-label="Product ID">${discountProductId || 'N/A'}</td>
                    <td data-label="Image"><img src="${discountImageSrc}" alt="Product Image"></td>
                    <td data-label="Type">${discountType}</td>
                    <td data-label="Value">${discountValue}</td>
                    <td data-label="Min. Purchase">$${discountMinPurchase}</td>
                    <td data-label="Expiry Date">${discountExpiry}</td>
                    <td data-label="Actions" class="action-buttons">
                        <button class="btn btn-secondary edit-discount-btn">Edit</button>
                        <button class="btn btn-primary delete-discount-btn">Delete</button>
                    </td>
                `;
                alert(`New discount ${discountCode} added successfully!`);
            }

            attachDiscountButtonListeners(currentEditingDiscountRow || newRow); // Attach listeners to the updated/new row
            hideDiscountForm();
        }

        function attachDiscountButtonListeners(row) {
            row.querySelector('.edit-discount-btn')?.addEventListener('click', function() {
                const cells = row.querySelectorAll('td');
                const discountData = {
                    code: cells[0].textContent.trim(),
                    productId: cells[1].textContent.trim(),
                    type: cells[3].textContent.trim(),
                    value: cells[4].textContent.trim(),
                    minPurchase: cells[5].textContent.trim(),
                    expiry: cells[6].textContent.trim()
                };
                showEditDiscountForm(discountData, row);
            });
            row.querySelector('.delete-discount-btn')?.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this discount?')) {
                    row.remove();
                    alert('Discount deleted!');
                }
            });
        }

        // --- Message Management Functions ---
        function attachMessageButtonListeners(row) {
            row.querySelector('.view-msg-btn')?.addEventListener('click', function() {
                const sender = row.children[0].textContent.trim();
                const email = row.children[1].textContent.trim();
                const message = row.children[2].textContent.trim();
                alert(`Message from: ${sender} (${email})\n\nMessage: ${message}`);
            });
            row.querySelector('.mark-replied-btn')?.addEventListener('click', function() {
                const statusSpan = row.querySelector('.status-badge');
                statusSpan.textContent = 'Replied';
                statusSpan.className = 'status-badge replied';
                alert('Message marked as replied!');
                updateDashboardStats();
            });
            row.querySelector('.delete-msg-btn')?.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this message?')) {
                    row.remove();
                    alert('Message deleted!');
                    updateDashboardStats();
                }
            });
        }

        // --- Admin Settings Functions ---
        function changeAdminPassword() {
            const currentPass = document.getElementById('currentPassword').value;
            const newPass = document.getElementById('newPassword').value;
            const confirmNewPass = document.getElementById('confirmNewPassword').value;

            // Mock validation
            if (currentPass !== 'password') { // Assuming 'password' is the current mock password
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

        // --- Initializing Listeners on DOM Load ---
        document.addEventListener('DOMContentLoaded', function() {
            // Attach listeners to existing elements
            document.querySelectorAll('#productsTable tbody tr').forEach(attachProductButtonListeners);
            document.querySelectorAll('#categoriesTable tbody tr').forEach(attachCategoryButtonListeners);
            document.querySelectorAll('#ordersTable tbody tr').forEach(attachOrderButtonListeners);
            document.querySelectorAll('#customersTable tbody tr').forEach(attachCustomerButtonListeners);
            document.querySelectorAll('#appointmentsTable tbody tr').forEach(attachAppointmentButtonListeners);
            document.querySelectorAll('#discountsTable tbody tr').forEach(attachDiscountButtonListeners);
            document.querySelectorAll('#messagesTable tbody tr').forEach(attachMessageButtonListeners);

            // Update dashboard stats on initial load
            updateDashboardStats();

            // Smooth scroll for navigation links
            const navLinks = document.querySelectorAll('.admin-nav a');
            const sections = document.querySelectorAll('.admin-section');
            const navToggle = document.querySelector('.nav-toggle');
            const navUl = document.querySelector('.admin-nav');

            const setActiveLink = () => {
                let currentActive = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 100;
                    const sectionHeight = section.clientHeight;
                    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
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
                    if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                        event.preventDefault();
                        const targetId = this.getAttribute('href').substring(1);
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
                    // New: Close mobile nav on click
                    if (window.innerWidth <= 768) {
                        navUl.classList.remove('is-open');
                    }
                });
            });

            // New: Hamburger menu toggle event listener
            if (navToggle) {
                navToggle.addEventListener('click', toggleNav);
            }
        });