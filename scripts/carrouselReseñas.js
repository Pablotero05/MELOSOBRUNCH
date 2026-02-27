
  const track = document.querySelector('[data-landingsite-carousel]');
  const items = [...document.querySelectorAll('[data-landingsite-carousel-item]')];
  const prevBtn = document.querySelector('[data-landingsite-carousel-controls-left]');
  const nextBtn = document.querySelector('[data-landingsite-carousel-controls-right]');
  const dots = [...document.querySelectorAll('[data-landingsite-carousel-controls-index] li')];

  let currentIndex = 0;

  function goToSlide(index) {
    if (!track) return;
    const total = items.length;
    currentIndex = (index + total) % total; // bucle infinito
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
    updateDots();
  }

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.style.backgroundColor = i === currentIndex
        ? 'var(--primary-color)'
        : '#C9CECD';
    });
  }

  prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  // auto‑play opcional
  // setInterval(() => goToSlide(currentIndex + 1), 8000);

