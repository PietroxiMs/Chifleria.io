/* =============================================
   CONFIGURACIÓN — EDITA AQUÍ
============================================= */
const WHATSAPP = '51974651216';

/* =============================================
   PRODUCTOS — edita, agrega o elimina aquí
============================================= */
const products = [
  // SALADOS
  { id: 1, name: "Chifles Salados", desc: "Plátano verde frito, sal de mar. 45g crujientes.", price: 10.0, img: "chifle_salado.jpeg", cat: "salado", popular: true, size: "12+1", hasCuts: true },
  { id: 2, name: "Chifles Salados", desc: "El clásico norteño en tamaño familiar. 1 kilo.", price: 20.0, img: "chifle_grande.jpeg", cat: "salado", popular: false, size: "1kg", hasCuts: true },
  { id: 3, name: "Chifles Picantes", desc: "Con ají amarillo y un toque de rocoto. 45g.", price: 10.0, img: "chifle_salado.jpeg", cat: "salado", popular: true, size: "12+1", hasCuts: true },
  { id: 4, name: "Chifles Picantes", desc: "Para los valientes del norte. Ají amarillo. 1 kilo.", price: 20.0, img: "chifle_grande.jpeg", cat: "salado", popular: false, size: "1kg", hasCuts: true },
  { id: 13, name: "Chifles de Tocino", desc: "Delicioso sabor ahumado a tocino. 45g.", price: 10.0, img: "chifle_salado.jpeg", cat: "salado", popular: false, size: "12+1", hasCuts: true },
  { id: 14, name: "Chifles al Ajo", desc: "Crujientes chifles con un toque de ajo tostado. 45g.", price: 10.0, img: "chifle_salado.jpeg", cat: "salado", popular: false, size: "12+1", hasCuts: true },
  { id: 15, name: "Chifles sabor Ceviche", desc: "El sabor bandera, cítrico y picantito. 45g.", price: 10.0, img: "chifle_salado.jpeg", cat: "salado", popular: true, size: "12+1", hasCuts: true },
  { id: 16, name: "Chifles Leche de Tigre", desc: "Intenso sabor norteño a leche de tigre. 45g.", price: 10.0, img: "chifle_salado.jpeg", cat: "salado", popular: false, size: "12+1", hasCuts: true },
  // DULCES
  { id: 5, name: "Chifles Dulces", desc: "Azúcar y canela sobre plátano verde frito. 45g.", price: 10.0, img: "chifle_dulce.jpeg", cat: "dulce", popular: true, size: "12+1", hasCuts: true },
  { id: 6, name: "Chifles Dulces", desc: "El antojo favorito de chicos y grandes. 1 kilo.", price: 20.0, img: "chifle_dulce.jpeg", cat: "dulce", popular: false, size: "1kg", hasCuts: true },
  { id: 7, name: "Cocoliche", desc: "Chifles bañados en coco rallado y chancaca. 45g.", price: 10.0, img: "cocoliche.jpeg", cat: "dulce", popular: true, size: "12+1" },
  { id: 8, name: "Maní Acaramelado", desc: "Maní tostado con caramelo artesanal. 45g.", price: 10.0, img: "mani_acaramelado.jpeg", cat: "dulce", popular: false, size: "12+1" },
  { id: 19, name: "Camote Frito", desc: "Hojuelas de camote crujientes y dulces.", price: 10.0, img: "camote.jpeg", cat: "especial", popular: false, size: "12+1" },
  // ESPECIALES
  { id: 9, name: "Arrocillo", desc: "Arroz frito crujiente con sal de mar y especias. 45g.", price: 10.0, img: "arrocillo.jpeg", cat: "especial", popular: false, size: "12+1" },
  { id: 10, name: "Orejas", desc: "Hojuelas de trigo fritas, crujientes y livianas. 45g.", price: 10.0, img: "orejas.jpeg", cat: "especial", popular: true, size: "12+1" },
  { id: 17, name: "Chifles con Carne Seca", desc: "El clásico piurano con trozos de carne seca. 45g.", price: 10.0, img: "chifle_con_carne_seca.jpeg", cat: "especial", popular: true, size: "12+1", hasCuts: true },
];

/* === ESTADO === */
let cart = {}, activeFilter = 'all', searchQuery = '', selectedPay = null;
let pedidoActual = null; 
let pendingItemId = null;
let selectedCorte = null;

/* =============================================
   GRID DE PRODUCTOS
============================================= */
function renderGrid() {
  const g = document.getElementById('grid');
  let visible = activeFilter === 'all' ? products : products.filter(p => p.cat === activeFilter);
  
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    visible = visible.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.desc.toLowerCase().includes(q)
    );
  }

  if (visible.length === 0) {
    g.innerHTML = `<div class="empty-search">No se encontraron productos que coincidan con "${searchQuery}"</div>`;
    return;
  }

  g.innerHTML = visible.map(p => `
    <div class="card">
      <div class="card-img-container">
        ${p.popular ? '<span class="badge-popular">⭐ Popular</span>' : ''}
        <img src="${p.img}" alt="${p.name}" class="product-img" onerror="this.src='https://via.placeholder.com/400x300?text=Chifles'">
      </div>
      <div class="card-body">
        <div class="card-tags-row">
          <div class="card-tag">${p.cat}</div>
          ${p.size ? `<div class="card-size">${p.size}</div>` : ''}
        </div>
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-footer">
          <span class="price">S/ ${p.price.toFixed(2)}</span>
          <div class="card-actions">
            <button class="share-btn" onclick="compartirProducto(${p.id})" title="Compartir">🔗</button>
            <button class="add-btn" onclick="addItem(${p.id})">+</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function filter(btn, cat) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active'); activeFilter = cat; renderGrid();
}

function handleSearch() {
  searchQuery = document.getElementById('search-input').value.trim();
  renderGrid();
}

/* =============================================
   CARRITO Y VARIANTES
============================================= */
function addItem(id) {
  const p = products.find(x => x.id === id);
  if (p.hasCuts) {
    pendingItemId = id;
    selectedCorte = null;
    document.querySelectorAll('#modal-corte .pay-opt').forEach(opt => opt.classList.remove('selected'));
    document.getElementById('confirmar-corte-btn').disabled = true;
    document.getElementById('modal-corte').classList.add('open');
  } else {
    addToCart(id);
  }
}

function selectCorte(corte) {
  selectedCorte = corte;
  document.getElementById('corte-redondo').classList.toggle('selected', corte === 'redondo');
  document.getElementById('corte-largo').classList.toggle('selected', corte === 'largo');
  document.getElementById('confirmar-corte-btn').disabled = false;
}

function confirmarCorte() {
  if (!pendingItemId || !selectedCorte) return;
  addToCart(pendingItemId, selectedCorte);
  closeModal('modal-corte');
  pendingItemId = null;
  selectedCorte = null;
}

function addToCart(id, variant = null) {
  const key = variant ? `${id}:${variant}` : `${id}`;
  cart[key] = (cart[key] || 0) + 1;
  updateCount();
  const p = products.find(x => x.id === id);
  showToast(`${p.name}${variant ? ' (' + variant + ')' : ''} añadido ✓`);
}

function updateCount() {
  document.getElementById('cart-count').textContent = Object.values(cart).reduce((a, b) => a + b, 0);
}

function openCart() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('overlay').classList.add('open');
  renderCart();
}

function closeCart() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

function renderCart() {
  const el = document.getElementById('drawer-items');
  const footer = document.getElementById('drawer-footer');
  const keys = Object.keys(cart).filter(k => cart[k] > 0);
  if (!keys.length) { el.innerHTML = '<div class="empty">Tu carrito está vacío</div>'; footer.style.display = 'none'; return; }
  footer.style.display = 'block';
  let subtotal = 0;
  el.innerHTML = keys.map(key => {
    const [id, variant] = key.split(':');
    const p = products.find(x => x.id == id); subtotal += p.price * cart[key];
    return `<div class="item">
      <div class="item-img-mini"><img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/100x100?text=C'"></div>
      <div class="item-info">
        <div class="item-name">${p.name} ${variant ? '<small>(' + variant + ')</small>' : ''}</div>
        <div class="item-price">S/ ${p.price.toFixed(2)} c/u</div>
      </div>
      <div class="item-qty">
        <button class="qty-btn" onclick="changeQty('${key}',-1)">−</button>
        <span class="qty-num">${cart[key]}</span>
        <button class="qty-btn" onclick="changeQty('${key}',1)">+</button>
      </div>
    </div>`;
  }).join('');
  renderTotales(subtotal);
}

function renderTotales(subtotal) {
  let html = `<div class="total-row final"><span class="total-label">Total</span><span class="total-val">S/ ${subtotal.toFixed(2)}</span></div>`;
  document.getElementById('total-rows').innerHTML = html;
}

function changeQty(key, delta) {
  cart[key] = (cart[key] || 0) + delta;
  if (cart[key] <= 0) delete cart[key];
  updateCount(); renderCart();
}

/* =============================================
   MÉTODOS DE PAGO
============================================= */
function selectPay(method) {
  selectedPay = method;
  ['yape', 'qr', 'wsp'].forEach(m => document.getElementById('opt-' + m).classList.toggle('selected', m === method));
  checkCheckout();
}

function checkCheckout() {
  const addr = document.getElementById('order-address').value.trim();
  const btn = document.getElementById('checkout-btn');
  if (selectedPay && addr.length > 0) {
    btn.disabled = false;
    btn.textContent = { yape: 'Pagar con Yape 💜', qr: 'Pagar con QR / Plin ⬛', wsp: 'Confirmar por WhatsApp 💬' }[selectedPay];
  } else {
    btn.disabled = true;
    if (!selectedPay) btn.textContent = 'Selecciona un método';
    else btn.textContent = 'Ingresa tu dirección';
  }
}

function checkout() {
  if (!selectedPay) return;
  if (selectedPay === 'yape') document.getElementById('modal-yape').classList.add('open');
  else if (selectedPay === 'qr') document.getElementById('modal-qr').classList.add('open');
  else sendWhatsApp();
}

function buildMsg() {
  const addr = document.getElementById('order-address').value.trim();
  const keys = Object.keys(cart).filter(k => cart[k] > 0);
  let msg = 'Hola! Quiero hacer un pedido de *El Cucharon Alteño* 🫙\n\n';
  let subtotal = 0;
  keys.forEach(key => { 
    const [id, variant] = key.split(':');
    const p = products.find(x => x.id == id); 
    msg += `• ${p.name} ${variant ? '(' + variant + ')' : ''} x${cart[key]} = S/ ${(p.price * cart[key]).toFixed(2)}\n`; 
    subtotal += p.price * cart[key]; 
  });
  msg += `\n*Total: S/ ${subtotal.toFixed(2)}*`;
  msg += `\n*Dirección:* ${addr}`;
  return msg;
}

function sendWhatsApp() {
  const msg = buildMsg();
  guardarPedidoYSeguir();
  window.open('https://api.whatsapp.com/send?phone=' + WHATSAPP + '&text=' + encodeURIComponent(msg), '_blank');
}

function sendComprobante() {
  const method = selectedPay === 'yape' ? 'Yape 💜' : 'QR/Plin ⬛';
  const msg = buildMsg() + `\n\nMétodo de pago: ${method}\n_(adjunto comprobante)_`;
  closeModal('modal-yape'); closeModal('modal-qr');
  guardarPedidoYSeguir();
  window.open('https://api.whatsapp.com/send?phone=' + WHATSAPP + '&text=' + encodeURIComponent(msg), '_blank');
}

/* =============================================
   SEGUIMIENTO DEL PEDIDO
============================================= */
function generarNumeroPedido() {
  const fecha = new Date();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `PED-${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}-${num}`;
}

function guardarPedidoYSeguir() {
  const keys = Object.keys(cart).filter(k => cart[k] > 0);
  let subtotal = 0;
  const items = keys.map(key => {
    const [id, variant] = key.split(':');
    const p = products.find(x => x.id == id);
    subtotal += p.price * cart[key];
    return { nombre: `${p.name}${variant ? ' (' + variant + ')' : ''}`, img: p.img, cantidad: cart[key], precio: p.price };
  });
  pedidoActual = {
    numero: generarNumeroPedido(),
    items,
    total: subtotal,
    metodoPago: selectedPay,
    hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
  };

  cart = {}; updateCount();
  document.getElementById('order-address').value = '';
  selectedPay = null;
  ['yape', 'qr', 'wsp'].forEach(m => document.getElementById('opt-' + m).classList.remove('selected'));
  checkCheckout();
  closeCart();
  setTimeout(() => abrirSeguimiento(), 400);
}

function abrirSeguimiento() {
  if (!pedidoActual) return;
  const stepsHtml = `<div class="tracking-step active">
      <div class="step-icon">🛵</div>
      <div class="step-info">
        <div class="step-title">En camino</div>
        <div class="step-desc">Tu pedido ha sido enviado a nuestro WhatsApp y pronto estará en tus manos 🫙</div>
      </div>
    </div>`;
  const itemsHtml = pedidoActual.items.map(i => `<img src="${i.img}" width="20" height="20" style="border-radius:4px;vertical-align:middle;margin-right:5px" onerror="this.src='https://via.placeholder.com/50x50?text=C'"> ${i.nombre} x${i.cantidad} — S/ ${(i.precio * i.cantidad).toFixed(2)}`).join('<br>');
  document.getElementById('seguimiento-contenido').innerHTML = `
    <div class="seguimiento-header">
      <h3>📦 Seguimiento de pedido</h3>
      <p>¡Gracias por tu compra en El Cucharon Alteño!</p>
      <div class="pedido-num">N° ${pedidoActual.numero}</div>
    </div>
    <div class="tracking-steps">${stepsHtml}</div>
    <div class="seguimiento-resumen">
      <div class="seguimiento-resumen-titulo">Resumen del pedido</div>
      <div class="seguimiento-resumen-items">${itemsHtml}</div>
      <div class="seguimiento-total">Total: S/ ${pedidoActual.total.toFixed(2)}</div>
    </div>
  `;
  document.getElementById('modal-seguimiento').classList.add('open');
}

function cerrarSeguimiento() {
  document.getElementById('modal-seguimiento').classList.remove('open');
}

/* =============================================
   UTILIDADES
============================================ */
function abrirWhatsAppDirecto() {
  window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent('Hola! Quisiera más información sobre los chifles de El Cucharon Alteño 🫙'), '_blank');
}

function compartirProducto(id) {
  const p = products.find(x => x.id === id);
  const texto = `🍟 *${p.name}* — S/ ${p.price.toFixed(2)}\nPídelos en El Cucharon Alteño: wa.me/${WHATSAPP}`;
  if (navigator.share) { navigator.share({ title: p.name, text: texto }); }
  else { navigator.clipboard.writeText(texto).then(() => showToast('Copiado al portapapeles ✓')); }
}

function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function showToast(msg) {
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

renderGrid();
