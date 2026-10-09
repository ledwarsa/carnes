const app = {
    state: {
        products: [],
        users: [],
        seo: {},
        scripts: {}
    },
    
    init() {
        this.bindEvents();
        this.checkAuth();
    },

    bindEvents() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            try {
                await api.login(u, p);
                this.showToast('Login exitoso', 'success');
                this.checkAuth();
            } catch (err) {
                this.showToast('Credenciales incorrectas', 'error');
            }
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', async () => {
            await api.logout();
            this.showLogin();
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.loadModule(e.currentTarget.dataset.target);
            });
        });

        // Auth expired
        window.addEventListener('auth-expired', () => {
            this.showToast('Sesión expirada', 'error');
            this.showLogin();
        });
    },

    async checkAuth() {
        try {
            const data = await api.checkAuth();
            if (data.success) {
                document.getElementById('current-username').textContent = data.username;
                this.showDashboard();
                this.loadModule('productos'); // Default module
            }
        } catch (err) {
            this.showLogin();
        }
    },

    showLogin() {
        document.getElementById('dashboard-view').classList.remove('active');
        document.getElementById('login-view').classList.add('active');
    },

    showDashboard() {
        document.getElementById('login-view').classList.remove('active');
        document.getElementById('dashboard-view').classList.add('active');
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 'warning-circle';
        toast.innerHTML = `<i class="ph-fill ph-${icon}"></i> <span>${message}</span>`;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    async loadModule(moduleName) {
        const contentArea = document.getElementById('content-area');
        const pageTitle = document.getElementById('page-title');
        
        pageTitle.textContent = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
        contentArea.innerHTML = Components[moduleName];

        switch(moduleName) {
            case 'productos': await this.initProducts(); break;
            case 'pedidos': await this.initPedidos(); break;
            case 'usuarios': await this.initUsers(); break;
            case 'seo': await this.initSEO(); break;
            case 'scripts': await this.initScripts(); break;
            case 'cache': await this.initCache(); break;
            case 'seguridad': await this.initSecurity(); break;
        }
    },

    // --- PRODUCTOS ---
    async initProducts() {
        await this.loadProducts();
        document.getElementById('product-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('prod-id').value;
            const name = document.getElementById('prod-name').value;
            const price = document.getElementById('prod-price').value;
            const desc = document.getElementById('prod-description').value;
            const ref = document.getElementById('prod-reference').value;
            const cat = document.getElementById('prod-category').value;
            const isSoldOut = document.getElementById('prod-sold-out').checked;
            const url = document.getElementById('prod-url').value;
            const fileInput = document.getElementById('prod-image');
            
            const formData = new FormData();
            if (id) formData.append('id', id);
            formData.append('name', name);
            formData.append('price', price);
            formData.append('description', desc);
            formData.append('reference', ref);
            formData.append('category', cat);
            formData.append('is_sold_out', isSoldOut);
            formData.append('button_url', url);
            if (fileInput.files[0]) {
                formData.append('image', fileInput.files[0]);
            }

            try {
                await api.postFormData('products', formData);
                this.showToast('Producto guardado');
                this.hideProductForm();
                this.loadProducts();
            } catch(e) {
                console.error(e);
                alert('Error al guardar: ' + e.message);
                this.showToast('Error al guardar', 'error');
            }
        });
    },

    async loadProducts(page = 1) {
        if (!this.state.products || this.state.products.length === 0 || page === 1) {
            this.state.products = await api.get('products');
        }
        
        const perPage = 10;
        const totalPages = Math.ceil(this.state.products.length / perPage);
        const currentPage = page;
        const start = (currentPage - 1) * perPage;
        const pagedProducts = this.state.products.slice(start, start + perPage);

        const tbody = document.getElementById('products-list');
        tbody.innerHTML = '';
        pagedProducts.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.image ? '<img src="../' + p.image + '" class="item-image">' : 'Sin imagen'}</td>
                <td>
                    ${p.name}
                    ${p.is_sold_out ? '<span style="font-size:0.75rem; background:var(--primary); color:white; padding:0.1rem 0.4rem; border-radius:4px; margin-left:0.5rem; white-space:nowrap;">Agotado</span>' : ''}
                </td>
                <td><span style="text-transform: capitalize; padding: 0.2rem 0.5rem; background:#f0f0f0; color:#333; border-radius:4px; font-size:0.8rem; font-weight:600;">${p.category || 'res'}</span></td>
                <td>${p.price}</td>
                <td class="actions">
                    <button class="btn btn-icon" onclick="app.editProduct('${p.id}')"><i class="ph ph-pencil-simple"></i></button>
                    <button class="btn btn-icon" style="color:#ef4444;" onclick="app.deleteProduct('${p.id}')"><i class="ph ph-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Render Pagination
        const pControls = document.getElementById('pagination-controls');
        if(pControls) {
            pControls.innerHTML = '';
            for(let i=1; i<=totalPages; i++) {
                const btn = document.createElement('button');
                btn.className = i === currentPage ? 'btn btn-primary' : 'btn btn-red-outline';
                btn.style.padding = '0.4rem 0.8rem';
                btn.textContent = i;
                btn.onclick = () => this.loadProducts(i);
                pControls.appendChild(btn);
            }
        }
    },

    showProductForm() {
        document.getElementById('product-form').reset();
        document.getElementById('prod-id').value = '';
        document.getElementById('form-title').textContent = 'Crear Producto';
        document.getElementById('current-image-preview').style.display = 'none';
        document.getElementById('prod-current-img').src = '';
        document.getElementById('product-form-container').style.display = 'flex';
    },
    
    hideProductForm() {
        document.getElementById('product-form-container').style.display = 'none';
    },

    editProduct(id) {
        const p = this.state.products.find(x => String(x.id) === String(id));
        if(!p) {
            alert('Error: Producto no encontrado en memoria. Por favor recarga la página.');
            return;
        }
        this.showProductForm();
        document.getElementById('form-title').textContent = 'Editar Producto';
        document.getElementById('prod-id').value = p.id;
        document.getElementById('prod-name').value = p.name;
        document.getElementById('prod-price').value = p.price;
        
        if (p.image) {
            document.getElementById('current-image-preview').style.display = 'block';
            document.getElementById('prod-current-img').src = '../' + p.image;
        } else {
            document.getElementById('current-image-preview').style.display = 'none';
        }
        document.getElementById('prod-description').value = p.description || '';
        document.getElementById('prod-reference').value = p.reference || '';
        document.getElementById('prod-category').value = p.category || 'res';
        document.getElementById('prod-sold-out').checked = p.is_sold_out === true || p.is_sold_out === "true" || p.is_sold_out === 1;
        document.getElementById('prod-url').value = p.button_url || '';
    },

    async deleteProduct(id) {
        if(confirm('¿Eliminar producto?')) {
            try {
                await api.del('products', id);
                this.showToast('Producto eliminado');
                this.loadProducts();
            } catch(e) {
                this.showToast('Error', 'error');
            }
        }
    },

    // --- PEDIDOS ---
    async initPedidos() {
        await this.loadPedidos();
    },

    async loadPedidos() {
        try {
            const list = document.getElementById('orders-list');
            list.innerHTML = '<tr><td colspan="5" style="text-align:center;">Cargando pedidos...</td></tr>';
            const orders = await api.get('orders');
            
            if(orders.length === 0) {
                list.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay pedidos recientes.</td></tr>';
                return;
            }
            
            list.innerHTML = orders.map(o => `
                <tr>
                    <td>${new Date(o.date).toLocaleString()}</td>
                    <td>
                        <strong>${o.customer.name}</strong><br>
                        <small>${o.customer.idNum}</small>
                    </td>
                    <td>${o.customer.phone}</td>
                    <td style="color:var(--primary); font-weight:bold;">$${o.total.toLocaleString('es-CO')}</td>
                    <td>
                        <button class="btn btn-icon" onclick="app.viewPedido('${o.id}')" title="Ver Detalles">
                            <i class="ph ph-eye"></i>
                        </button>
                        <button class="btn btn-icon btn-danger" onclick="app.deletePedido('${o.id}')" title="Eliminar">
                            <i class="ph ph-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
            
            window.ordersData = orders; // Save for view modal
        } catch(e) {
            console.error(e);
            this.showToast('Error al cargar pedidos', 'error');
        }
    },
    
    viewPedido(id) {
        const order = window.ordersData.find(o => o.id === id);
        if(!order) return;
        
        let details = `<div style="padding:1rem;">
            <h3>Detalles del Cliente</h3>
            <p><strong>Nombre:</strong> ${order.customer.name}</p>
            <p><strong>Identificación:</strong> ${order.customer.idNum}</p>
            <p><strong>Celular:</strong> ${order.customer.phone}</p>
            <p><strong>Dirección:</strong> ${order.customer.address}</p>
            <p><strong>Notas:</strong> ${order.customer.notes || 'Ninguna'}</p>
            <hr style="margin:1rem 0;">
            <h3>Productos Solicitados</h3>
            <ul>
        `;
        
        order.items.forEach(item => {
            details += `<li>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString('es-CO')}</li>`;
        });
        
        details += `</ul>
            <h3 style="margin-top:1rem; color:var(--primary);">TOTAL: $${order.total.toLocaleString('es-CO')}</h3>
        </div>`;
        
        // Use a simple alert or modal for now, let's use the form modal container if possible
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0'; modal.style.left = '0'; modal.style.width = '100%'; modal.style.height = '100%';
        modal.style.background = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex'; modal.style.alignItems = 'center'; modal.style.justifyContent = 'center';
        modal.style.zIndex = '1000';
        
        modal.innerHTML = `
            <div style="background:#fff; padding:2rem; border-radius:8px; max-width:500px; width:90%; position:relative;">
                <button onclick="this.parentElement.parentElement.remove()" style="position:absolute; top:1rem; right:1rem; background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>
                <h2>Pedido ${order.id}</h2>
                ${details}
            </div>
        `;
        document.body.appendChild(modal);
    },

    async deletePedido(id) {
        if(!confirm('¿Estás seguro de que deseas eliminar este pedido?')) return;
        try {
            await api.del('orders', id);
            this.showToast('Pedido eliminado');
            this.loadPedidos();
        } catch(e) {
            console.error(e);
            this.showToast('Error al eliminar pedido', 'error');
        }
    },

    // --- USUARIOS ---
    async initUsers() {
        await this.loadUsers();
        document.getElementById('user-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('user-id').value;
            const username = document.getElementById('user-username').value;
            const password = document.getElementById('user-password').value;
            
            const payload = { username };
            if (password) payload.password = password;

            try {
                if(id) {
                    payload.id = id;
                    await api.put('users', payload);
                } else {
                    await api.post('users', payload);
                }
                this.showToast('Usuario guardado');
                this.hideUserForm();
                this.loadUsers();
            } catch(e) {
                this.showToast('Error al guardar', 'error');
            }
        });
    },

    async loadUsers() {
        this.state.users = await api.get('users');
        const tbody = document.getElementById('users-list');
        tbody.innerHTML = '';
        this.state.users.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${u.username}</td>
                <td class="actions">
                    <button class="btn btn-icon" onclick="app.editUser('${u.id}')"><i class="ph ph-pencil-simple"></i></button>
                    <button class="btn btn-icon" style="color:#ef4444;" onclick="app.deleteUser('${u.id}')"><i class="ph ph-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    showUserForm() {
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        document.getElementById('user-form-title').textContent = 'Crear Usuario';
        document.getElementById('user-password').required = true;
        document.getElementById('user-form-container').style.display = 'block';
    },
    
    hideUserForm() {
        document.getElementById('user-form-container').style.display = 'none';
    },

    editUser(id) {
        const u = this.state.users.find(x => x.id === id);
        if(!u) return;
        this.showUserForm();
        document.getElementById('user-form-title').textContent = 'Editar Usuario';
        document.getElementById('user-id').value = u.id;
        document.getElementById('user-username').value = u.username;
        document.getElementById('user-password').required = false;
    },

    async deleteUser(id) {
        if(confirm('¿Eliminar usuario?')) {
            try {
                await api.del('users', id);
                this.showToast('Usuario eliminado');
                this.loadUsers();
            } catch(e) {
                this.showToast('Error', 'error');
            }
        }
    },

    // --- SEO ---
    async initSEO() {
        this.state.seo = await api.get('seo');
        document.getElementById('seo-title').value = this.state.seo.title || '';
        document.getElementById('seo-keywords').value = this.state.seo.keywords || '';
        document.getElementById('seo-description').value = this.state.seo.description || '';

        document.getElementById('seo-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                title: document.getElementById('seo-title').value,
                keywords: document.getElementById('seo-keywords').value,
                description: document.getElementById('seo-description').value
            };
            try {
                await api.post('seo', payload);
                this.showToast('Configuración SEO guardada');
            } catch(e) {
                this.showToast('Error', 'error');
            }
        });
    },

    // --- SCRIPTS ---
    async initScripts() {
        this.state.scripts = await api.get('scripts');
        document.getElementById('scripts-gtm').value = this.state.scripts.gtm || '';
        document.getElementById('scripts-analytics').value = this.state.scripts.analytics || '';
        document.getElementById('scripts-pixel').value = this.state.scripts.facebook_pixel || '';

        document.getElementById('scripts-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                gtm: document.getElementById('scripts-gtm').value,
                analytics: document.getElementById('scripts-analytics').value,
                facebook_pixel: document.getElementById('scripts-pixel').value
            };
            try {
                await api.post('scripts', payload);
                this.showToast('Scripts guardados');
            } catch(e) {
                this.showToast('Error', 'error');
            }
        });
    },

    // --- CACHE ---
    async initCache() {
        this.state.cache = await api.get('cache');
        document.getElementById('cache-enabled').checked = this.state.cache.enabled;

        document.getElementById('cache-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                enabled: document.getElementById('cache-enabled').checked
            };
            try {
                await api.post('cache', payload);
                this.showToast('Configuración guardada');
            } catch(e) {
                this.showToast('Error', 'error');
            }
        });
    },

    async clearCache() {
        if(confirm('¿Seguro que deseas vaciar la caché?')) {
            try {
                const res = await api.post('cache', { action: 'clear' });
                this.showToast(res.message);
            } catch(e) {
                this.showToast('Error al limpiar', 'error');
            }
        }
    },

    // --- SEGURIDAD ---
    async initSecurity() {
        this.state.security = await api.get('security');
        document.getElementById('sec-enabled').checked = this.state.security.enabled;
        document.getElementById('sec-whitelist').value = (this.state.security.whitelist || []).join(', ');
        document.getElementById('sec-blocked').value = (this.state.security.blocked_ips || []).join(', ');

        document.getElementById('security-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                enabled: document.getElementById('sec-enabled').checked,
                whitelist: document.getElementById('sec-whitelist').value,
                blocked_ips: document.getElementById('sec-blocked').value
            };
            try {
                await api.post('security', payload);
                this.showToast('Reglas de seguridad guardadas');
            } catch(e) {
                this.showToast('Error', 'error');
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
