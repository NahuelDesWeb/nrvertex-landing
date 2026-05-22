with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace agenda.html with #form and add class cta-trigger
content = content.replace('href="agenda.html"', 'href="#form" class="cta-trigger"')

# Add the floating button and modal before </div>\n  <script type="module" src="/src/main.js"></script>
modal_html = """
    <!-- FLOATING CTA -->
    <a href="#form" class="floating-cta cta-trigger" id="floating-cta">
      <span class="material-symbols-outlined" style="font-size: 20px;">call</span> Agendá por WhatsApp
    </a>

    <!-- FORM MODAL -->
    <div class="form-modal-overlay" id="form-modal">
      <div class="form-modal-container">
        <button class="close-modal-btn" id="close-modal"><span class="material-symbols-outlined">close</span></button>
        <div class="form-header">
          <h2>Consigamos <span class="italic-accent">Más Clientes</span> Para Tu Negocio</h2>
          <p>Completá el formulario ahora para contactarte en menos de 12hs, asesorarte gratis y evaluar cuál es la mejor forma de ayudarte.</p>
        </div>
        <form id="wa-form" class="custom-form">
          <div class="form-group">
            <label>Nombre completo *</label>
            <input type="text" id="f_nombre" placeholder="Nombre Apellido" required>
          </div>
          <div class="form-group">
            <label>Email de negocios *</label>
            <input type="email" id="f_email" placeholder="nombre@empresa.com" required>
          </div>
          <div class="form-group">
            <label>Número de teléfono *</label>
            <input type="tel" id="f_tel" placeholder="11 1234-5678" required>
          </div>
          <div class="form-group">
            <label>Página web de tu negocio (opcional)</label>
            <input type="text" id="f_web" placeholder="www.minegocio.com">
          </div>
          
          <div class="form-group">
            <label>¿Sos el dueño de la empresa? *</label>
            <div class="radio-group">
              <label class="custom-radio">
                <input type="radio" name="f_dueno" value="Sí" required>
                <span class="radio-mark"></span> Sí
              </label>
              <label class="custom-radio">
                <input type="radio" name="f_dueno" value="No">
                <span class="radio-mark"></span> No
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>¿Cuál es tu principal objetivo con nuestros servicios? *</label>
            <textarea id="f_obj" placeholder="Conseguir más clientes potenciales, Aumentar el tráfico..." required></textarea>
          </div>

          <div class="form-group">
            <label>¿Cuál es tu presupuesto para alcanzar ese objetivo? *</label>
            <input type="text" id="f_presupuesto" placeholder="Tu presupuesto en Pesos Argentinos o Dólares" required>
          </div>

          <div class="form-group">
            <label>¿En qué plazo de tiempo querés alcanzar este objetivo? *</label>
            <div class="radio-group">
              <label class="custom-radio">
                <input type="radio" name="f_plazo" value="1 Mes" required>
                <span class="radio-mark"></span> 1 Mes
              </label>
              <label class="custom-radio">
                <input type="radio" name="f_plazo" value="3 Meses">
                <span class="radio-mark"></span> 3 Meses
              </label>
              <label class="custom-radio">
                <input type="radio" name="f_plazo" value="6 Meses">
                <span class="radio-mark"></span> 6 Meses
              </label>
            </div>
          </div>

          <p class="redirect-notice">Al enviar, serás redirigido a WhatsApp para finalizar.</p>
          <button type="submit" class="btn-primary submit-btn" style="width: 100%; margin-top: 10px;">Enviar y continuar en WhatsApp</button>
        </form>
      </div>
    </div>
"""

if 'id="form-modal"' not in content:
    content = content.replace('  </div>\n  <script type="module" src="/src/main.js"></script>', modal_html + '\n  </div>\n  <script type="module" src="/src/main.js"></script>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
