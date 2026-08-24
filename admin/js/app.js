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
            const isSoldOut = document.getElementById('prod-sold-out').checked;
            const url = document.getElementById('prod-url').value;
            const fileInput = document.getElementById('prod-image');
            
            const formData = new FormData();
            if (id) formData.append('id', id);
            formData.append('name', name);
            formData.append('price', price);
            formData.append('description', desc);
            formData.append('reference', ref);
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
                this.showToast('Error al guardar', 'error');
            }
        });
    },

    async loadProducts() {
        this.state.products = await api.get('products');
        const tbody = document.getElementById('products-list');
        tbody.innerHTML = '';
        this.state.products.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.image ? '<img src="../' + p.image + '" class="item-image">' : 'Sin imagen'}</td>
                <td>
                    ${p.name}
                    ${p.is_sold_out ? '<span style="font-size:0.75rem; background:var(--primary); color:white; padding:0.1rem 0.4rem; border-radius:4px; margin-left:0.5rem; white-space:nowrap;">Agotado</span>' : ''}
                </td>
                <td>${p.price}</td>
                <td class="actions">
                    <button class="btn btn-icon" onclick="app.editProduct('${p.id}')"><i class="ph ph-pencil-simple"></i></button>
                    <button class="btn btn-icon" style="color:#ef4444;" onclick="app.deleteProduct('${p.id}')"><i class="ph ph-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    showProductForm() {
        document.getElementById('product-form').reset();
        document.getElementById('prod-id').value = '';
        document.getElementById('form-title').textContent = 'Crear Producto';
        document.getElementById('product-form-container').style.display = 'block';
    },
    
    hideProductForm() {
        document.getElementById('product-form-container').style.display = 'none';
    },

    editProduct(id) {
        const p = this.state.products.find(x => x.id === id);
        if(!p) return;
        this.showProductForm();
        document.getElementById('form-title').textContent = 'Editar Producto';
        document.getElementById('prod-id').value = p.id;
        document.getElementById('prod-name').value = p.name;
        document.getElementById('prod-price').value = p.price;
        document.getElementById('prod-description').value = p.description || '';
        document.getElementById('prod-reference').value = p.reference || '';
        document.getElementById('prod-sold-out').checked = p.is_sold_out || false;
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
