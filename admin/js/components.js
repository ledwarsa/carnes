const Components = {
    productos: `
        <div class="header-actions">
            <h2>Gestión de Productos</h2>
            <button class="btn btn-primary" onclick="app.showProductForm()">
                <i class="ph ph-plus"></i> Nuevo Producto
            </button>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="products-list"></tbody>
        </table>
        
        <div id="product-form-container" style="display:none; margin-top:2rem;" class="module-form">
            <h3 id="form-title">Crear Producto</h3>
            <form id="product-form">
                <input type="hidden" id="prod-id">
                <div class="form-group">
                    <label>Nombre del Producto</label>
                    <input type="text" id="prod-name" required>
                </div>
                <div class="form-group">
                    <label>Precio</label>
                    <input type="text" id="prod-price" required>
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea id="prod-description"></textarea>
                </div>
                <div class="form-group">
                    <label>Referencia</label>
                    <input type="text" id="prod-reference">
                </div>
                <div class="form-group" style="display:flex; align-items:center; gap: 1rem;">
                    <input type="checkbox" id="prod-sold-out" style="width: auto;">
                    <label style="margin:0;">Marcar como Agotado</label>
                </div>
                <div class="form-group">
                    <label>URL del Botón (WhatsApp/Link)</label>
                    <input type="text" id="prod-url">
                </div>
                <div class="form-group">
                    <label>Imagen</label>
                    <input type="file" id="prod-image" accept="image/*">
                </div>
                <div class="actions">
                    <button type="submit" class="btn btn-primary">Guardar</button>
                    <button type="button" class="btn btn-danger" onclick="app.hideProductForm()">Cancelar</button>
                </div>
            </form>
        </div>
    `,
    
    usuarios: `
        <div class="header-actions">
            <h2>Gestión de Usuarios</h2>
            <button class="btn btn-primary" onclick="app.showUserForm()">
                <i class="ph ph-plus"></i> Nuevo Usuario
            </button>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Usuario</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="users-list"></tbody>
        </table>
        
        <div id="user-form-container" style="display:none; margin-top:2rem;" class="module-form">
            <h3 id="user-form-title">Crear Usuario</h3>
            <form id="user-form">
                <input type="hidden" id="user-id">
                <div class="form-group">
                    <label>Nombre de Usuario</label>
                    <input type="text" id="user-username" required>
                </div>
                <div class="form-group">
                    <label>Contraseña (dejar en blanco si no se desea cambiar)</label>
                    <input type="password" id="user-password">
                </div>
                <div class="actions">
                    <button type="submit" class="btn btn-primary">Guardar</button>
                    <button type="button" class="btn btn-danger" onclick="app.hideUserForm()">Cancelar</button>
                </div>
            </form>
        </div>
    `,

    seo: `
        <div class="header-actions">
            <h2>Configuración SEO</h2>
        </div>
        <div class="module-form">
            <form id="seo-form">
                <div class="form-group">
                    <label>Título de la página (Title Tag)</label>
                    <input type="text" id="seo-title">
                </div>
                <div class="form-group">
                    <label>Palabras clave (Keywords separadas por coma)</label>
                    <input type="text" id="seo-keywords">
                </div>
                <div class="form-group">
                    <label>Descripción de la página (Meta Description)</label>
                    <textarea id="seo-description"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Guardar Cambios SEO</button>
            </form>
        </div>
    `,

    scripts: `
        <div class="header-actions">
            <h2>Scripts y Tracking</h2>
        </div>
        <div class="module-form">
            <form id="scripts-form">
                <div class="form-group">
                    <label>Google Tag Manager (Código Completo)</label>
                    <textarea id="scripts-gtm" placeholder="<script>...</script>"></textarea>
                </div>
                <div class="form-group">
                    <label>Google Analytics (ID o Script)</label>
                    <textarea id="scripts-analytics"></textarea>
                </div>
                <div class="form-group">
                    <label>Facebook Pixel (Código Completo)</label>
                    <textarea id="scripts-pixel"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Guardar Scripts</button>
            </form>
        </div>
    `,

    cache: `
        <div class="header-actions">
            <h2>Gestión de Caché</h2>
        </div>
        <div class="module-form">
            <form id="cache-form">
                <div class="form-group" style="display:flex; align-items:center; gap: 1rem;">
                    <input type="checkbox" id="cache-enabled" style="width: auto;">
                    <label style="margin:0;">Habilitar Caché de Sistema</label>
                </div>
                <button type="submit" class="btn btn-primary" style="margin-bottom: 2rem;">Guardar Configuración</button>
            </form>
            <hr style="border: 1px solid rgba(255,255,255,0.1); margin-bottom: 2rem;">
            <h3>Vaciar Caché</h3>
            <p style="color: var(--text-muted); margin-bottom: 1rem;">Elimina todos los archivos estáticos guardados en la carpeta /cache/.</p>
            <button class="btn btn-danger" onclick="app.clearCache()">
                <i class="ph ph-trash"></i> Limpiar Ahora
            </button>
        </div>
    `,

    seguridad: `
        <div class="header-actions">
            <h2>Seguridad (Firewall)</h2>
        </div>
        <div class="module-form">
            <form id="security-form">
                <div class="form-group" style="display:flex; align-items:center; gap: 1rem;">
                    <input type="checkbox" id="sec-enabled" style="width: auto;">
                    <label style="margin:0;">Habilitar Firewall</label>
                </div>
                <div class="form-group">
                    <label>Lista Blanca (IPs separadas por coma)</label>
                    <textarea id="sec-whitelist" placeholder="127.0.0.1, ::1"></textarea>
                    <small style="color:var(--text-muted)">Las IPs locales y del servidor se auto-agregan siempre.</small>
                </div>
                <div class="form-group">
                    <label>IPs Bloqueadas (Lista Negra separadas por coma)</label>
                    <textarea id="sec-blocked"></textarea>
                    <small style="color:var(--text-muted)">IPs detectadas haciendo peticiones maliciosas aparecerán aquí.</small>
                </div>
                <button type="submit" class="btn btn-primary">Guardar Reglas</button>
            </form>
        </div>
    `
};
