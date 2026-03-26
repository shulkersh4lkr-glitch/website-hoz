const products = [
  { name: 'Набор керамической посуды', desc: 'Элегантно и удобно для любого стола', price: '1590₽', img: 'https://images.unsplash.com/photo-1601315375584-0c997f0855f1?auto=format&w=800&q=70' },
  { name: 'Деревянная разделочная доска', desc: 'Из дуба, устойчива к царапинам', price: '890₽', img: 'https://images.unsplash.com/photo-1598514983195-c3d3aaf7af30?auto=format&w=800&q=70' },
  { name: 'Набор кухонных ножей', desc: 'Сталь 420, комфортная рукоять', price: '2330₽', img: 'https://images.unsplash.com/photo-1556912991-3f638c357f2d?auto=format&w=800&q=70' },
  { name: 'Термокружка', desc: 'Сохраняет тепло до 8 часов', price: '720₽', img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&w=800&q=70' },
  { name: 'Комплект текстиля', desc: 'Салфетки + кухонные полотенца', price: '640₽', img: 'https://images.unsplash.com/photo-1590086782791-2f258572f9f1?auto=format&w=800&q=70' },
  { name: 'Декоративные свечи', desc: 'Аромат лаванды 4 шт.', price: '430₽', img: 'https://images.unsplash.com/photo-1543349687-8aab1f671063?auto=format&w=800&q=70' }
];

const cardsContainer = document.getElementById('cards');

products.forEach((product) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <img src="${product.img}" alt="${product.name}" loading="lazy" />
    <div class="card-content">
      <h3 class="card-title">${product.name}</h3>
      <p class="card-text">${product.desc}</p>
      <div>
        <span class="card-price">${product.price}</span>
        <button>В корзину</button>
      </div>
    </div>
  `;
  cardsContainer.appendChild(card);
});

window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  hero.style.backgroundPosition = `center ${Math.min(window.scrollY / 1.8, 120)}px`;
});
