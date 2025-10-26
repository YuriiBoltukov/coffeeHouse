interface SliderState {
  index: number;
  autoSlideInterval: number | undefined;
}

export function initSlider(): void {
  const slider: HTMLElement | null = document.querySelector('.slider');
  if (!slider) return;

  const track: HTMLElement | null = slider.querySelector('.slider__track');
  const slides: HTMLElement[] = Array.from(slider.querySelectorAll('.slider__slide'));
  const prev: HTMLElement | null = slider.querySelector('.slider__arrow--prev');
  const next: HTMLElement | null = slider.querySelector('.slider__arrow--next');
  const dots: HTMLElement[] = Array.from(slider.querySelectorAll('.slider__dot'));

  const state: SliderState = {
    index: 0,
    autoSlideInterval: undefined
  };

  const autoSlideDelay: number = 5000;

  function update(): void {
    if (!track) return;
    const slideCount: number = slides.length;
    const translateX: number = state.index * (100 / slideCount);
    track.style.transform = `translateX(-${translateX}%)`;
    
    slides.forEach((slide: HTMLElement, i: number): void => {
      slide.classList.toggle('is-active', i === state.index);
    });
    
    dots.forEach((dot: HTMLElement, i: number): void => {
      dot.classList.toggle('is-active', i === state.index);
    });
  }

  function goTo(targetIndex: number): void {
    if (targetIndex < 0) {
      state.index = slides.length - 1;
    } else if (targetIndex >= slides.length) {
      state.index = 0;
    } else {
      state.index = targetIndex;
    }
    update();
  }

  function nextSlide(): void {
    goTo(state.index + 1);
  }

  function startAutoSlide(): void {
    state.autoSlideInterval = window.setInterval(nextSlide, autoSlideDelay);
  }

  function stopAutoSlide(): void {
    clearInterval(state.autoSlideInterval);
  }

  function handlePrevClick(): void {
    stopAutoSlide();
    goTo(state.index - 1);
    startAutoSlide();
  }

  function handleNextClick(): void {
    stopAutoSlide();
    goTo(state.index + 1);
    startAutoSlide();
  }

  function handleDotClick(index: number): void {
    stopAutoSlide();
    goTo(index);
    startAutoSlide();
  }

  if (prev) {
    prev.addEventListener('click', handlePrevClick);
  }

  if (next) {
    next.addEventListener('click', handleNextClick);
  }

  dots.forEach((dot: HTMLElement, i: number): void => {
    dot.addEventListener('click', (): void => {
      handleDotClick(i);
    });
  });

  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);

  update();
  startAutoSlide();
}


