class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart_items')) || [];
        this.init();
    }

    init() {
        this.renderCartHTML();
        this.bindEvents();
        this.updateBadge();
        this.renderCartItems();
    }

    renderCartHTML() {
        if (document.getElementById('cart-drawer-overlay')) return;

        const html = `
            <div id="cart-drawer-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9998; transition: opacity 0.3s;"></div>
            <div id="cart-drawer" style="position:fixed; top:0; right:-400px; width:100%; max-width:400px; height:100%; background:#fff; z-index:9999; box-shadow: -5px 0 15px rgba(0,0,0,0.1); transition: right 0.3s ease; display:flex; flex-direction:column;">
                <div style="padding:1.5rem; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center; background:#1a1a1a; color:#fff;">
                    <h3 style="margin:0; font-size:1.2rem; display:flex; align-items:center; gap:0.5rem;"><i class="ph ph-shopping-cart"></i> Mi Carrito</h3>
                    <button id="close-cart-btn" style="background:none; border:none; color:#fff; font-size:1.5rem; cursor:pointer;"><i class="ph ph-x"></i></button>
                </div>
                
                <div id="cart-items-container" style="flex:1; overflow-y:auto; padding:1.5rem; display:flex; flex-direction:column; gap:1rem;">
                    <!-- Items will be injected here -->
                </div>
                
                <div style="padding:1.5rem; border-top:1px solid #eee; background:#f9f9f9;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:1rem; font-size:1.2rem; font-weight:bold;">
                        <span>Total:</span>
                        <span id="cart-total-price">$0</span>
                    </div>
                    <button id="checkout-btn" class="btn btn-red" style="width:100%; text-align:center; display:block;">Hacer Pedido</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    bindEvents() {
        const topCart = document.querySelector('.top-cart');
        if (topCart) {
            topCart.style.cursor = 'pointer';
            topCart.addEventListener('click', () => this.openCart());
        }

        document.getElementById('close-cart-btn').addEventListener('click', () => this.closeCart());
        document.getElementById('cart-drawer-overlay').addEventListener('click', () => this.closeCart());
        document.getElementById('checkout-btn').addEventListener('click', () => this.checkout());

        // Event delegation for "Add to cart" buttons
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-to-cart-btn');
            if (btn) {
                e.preventDefault();
                const id = btn.dataset.id;
                const name = btn.dataset.name;
                const priceStr = btn.dataset.price;
                const image = btn.dataset.image;
                this.addItem(id, name, priceStr, image);
            }
        });
    }

    parsePrice(priceStr) {
        if (!priceStr) return 0;
        // Remove $ and any spaces
        let cleaned = priceStr.replace('$', '').trim();
        // Since colombian format is 42.857 for 42 thousand, we remove the dot.
        cleaned = cleaned.replace(/\./g, '');
        // If they accidentally used comma instead of dot for thousands
        cleaned = cleaned.replace(/,/g, '');
        const val = parseFloat(cleaned);
        return isNaN(val) ? 0 : val;
    }

    formatPrice(num) {
        return '$' + num.toLocaleString('es-CO');
    }

    addItem(id, name, priceStr, image) {
        const price = this.parsePrice(priceStr);
        const existing = this.items.find(i => i.id === id);
        
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }
        
        this.save();
        this.updateBadge();
        this.renderCartItems();
        this.openCart();
    }

    removeItem(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.save();
        this.updateBadge();
        this.renderCartItems();
    }

    updateQuantity(id, change) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.save();
                this.updateBadge();
                this.renderCartItems();
            }
        }
    }

    save() {
        localStorage.setItem('cart_items', JSON.stringify(this.items));
    }

    updateBadge() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    renderCartItems() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;
        
        if (this.items.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:#999; margin-top:2rem;"><i class="ph ph-shopping-cart" style="font-size:3rem; margin-bottom:1rem;"></i><br>Tu carrito está vacío</div>';
            document.getElementById('cart-total-price').textContent = '$0';
            return;
        }

        let html = '';
        let total = 0;

        this.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const imgPath = item.image && item.image.trim() !== '' ? item.image : 'uploads/logofull-sinfondo.png';
            
            html += `
                <div style="display:flex; gap:1rem; align-items:center; padding-bottom:1rem; border-bottom:1px solid #eee;">
                    <img src="${imgPath}" style="width:60px; height:60px; object-fit:cover; border-radius:4px; background:#f5f5f5;">
                    <div style="flex:1;">
                        <h4 style="margin:0; font-size:0.9rem; color:#333;">${item.name}</h4>
                        <div style="color:var(--primary); font-weight:bold; font-size:0.9rem; margin-top:0.25rem;">${this.formatPrice(item.price)} x ${item.quantity} = ${this.formatPrice(itemTotal)}</div>
                        
                        <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.5rem;">
                            <button class="cart-qty-btn" onclick="cart.updateQuantity('${item.id}', -1)" style="width:24px; height:24px; border:1px solid #ddd; background:#fff; border-radius:4px; cursor:pointer;">-</button>
                            <span style="font-size:0.9rem;">${item.quantity}</span>
                            <button class="cart-qty-btn" onclick="cart.updateQuantity('${item.id}', 1)" style="width:24px; height:24px; border:1px solid #ddd; background:#fff; border-radius:4px; cursor:pointer;">+</button>
                            <button onclick="cart.removeItem('${item.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer; margin-left:auto; font-size:1.1rem;"><i class="ph ph-trash"></i></button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        document.getElementById('cart-total-price').textContent = this.formatPrice(total);
    }

    openCart() {
        document.getElementById('cart-drawer-overlay').style.display = 'block';
        // Tiny timeout to allow display:block to apply before animating
        setTimeout(() => {
            document.getElementById('cart-drawer').style.right = '0';
        }, 10);
    }

    closeCart() {
        document.getElementById('cart-drawer').style.right = '-400px';
        setTimeout(() => {
            document.getElementById('cart-drawer-overlay').style.display = 'none';
        }, 300);
    }

    checkout() {
        if (this.items.length === 0) return;
        window.location.href = 'checkout.html';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
});
