// ============================================================================
// 1. Плавное появление секций при прокрутке — так же, как на других сайтах
// ============================================================================

const sections = document.querySelectorAll('.section');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
);

sections.forEach((section) => revealObserver.observe(section));

// ============================================================================
// 2. Мини-галерея в карточке товара — точки под фото и стрелочки по бокам
// переключают кадр
// ----------------------------------------------------------------------------
// Количество точек строим автоматически по числу фото в карточке — так
// добавить/убрать фото в HTML можно будет без правок в этом файле.
// ============================================================================

document.querySelectorAll('.product__gallery').forEach((gallery) => {
  const slides = [...gallery.querySelectorAll('.product__slide')];
  const dotsWrap = gallery.querySelector('.product__dots');
  const prevBtn = gallery.querySelector('.product__arrow--prev');
  const nextBtn = gallery.querySelector('.product__arrow--next');

  if (slides.length <= 1) {
    // Одно фото — ни точки, ни стрелочки не нужны, листать нечего
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    return;
  }

  let current = 0;
  const dots = [];

  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Фото ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
    dots.push(dot);
  });

  function goTo(index) {
    // Зацикливаем — после последнего фото "следующее" снова ведёт к первому
    current = (index + slides.length) % slides.length;
    slides.forEach((s) => s.classList.remove('is-active'));
    dots.forEach((d) => d.classList.remove('is-active'));
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
});

// ============================================================================
// 3. Переключатель варианта (пока только у "Любовь с первого взгляда" —
// шкатулка/свеча): меняет цену на карточке и текст заказа у кнопки "Заказать"
// ============================================================================

document.querySelectorAll('.product').forEach((product) => {
  const variants = product.querySelectorAll('.variant');
  if (!variants.length) return;

  const priceEl = product.querySelector('.product__price');

  variants.forEach((variant) => {
    variant.addEventListener('click', () => {
      variants.forEach((v) => v.classList.remove('is-active'));
      variant.classList.add('is-active');
      priceEl.textContent = variant.dataset.price;
      // Текст заказа у кнопки "Заказать" берём из самого варианта —
      // так в Telegram улетит сообщение именно с тем, что выбрали
      product.dataset.orderText = variant.dataset.order;
    });
  });
});

// ============================================================================
// 4. Кнопка "Заказать" — открывает личные сообщения в Telegram с уже
// готовым текстом (какую свечу хотят купить), чтобы покупателю не нужно
// было печатать это самому
// ============================================================================

document.querySelectorAll('.product__buy').forEach((btn) => {
  btn.addEventListener('click', () => {
    const product = btn.closest('.product');
    const text = encodeURIComponent(product.dataset.orderText || '');
    window.open(`https://t.me/anastexxx?text=${text}`, '_blank', 'noopener');
  });
});
