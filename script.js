(() => {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const track = slider.querySelector('.slider__track');
  const slides = Array.from(slider.querySelectorAll('.slider__slide'));
  const prev = slider.querySelector('.slider__arrow--prev');
  const next = slider.querySelector('.slider__arrow--next');
  const dots = Array.from(slider.querySelectorAll('.slider__dot'));

  let index = 0;

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  prev?.addEventListener('click', () => goTo(index - 1));
  next?.addEventListener('click', () => goTo(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  update();
})();

// Menu button functionality
(() => {
  const menuButton = document.querySelector('.menu-button');
  if (!menuButton) return;

  menuButton.addEventListener('click', () => {
    // You can change this URL to the page you want to navigate to
    window.location.href = 'menu.html';
  });
})();


