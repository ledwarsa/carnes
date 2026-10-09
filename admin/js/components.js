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
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="products-list"></tbody>
        </table>
        
        <!-- Paginación -->
        <div id="pagination-controls" class="pagination" style="margin-top: 1rem; display: flex; justify-content: center; gap: 0.5rem;">
        </div>
        
        <div id="product-form-container" class="modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:1000; align-items:center; justify-content:center; padding: 1rem;">
            <div class="module-form" style="background:#1e293b; padding:2rem; border-radius:8px; width:100%; max-width:600px; max-height:90vh; overflow-y:auto; box-shadow: 0 10px 25px rgba(0,0,0,0.5); position:relative;">
                <h3 id="form-title" style="margin-bottom: 1.5rem; color:#fff;">Crear Producto</h3>
                <form id="product-form">
                    <input type="hidden" id="prod-id">
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label style="color:#cbd5e1;">Nombre del Producto</label>
                            <input type="text" id="prod-name" required>
                        </div>
                        <div class="form-group">
                            <label style="color:#cbd5e1;">Categoría</label>
                            <select id="prod-category" required>
                                <option value="res">Res</option>
                                <option value="cerdo">Cerdo</option>
                                <option value="pollo">Pollo</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label style="color:#cbd5e1;">Precio</label>
                            <input type="text" id="prod-price" required>
                        </div>
                        <div class="form-group">
                            <label style="color:#cbd5e1;">Referencia</label>
                            <input type="text" id="prod-reference">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label style="color:#cbd5e1;">Descripción</label>
                        <textarea id="prod-description" rows="3"></textarea>
                    </div>
                    
                    <div class="form-group" style="display:flex; align-items:center; gap: 1rem; margin-bottom: 1.5rem; background: rgba(255,255,255,0.05); padding: 0.8rem; border-radius: 4px;">
                        <input type="checkbox" id="prod-sold-out" style="width: auto;">
                        <label style="margin:0; color:#cbd5e1;">Marcar como Agotado</label>
                    </div>
                    
                    <div class="form-group">
                        <label style="color:#cbd5e1;">URL del Botón (WhatsApp/Link)</label>
                        <input type="text" id="prod-url">
                    </div>
                    
                    <div class="form-group">
                        <label style="color:#cbd5e1;">Imagen del Producto</label>
                        
                        <!-- Contenedor para mostrar la imagen actual -->
                        <div id="current-image-preview" style="display:none; text-align:center; margin-bottom: 1rem; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 4px;">
                            <img id="prod-current-img" src="" style="max-height:120px; border-radius:4px; object-fit:contain;">
                            <p style="font-size:0.8rem; color:#94a3b8; margin-top:0.5rem; margin-bottom:0;">Imagen actual del producto</p>
                        </div>
                        
                        <input type="file" id="prod-image" accept="image/*">
                    </div>
                    
                    <div class="actions" style="margin-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem;">
                        <button type="button" class="btn btn-danger" onclick="app.hideProductForm()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    `,
    
    pedidos: `
        <div class="header-actions">
            <h2>Gestión de Pedidos</h2>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>Total</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="orders-list"></tbody>
        </table>
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
