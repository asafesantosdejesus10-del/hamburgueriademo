// Edite esta lista para personalizar o cardápio e os preços.
const products = {
  burgers: [
    { name: 'Clássico da Casa', description: 'Hambúrguer grelhado, queijo derretido, alface e tomate no pão tostado.', price: 'R$ 29,90', image: 'assets/burger-hero.webp' },
    { name: 'Duplo Dourado', description: 'Dois hambúrgueres, queijo, picles e molho da casa.', price: 'R$ 36,90', image: 'assets/burger-double.webp' },
    { name: 'Veggie da Vez', description: 'Hambúrguer vegetal, folhas frescas e molho no pão com gergelim.', price: 'R$ 31,90', image: 'assets/burger-veg.webp' }
  ],
  entradas: [
    { name: 'Batata Crocante', description: 'Batatas douradas com molho para acompanhar.', price: 'R$ 15,90', image: 'assets/fries.webp' },
    { name: 'Anéis de Cebola', description: 'Anéis empanados servidos com molho.', price: 'R$ 17,90', image: 'assets/onion-rings.webp' },
    { name: 'Batata com Molho', description: 'Porção para dividir com um molho à escolha.', price: 'R$ 21,90', image: 'assets/fries.webp' }
  ],
  adicionais: [
    { name: 'Queijo Extra', description: 'Uma fatia de queijo para acrescentar ao hambúrguer.', price: 'R$ 4,00', image: 'assets/cheese-extra.png', imageClass: 'contain-image', alt: 'Uma fatia de queijo cheddar' },
    { name: 'Bacon Crocante', description: 'Tiras crocantes para acrescentar ao hambúrguer.', price: 'R$ 6,00', image: 'assets/bacon.webp' },
    { name: 'Molho Especial', description: 'Porção individual para acompanhar seu pedido.', price: 'R$ 3,50', image: 'assets/molho-especial.png', alt: 'Molho cremoso servido em uma tigela' }
  ],
  bebidas: [
    { name: 'Refrigerante', description: 'Refrigerante com gelo, servido bem gelado.', price: 'R$ 7,00', image: 'assets/soda.webp' },
    { name: 'Limonada', description: 'Limonada com gelo e um toque de alecrim.', price: 'R$ 9,50', image: 'assets/lemonade.webp' },
    { name: 'Milk-shake', description: 'Milk-shake cremoso com cobertura de chocolate.', price: 'R$ 16,90', image: 'assets/milkshake.webp' }
  ],
  sobremesas: [
    { name: 'Brownie com Sorvete', description: 'Brownie de chocolate servido com sorvete e calda.', price: 'R$ 15,90', image: 'assets/brownie.webp' },
    { name: 'Sorvete com Frutas', description: 'Sorvete cremoso com calda de frutas vermelhas.', price: 'R$ 12,90', image: 'assets/ice-cream.webp' },
    { name: 'Taça de Sorvete', description: 'Duas bolas de sorvete servidas na taça.', price: 'R$ 14,90', image: 'assets/ice-cream-cup.webp' }
  ]
};

// Atualize o link de pedido demonstrativo https://exemplo.com/delivery no HTML.
const grid = document.querySelector('#product-grid');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealObserver = null;
function observeReveals(elements) {
  [...elements].forEach((element, index) => {
    element.classList.add('reveal-item');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 75}ms`);
    if (prefersReducedMotion) element.classList.add('is-visible');
    else revealObserver?.observe(element);
  });
}

function showProducts(category) {
  grid.innerHTML = products[category].map((item) => `
    <article class="product-card">
      <div class="product-image ${item.imageClass || ''}"><img loading="lazy" decoding="async" src="${item.image}" alt="${item.alt || item.name}" /></div>
      <div class="product-info"><h3>${item.name}</h3><p>${item.description}</p><div class="product-bottom"><span class="product-price">${item.price}</span><a class="product-order" href="https://exemplo.com/delivery">Pedir <svg class="icon icon-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M10 5h9v9"/></svg></a></div></div>
    </article>`).join('');
  observeReveals(grid.querySelectorAll('.product-card'));
}
showProducts('burgers');
document.querySelectorAll('.category-tab').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelector('.category-tab.active')?.classList.remove('active');
  tab.classList.add('active');
  showProducts(tab.dataset.category);
}));

// Slides: controles laterais e indicadores.
const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('.dot')];
const heroVideo = document.querySelector('#hero-video');
let currentSlide = 0;
function softenVideoLoop() {
  if (!heroVideo || heroVideo.paused || prefersReducedMotion) return;
  const duration = heroVideo.duration;
  const edgeFade = 0.18;
  let opacity = 1;
  if (Number.isFinite(duration) && duration > 0) {
    if (heroVideo.currentTime < edgeFade) opacity = heroVideo.currentTime / edgeFade;
    else if (duration - heroVideo.currentTime < edgeFade) opacity = (duration - heroVideo.currentTime) / edgeFade;
  }
  heroVideo.style.opacity = String(Math.max(0, Math.min(1, opacity)));
  const requestFrame = heroVideo.requestVideoFrameCallback
    ? (callback) => heroVideo.requestVideoFrameCallback(callback)
    : (callback) => window.requestAnimationFrame(callback);
  requestFrame(softenVideoLoop);
}
heroVideo?.addEventListener('play', softenVideoLoop);
heroVideo?.addEventListener('pause', () => { heroVideo.style.opacity = '1'; });

function setSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => { slide.classList.toggle('is-active', i === currentSlide); slide.setAttribute('aria-hidden', String(i !== currentSlide)); });
  dots.forEach((dot, i) => { dot.classList.toggle('is-active', i === currentSlide); dot.setAttribute('aria-selected', String(i === currentSlide)); });
  if (currentSlide === 0 && !prefersReducedMotion) heroVideo?.play().catch(() => {});
  else heroVideo?.pause();
}
document.querySelector('.slide-prev').addEventListener('click', () => setSlide(currentSlide - 1));
document.querySelector('.slide-next').addEventListener('click', () => setSlide(currentSlide + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => setSlide(i)));
if (!prefersReducedMotion) heroVideo?.play().catch(() => {});
document.addEventListener('visibilitychange', () => {
  if (!heroVideo || prefersReducedMotion) return;
  if (document.hidden) heroVideo.pause();
  else if (currentSlide === 0) heroVideo.play().catch(() => {});
});

// Menu compacto para celular.
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  nav.classList.toggle('is-open', open);
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  nav.classList.remove('is-open');
}));

// Reveals sutis para o conteúdo entrar conforme cada seção chega à tela.
const revealTargets = document.querySelectorAll('.info-strip > div, .section-heading, .about-visual, .about-copy, .location-layout > *, .social-grid > a, .footer-main > *, .footer-bottom > *');
observeReveals(revealTargets);
if (prefersReducedMotion) {
  document.querySelectorAll('.reveal-item').forEach((element) => element.classList.add('is-visible'));
} else if ('IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal-item').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal-item').forEach((element) => element.classList.add('is-visible'));
}
