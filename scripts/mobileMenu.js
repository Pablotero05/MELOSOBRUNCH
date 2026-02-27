  
  const toggleBtn = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      const isClosed = mobileMenu.classList.contains('max-h-0');

      if (isClosed) {
        mobileMenu.classList.remove('max-h-0');
        mobileMenu.classList.add('max-h-96'); // ajusta altura según necesites
        toggleBtn.setAttribute('aria-expanded', 'true');
      } else {
        mobileMenu.classList.remove('max-h-96');
        mobileMenu.classList.add('max-h-0');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
