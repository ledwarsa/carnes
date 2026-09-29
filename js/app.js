document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

async function loadProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    try {
        const response = await fetch('api/products.php');
        if (!response.ok) throw new Error('Error al conectar con la API');
        
        const products = await response.json();
        
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
        grid.innerHTML = '<p style="color:red; grid-column:1/-1; text-align:center;">Error al cargar el catálogo.</p>';
    }
}

function formatPrice(price) {
    if (!price) return '0.00';
    const num = parseFloat(price);
    return isNaN(num) ? price : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
