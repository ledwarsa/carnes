const API_URL = '../api/';

const api = {
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, options);
            const data = await response.json();
            
            if (response.status === 401 && endpoint !== 'auth.php?action=login' && endpoint !== 'auth.php?action=check') {
                window.dispatchEvent(new CustomEvent('auth-expired'));
            }
            
            if (!response.ok && data.message) {
                throw new Error(data.message);
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    async checkAuth() {
        return this.request('auth.php?action=check', { method: 'GET' });
    },
    
    async login(username, password) {
        return this.request('auth.php?action=login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    async logout() {
        return this.request('auth.php?action=logout', { method: 'POST' });
    },
    
    async get(endpoint) {
        return this.request(`${endpoint}.php`, { method: 'GET' });
    },
    
    async post(endpoint, body) {
        return this.request(`${endpoint}.php`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    async put(endpoint, body) {
        return this.request(`${endpoint}.php`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    async del(endpoint, id) {
        return this.request(`${endpoint}.php`, {
            method: 'DELETE',
            body: JSON.stringify({ id })
        });
    },

    async postFormData(endpoint, formData) {
        return this.request(`${endpoint}.php`, {
            method: 'POST',
            body: formData
        });
    }
};
