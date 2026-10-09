const Components = {

    promociones: `
        <div class="header-actions">
            <h2>Gestión de Promociones</h2>
            <button class="btn btn-primary" onclick="app.showPromoModal()">
                <i class="ph ph-plus"></i> Nueva Promoción
            </button>
        </div>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descuento</th>
                    <th>Aplica a</th>
                    <th>Vigencia</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="promos-table-body">
                <!-- Dinámico -->
            </tbody>
        </table>
        
        <!-- Modal Promoción -->
        <div id="promo-modal" class="modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:1000; align-items:center; justify-content:center; padding: 1rem;">
            <div class="module-form" style="background:#1e293b; padding:2rem; border-radius:8px; width:100%; max-width:600px; max-height:90vh; overflow-y:auto; box-shadow: 0 10px 25px rgba(0,0,0,0.5); position:relative;">
                <button class="close-btn" type="button" onclick="app.closePromoModal()" style="position:absolute; top:1rem; right:1rem; background:transparent; border:none; color:#fff; cursor:pointer; font-size:1.5rem;"><i class="ph ph-x"></i></button>
                <h3 id="promo-modal-title" style="margin-bottom: 1.5rem; color:#fff;">Nueva Promoción</h3>
                <form id="promo-form">
                    <input type="hidden" id="promo-id">
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label style="color:#cbd5e1;">Nombre de Promoción</label>
                            <input type="text" id="promo-name" required placeholder="Ej: Jueves Locos">
                        </div>
                        <div class="form-group">
                            <label style="color:#cbd5e1;">Descuento (%)</label>
                            <input type="number" id="promo-discount" required min="1" max="100">
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-top:1rem;">
                        <label style="color:#cbd5e1;">Aplica a</label>
                        <select id="promo-type" required onchange="app.onPromoTypeChange()">
                            <option value="global">Todos los productos</option>
                            <option value="category">Por Categoría</option>
                            <option value="product">Por Producto Específico</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="promo-targets-container" style="display:none; margin-top:1rem;">
                        <label style="color:#cbd5e1;">Seleccionar objetivo</label>
                        <select id="promo-targets" multiple style="height:100px;">
                            <!-- Dinámico -->
                        </select>
                        <small style="color:#94a3b8;">Mantén presionado Ctrl/Cmd para seleccionar varios.</small>
                    </div>

                    <div class="form-group" style="margin-top:1rem;">
                        <label style="color:#cbd5e1;">Horario / Vigencia</label>
                        <select id="promo-schedule-type" required onchange="app.onPromoScheduleChange()">
                            <option value="always">Siempre activa</option>
                            <option value="days_of_week">Días de la semana</option>
                            <option value="date_range">Rango de fechas</option>
                        </select>
                    </div>

                    <div id="promo-days-container" style="display:none; margin-top:1rem; flex-wrap:wrap; gap:0.5rem;">
                        <label style="color:#cbd5e1; width:100%;">Seleccionar Días:</label>
                        <label style="color:#fff;"><input type="checkbox" name="promo-day" value="1"> Lunes</label>
                        <label style="color:#fff;"><input type="checkbox" name="promo-day" value="2"> Martes</label>
                        <label style="color:#fff;"><input type="checkbox" name="promo-day" value="3"> Miércoles</label>
                        <label style="color:#fff;"><input type="checkbox" name="promo-day" value="4"> Jueves</label>
                        <label style="color:#fff;"><input type="checkbox" name="promo-day" value="5"> Viernes</label>
                        <label style="color:#fff;"><input type="checkbox" name="promo-day" value="6"> Sábado</label>
                        <label style="color:#fff;"><input type="checkbox" name="promo-day" value="0"> Domingo</label>
                    </div>

                    <div id="promo-dates-container" style="display:none; margin-top:1rem; grid-template-columns: 1fr 1fr; gap:1rem;">
                        <div class="form-group">
                            <label style="color:#cbd5e1;">Fecha Inicio</label>
                            <input type="date" id="promo-start-date">
                        </div>
                        <div class="form-group">
                            <label style="color:#cbd5e1;">Fecha Fin</label>
                            <input type="date" id="promo-end-date">
                        </div>
                    </div>

                    <div class="form-group checkbox-group" style="margin-top: 1.5rem;">
                        <label>
                            <input type="checkbox" id="promo-status" checked>
                            Activa
                        </label>
                    </div>
                    
                    <div style="margin-top: 2rem; text-align: right;">
                        <button type="button" class="btn btn-secondary" onclick="app.closePromoModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary" style="margin-left: 0.5rem;">Guardar Promoción</button>
                    </div>
                </form>
            </div>
        </div>
    `,

    combos: `
        <div class="header-actions">
            <h2>Gestión de Combos</h2>
            <button class="btn btn-primary" onclick="app.showComboModal()">
                <i class="ph ph-plus"></i> Nuevo Combo
            </button>
        </div>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Descuento</th>
                    <th>Productos Incluidos</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="combos-table-body">
                <!-- Dinámico -->
            </tbody>
        </table>

        <!-- Modal Combo -->
        <div id="combo-modal" class="modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:1000; align-items:center; justify-content:center; padding: 1rem;">
            <div class="module-form" style="background:#1e293b; padding:2rem; border-radius:8px; width:100%; max-width:600px; max-height:90vh; overflow-y:auto; box-shadow: 0 10px 25px rgba(0,0,0,0.5); position:relative;">
                <button class="close-btn" onclick="app.closeComboModal()" style="position:absolute; top:1rem; right:1rem; background:transparent; border:none; color:#fff; cursor:pointer; font-size:1.5rem;"><i class="ph ph-x"></i></button>
                <h3 id="combo-modal-title" style="margin-bottom: 1.5rem; color:#fff;">Nuevo Combo</h3>
                <form id="combo-form">
                    <input type="hidden" id="combo-id">
                    <div class="form-group">
                        <label style="color:#cbd5e1;">Nombre del Combo</label>
                        <input type="text" id="combo-name" required>
                    </div>
                    <div class="form-group">
                        <label style="color:#cbd5e1;">Descuento (%)</label>
                        <input type="number" id="combo-discount" min="0" max="100" value="10" required>
                    </div>
                    <div class="form-group">
                        <label style="color:#cbd5e1;">Seleccionar Productos</label>
                        <select id="combo-products" multiple size="6" style="width: 100%; padding: 0.5rem; border: 1px solid #3d4255; background: rgba(0,0,0,0.2); color: #fff; border-radius: 4px;">
                            <!-- Opciones cargadas dinámicamente -->
                        </select>
                        <small style="color: #888; display:block; margin-top:0.5rem;">Mantén presionado Ctrl (o Cmd en Mac) para seleccionar varios</small>
                    </div>
                    <div class="form-group">
                        <label style="color:#cbd5e1;">Imagen del Combo</label>
                        <input type="file" id="combo-image" accept="image/*">
                    </div>
                    <div class="form-group" style="display:flex; align-items:center; gap: 1rem; margin-bottom: 1.5rem; background: rgba(255,255,255,0.05); padding: 0.8rem; border-radius: 4px;">
                        <input type="checkbox" id="combo-active" style="width: auto;" checked>
                        <label for="combo-active" style="margin: 0; color:#cbd5e1;">Combo Activo</label>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%; padding:1rem; font-size:1.1rem; border-radius:4px; font-weight:bold;">Guardar Combo</button>
                </form>
            </div>
        </div>
    `,

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
    `,

    settings: `
        <div class="header-actions">
            <h2>Redes Sociales y WhatsApp</h2>
        </div>
        <div class="module-form">
            <form id="settings-form">
                <div class="form-group">
                    <label>Enlace de Facebook</label>
                    <input type="text" id="settings-facebook" placeholder="https://facebook.com/...">
                </div>
                <div class="form-group">
                    <label>Enlace de Instagram</label>
                    <input type="text" id="settings-instagram" placeholder="https://instagram.com/...">
                </div>
                <div class="form-group">
                    <label>Teléfono (Para mostrar en cabecera y pie de página)</label>
                    <input type="text" id="settings-phone" placeholder="Teléfono 300 000 00 00">
                </div>
                <div class="form-group">
                    <label>Ubicación (Para mostrar en cabecera y pie de página)</label>
                    <input type="text" id="settings-location" placeholder="Bogotá, Colombia">
                </div>
                <div class="form-group">
                    <label>Número de WhatsApp (con código de país, ej: 573000000000)</label>
                    <input type="text" id="settings-whatsapp-number" placeholder="573000000000">
                </div>
                <div class="form-group">
                    <label>Mensaje predeterminado de WhatsApp (botón flotante)</label>
                    <textarea id="settings-whatsapp-message" placeholder="¡Hola! Quisiera más información."></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Guardar Ajustes</button>
            </form>
        </div>
    `
};
