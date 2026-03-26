const products = [
  { name: 'Пельмени домашние', desc: 'Сочные, из говядины и свинины, 900г', price: '1850₸', category: 'food' },
  { name: 'Набор керамической посуды', desc: 'Элегантно и удобно для любого стола', price: '7950₸', category: 'kitchen' },
  { name: 'Деревянная разделочная доска', desc: 'Из дуба, устойчива к царапинам', price: '4450₸', category: 'kitchen' },
  { name: 'Набор кухонных ножей', desc: 'Сталь 420, комфортная рукоять', price: '10950₸', category: 'kitchen' },
  { name: 'Термокружка', desc: 'Сохраняет тепло до 8 часов', price: '3400₸', category: 'kitchen' },
  { name: 'Комплект текстиля', desc: 'Салфетки + кухонные полотенца', price: '3020₸', category: 'decor' },
  { name: 'Декоративные свечи', desc: 'Аромат лаванды 4 шт.', price: '2015₸', category: 'decor' },
  { name: 'Многоразовая бутылка', desc: 'Для воды, 700 мл', price: '2100₸', category: 'kitchen' },
  { name: 'Умный термометр', desc: 'Контроль температуры на кухне', price: '6030₸', category: 'kitchen' },
  { name: 'Набор хрустальных бокалов', desc: 'Для винных вечеров', price: '8350₸', category: 'decor' },
  { name: 'Органайзер для столовых приборов', desc: 'Удобный и стильный', price: '2440₸', category: 'kitchen' },
  { name: 'Силиконовый коврик', desc: 'Защита от пятен и тепла', price: '1680₸', category: 'kitchen' },
  { name: 'Кухонная масса для выпекания', desc: 'Антипригарная поверхность', price: '4935₸', category: 'kitchen' }
];

const cardsContainer = document.getElementById('cards');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const themeToggle = document.getElementById('themeToggleCheckbox');
const cartOpenBtn = document.getElementById('cartOpenBtn');
const cartCloseBtn = document.getElementById('cartCloseBtn');
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsList = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
let cart = [];

// INIT THEME
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '☀️ Светлая';
  } else {
    document.body.classList.remove('dark-theme');
    themeToggle.textContent = '🌙 Тёмная';
  }
}

// THEME TOGGLE
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️ Светлая' : '🌙 Тёмная';
});

function renderProducts(list) {
  cardsContainer.innerHTML = '';
  if (list.length === 0) {
    document.getElementById('emptyMessage').classList.remove('hidden');
    return;
  }
  document.getElementById('emptyMessage').classList.add('hidden');

  list.forEach((product, index) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.category = product.category;
    card.style.animationDelay = `${index * 0.05}s`;
    card.innerHTML = `
      <div class="card-image">🏠</div>
      <div class="card-content">
        <h3 class="card-title">${product.name}</h3>
        <p class="card-text">${product.desc}</p>
        <div class="card-footer">
          <span class="card-price">${product.price}</span>
          <button class="basket-btn" type="button">В корзину</button>
        </div>
      </div>
    `;
    cardsContainer.appendChild(card);
    const basketBtn = card.querySelector('.basket-btn');
    basketBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(product);
      animateAddToCart(basketBtn);
    });
  });
  setupCardAnimation();
}

function setupCardAnimation() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  document.querySelectorAll('.card').forEach((card) => observer.observe(card));
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const filtered = products.filter((item) => {
    const textMatch = item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
    const categoryMatch = category === 'all' || item.category === category;
    return textMatch && categoryMatch;
  });
  renderProducts(filtered);
}

searchInput.addEventListener('input', applyFilters);
categoryFilter.addEventListener('change', applyFilters);

cartOpenBtn.addEventListener('click', () => openCart(true));
cartCloseBtn.addEventListener('click', () => openCart(false));
cartOverlay.addEventListener('click', () => openCart(false));

// Close cart on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cartPanel.classList.contains('open')) {
    openCart(false);
  }
});

renderProducts(products);

function updateCartUI() {
  cartItemsList.innerHTML = '';
  let total = 0;
  
  if (cart.length === 0) {
    cartItemsList.innerHTML = '<li style="padding: 20px; text-align: center; color: var(--text-light);">Корзина пуста</li>';
    cartTotalEl.textContent = '0 ₸';
    cartCountEl.textContent = '0';
    return;
  }

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <span>${item.name} x ${item.qty}</span>
      <button type="button" data-index="${index}">✕</button>
    `;
    const clickPrice = Number(item.price.replace(/[₸\s]/g, ''));
    total += clickPrice * item.qty;
    const removeBtn = li.querySelector('button');
    removeBtn.addEventListener('click', () => {
      cart.splice(index, 1);
      updateCartUI();
    });
    cartItemsList.appendChild(li);
  });
  
  cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  cartTotalEl.textContent = `${total} ₸`;
}

function openCart(isOpen) {
  cartPanel.classList.toggle('open', isOpen);
  cartOverlay.hidden = !isOpen;
  cartPanel.setAttribute('aria-hidden', (!isOpen).toString());
}

function addToCart(product) {
  const existing = cart.find((item) => item.name === product.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
}

function animateAddToCart(button) {
  const flyer = document.createElement('div');
  flyer.className = 'flyer';
  document.body.appendChild(flyer);

  const rectBtn = button.getBoundingClientRect();
  const rectCart = cartOpenBtn.getBoundingClientRect();

  flyer.style.left = `${rectBtn.left + rectBtn.width / 2 - 16}px`;
  flyer.style.top = `${rectBtn.top + rectBtn.height / 2 - 16}px`;

  const deltaX = rectCart.left + rectCart.width / 2 - (rectBtn.left + rectBtn.width / 2);
  const deltaY = rectCart.top + rectCart.height / 2 - (rectBtn.top + rectBtn.height / 2);

  flyer.style.setProperty('--fly-x', `${deltaX}px`);
  flyer.style.setProperty('--fly-y', `${deltaY}px`);

  flyer.addEventListener('animationend', () => {
    flyer.remove();
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateCartUI();
});
