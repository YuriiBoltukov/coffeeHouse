export function initSlider(): void {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const track: HTMLElement | null = slider.querySelector('.slider__track');
  const slides: HTMLElement[] = Array.from(slider.querySelectorAll('.slider__slide'));
  const prev: HTMLElement | null = slider.querySelector('.slider__arrow--prev');
  const next: HTMLElement | null = slider.querySelector('.slider__arrow--next');
  const dots: HTMLElement[] = Array.from(slider.querySelectorAll('.slider__dot'));

  let index = 0;
  let autoSlideInterval: number | undefined;

  function update(): void {
    if (!track) return;
    track.style.transform = `translateX(-${index * (100 / slides.length)}%)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function goTo(i: number): void {
    if (i < 0) {
      index = slides.length - 1;
    } else if (i >= slides.length) {
      index = 0;
    } else {
      index = i;
    }
    update();
  }

  function nextSlide(): void {
    goTo(index + 1);
  }

  function startAutoSlide(): void {
    autoSlideInterval = window.setInterval(nextSlide, 5000);
  }

  function stopAutoSlide(): void {
    clearInterval(autoSlideInterval);
  }

  if (prev) {
    prev.addEventListener('click', () => {
      stopAutoSlide();
      goTo(index - 1);
      startAutoSlide();
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      stopAutoSlide();
      goTo(index + 1);
      startAutoSlide();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoSlide();
      goTo(i);
      startAutoSlide();
    });
  });

  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);

  update();
  startAutoSlide();
}


