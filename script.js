// The Cozy Table — State & Drawer Interaction
const cart = [];
const el = (id) => document.getElementById(id);

const drawer = el('cartDrawer'), backdrop = el('cartBackdrop');
if (drawer && backdrop) {
  const toggleCart = (open) => {
    drawer.classList.toggle('active', open);
    backdrop.classList.toggle('active', open);
  };

  if (el('openCartBtn')) el('openCartBtn').onclick = () => toggleCart(true);
  if (el('closeCartBtn')) el('closeCartBtn').onclick = () => toggleCart(false);
  backdrop.onclick = () => toggleCart(false);
}

document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
  btn.onclick = () => {
    const id = btn.dataset.id, name = btn.dataset.name, price = +btn.dataset.price;
    const item = cart.find(i => i.id === id);
    if (item) item.qty++;
    else cart.push({ id, name, price, qty: 1 });
    renderCart();

    const orig = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="check" style="width:14px;height:14px"></i> Added!';
    if (window.lucide) lucide.createIcons();
    setTimeout(() => { btn.innerHTML = orig; if (window.lucide) lucide.createIcons(); }, 1200);

    const badge = el('cartCountBadge');
    if (badge) {
      badge.style.transform = 'scale(1.3)';
      setTimeout(() => badge.style.transform = 'scale(1)', 200);
    }
  };
});

function updateQty(id, delta) {
  const i = cart.find(x => x.id === id);
  if (!i) return;
  i.qty += delta;
  if (i.qty <= 0) cart.splice(cart.indexOf(i), 1);
  renderCart();
}

function renderCart() {
  const badge = el('cartCountBadge');
  if (badge) badge.textContent = cart.reduce((s, i) => s + i.qty, 0);

  const list = el('cartItemsList');
  if (!list) return;

  if (!cart.length) {
    list.innerHTML = '<p class="empty-cart-msg">Your cozy table order is empty.<br>Explore our menu to add comfort dishes!</p>';
    if (el('cartSubtotal')) el('cartSubtotal').textContent = el('cartTax').textContent = el('cartTotal').textContent = '$0.00';
    return;
  }

  list.innerHTML = cart.map(i => `
    <div class="cart-item-row">
      <div class="cart-item-info">
        <h4>${i.name}</h4>
        <span>$${i.price.toFixed(2)} each</span>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn" onclick="updateQty('${i.id}', -1)" aria-label="Decrease">&minus;</button>
        <span style="font-weight:600;min-width:18px;text-align:center">${i.qty}</span>
        <button class="qty-btn" onclick="updateQty('${i.id}', 1)" aria-label="Increase">&plus;</button>
      </div>
    </div>
  `).join('');

  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = sub * 0.08;
  if (el('cartSubtotal')) el('cartSubtotal').textContent = `$${sub.toFixed(2)}`;
  if (el('cartTax')) el('cartTax').textContent = `$${tax.toFixed(2)}`;
  if (el('cartTotal')) el('cartTotal').textContent = `$${(sub + tax).toFixed(2)}`;
}

const modal = el('arcModalBackdrop');
function showModal(title, msg) {
  if (!modal) {
    alert(title + ": " + msg);
    return;
  }
  el('arcModalTitle').textContent = title;
  el('arcModalBody').textContent = msg;
  modal.classList.add('active');
}
if (el('arcModalCloseBtn')) el('arcModalCloseBtn').onclick = () => modal.classList.remove('active');
if (modal) modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

const checkoutBtn = el('checkoutBtn');
if (checkoutBtn) {
  checkoutBtn.onclick = () => {
    if (!cart.length) return showModal('Cart is Empty', 'Please add at least one dish before checkout.');
    const total = el('cartTotal').textContent;
    cart.length = 0;
    renderCart();
    toggleCart(false);
    showModal('Order Received!', `Thank you for dining with The Cozy Table! Your total is ${total}. Preparing with care.`);
  };
}

// Universal Form Submissions across pages
['contactForm', 'contactPageForm', 'signupForm', 'signinForm', 'reviewForm', 'reportForm', 'donationForm'].forEach(formId => {
  const f = el(formId);
  if (f) {
    f.onsubmit = (e) => {
      e.preventDefault();
      f.reset();
      showModal('end of the code', 'this website has been made for project purposes only.');
    };
  }
});

const pills = document.querySelectorAll('.filter-pill');
const cards = document.querySelectorAll('.compact-menu-grid .bento-card');
pills.forEach(p => {
  p.onclick = () => {
    pills.forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    const f = p.dataset.filter;
    if (!f) return;
    cards.forEach(c => c.style.display = (f === 'all' || c.dataset.category === f) ? 'flex' : 'none');
  };
});

renderCart();
if (window.lucide) lucide.createIcons();