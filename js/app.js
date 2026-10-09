document.addEventListener('DOMContentLoaded', () => {
    // loadProducts() is now embedded in index.html to avoid caching issues
    loadSettings();
    initMobileMenu();
});

function initMobileMenu() {
    const navContent = document.querySelector('.nav-content');
    const navLinks = document.querySelector('.nav-links');
    if (!navContent || !navLinks) return;

    // Create hamburger icon
    const hamburger = document.createElement('div');
    hamburger.className = 'mobile-menu-btn';
    hamburger.innerHTML = '<i class="ph ph-list" style="font-size: 2.2rem; color: white;"></i>';
    
    // Create a container for the logo and hamburger to sit side-by-side
    const logoArea = document.createElement('div');
    logoArea.className = 'mobile-logo-area';
    
    // Move logo into it
    const logo = navContent.querySelector('.logo');
    if (logo) {
        logoArea.appendChild(logo);
    }
    logoArea.appendChild(hamburger);
    
    navContent.insertBefore(logoArea, navContent.firstChild);

    hamburger.addEventListener('click', () => {
        navContent.classList.toggle('menu-open');
        // change icon
        if (navContent.classList.contains('menu-open')) {
            hamburger.innerHTML = '<i class="ph ph-x" style="font-size: 2.2rem; color: white;"></i>';
        } else {
            hamburger.innerHTML = '<i class="ph ph-list" style="font-size: 2.2rem; color: white;"></i>';
        }
    });
}

async function loadSettings() {
    try {
        const response = await fetch('api/settings.php?t=' + new Date().getTime());
        if (response.ok) {
            const settings = await response.json();
            window.siteSettings = settings; // Save globally for other scripts

            // Update Social Links
            const fbIcons = document.querySelectorAll('.ph-facebook-logo');
            fbIcons.forEach(icon => {
                if (settings.facebook) icon.parentElement.href = settings.facebook;
            });
            
            const igIcons = document.querySelectorAll('.ph-instagram-logo');
            igIcons.forEach(icon => {
                if (settings.instagram) icon.parentElement.href = settings.instagram;
            });
            
            // Update Phone and Location
            const topPhone = document.querySelector('.top-info span:nth-child(1)');
            if (topPhone && settings.phone) topPhone.textContent = settings.phone;
            
            const topLocation = document.querySelector('.top-info span:nth-child(2)');
            if (topLocation && settings.location) topLocation.textContent = settings.location;

            const footerLocation = document.querySelector('.footer-left p:nth-of-type(1)');
            if (footerLocation && settings.location) footerLocation.textContent = settings.location;

            const footerPhone = document.querySelector('.footer-left p:nth-of-type(2)');
            if (footerPhone && settings.phone) footerPhone.textContent = settings.phone;
            
            // Create Floating WhatsApp Button
            if (settings.whatsapp_number) {
                const waBtn = document.createElement('a');
                const text = encodeURIComponent(settings.whatsapp_message || '¡Hola! Quisiera más información.');
                waBtn.href = `https://wa.me/${settings.whatsapp_number}?text=${text}`;
                waBtn.target = "_blank";
                waBtn.className = "whatsapp-float";
                waBtn.innerHTML = '<i class="ph-fill ph-whatsapp-logo"></i>';
                document.body.appendChild(waBtn);
            }
        }
    } catch (e) {
        console.error("Error loading settings:", e);
    }
}

async function loadProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    try {
        console.log("Fetching products from api/products.php...");
        const response = await fetch('api/products.php');
        if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
        }
        
        const products = await response.json();
        console.log("Products loaded:", products.length);
        
        if (products.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No hay productos en el catálogo aún.</p>';
            return;
        }
        
        grid.innerHTML = '';
        
        products.forEach(product => {
            const isSoldOut = product.is_sold_out === true || product.is_sold_out === "true";
            
            const card = document.createElement('div');
            card.className = `product-card`;
            
            const imageHtml = product.image 
                ? `<img src="${product.image}" alt="${product.name}" ${isSoldOut ? 'style="filter: grayscale(100%); opacity:0.6;"' : ''}>` 
                : `<div style="height:180px; background:#f5f5f5; display:flex; align-items:center; justify-content:center; margin-bottom:1rem;"><i class="ph ph-image" style="font-size:3rem; color:#ccc;"></i></div>`;
                
            const buyButton = isSoldOut
                ? `<span class="btn btn-red-outline" style="opacity:0.5; border-color:#ccc; color:#ccc; background:transparent;">Agotado</span>`
                : (product.button_url ? `<a href="${product.button_url}" target="_blank" class="btn btn-red-outline">Comprar</a>` : `<span class="btn btn-red-outline">Ver detalles</span>`);

            card.innerHTML = `
                ${imageHtml}
                <h3>${product.name}</h3>
                <p style="font-size:0.85rem; color:#666; margin-bottom:1rem; height:40px; overflow:hidden;">${product.description || ''}</p>
                <div class="price">$${formatPrice(product.price)}</div>
                ${buyButton}
            `;
            
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error(error);
        grid.innerHTML = `<p style="color:red; grid-column:1/-1; text-align:center;">Error al cargar el catálogo: ${error.message}</p>`;
    }
}

function formatPrice(price) {
    if (!price) return '0.00';
    const num = parseFloat(price);
    return isNaN(num) ? price : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
