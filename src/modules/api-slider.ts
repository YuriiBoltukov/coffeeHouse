import { productsService, ApiProduct } from '../api';

export class ApiSliderService {
  private sliderTrack: HTMLElement | null;
  private sliderDots: HTMLElement | null;
  private sliderLoading: HTMLElement | null;
  private sliderContainer: HTMLElement | null;

  constructor() {
    this.sliderTrack = document.querySelector('.slider__track');
    this.sliderDots = document.querySelector('.slider__dots');
    this.sliderLoading = document.querySelector('.slider-loading');
    this.sliderContainer = document.querySelector('.slider');
  }

  private showLoading(): void {
    if (this.sliderLoading) {
      this.sliderLoading.style.display = 'block';
    }
    if (this.sliderContainer) {
      this.sliderContainer.style.display = 'none';
    }
  }

  private hideLoading(): void {
    if (this.sliderLoading) {
      this.sliderLoading.style.display = 'none';
    }
    if (this.sliderContainer) {
      this.sliderContainer.style.display = 'block';
    }
  }

  private convertPrice(price: string | number): number {
    if (typeof price === 'string') {
      return parseFloat(price);
    }
    return price;
  }

  private formatPrice(price: string | number): string {
    const priceNum = this.convertPrice(price);
    return `$${priceNum.toFixed(2)}`;
  }

  private getImageUrl(product: ApiProduct): string {
    if (product.image) {
      return product.image;
    }
    
    const imageId = (product.id % 3) + 1;
    return `assets/images/coffee-slider-${imageId}.png`;
  }

  private createSliderSlide(product: ApiProduct): HTMLElement {
    const slide: HTMLElement = document.createElement('div');
    slide.className = 'slider__slide';

    const image: HTMLImageElement = document.createElement('img');
    image.src = this.getImageUrl(product);
    image.alt = product.name;

    const info: HTMLElement = document.createElement('div');
    info.className = 'slider__info';

    const name: HTMLElement = document.createElement('h3');
    name.className = 'slider__name';
    name.textContent = product.name;

    const description: HTMLElement = document.createElement('p');
    description.className = 'slider__description';
    description.textContent = product.description;

    const price: HTMLElement = document.createElement('span');
    price.className = 'slider__price';
    
    if (product.discountPrice) {
      price.textContent = this.formatPrice(product.discountPrice);
    } else {
      price.textContent = this.formatPrice(product.price);
    }

    info.appendChild(name);
    info.appendChild(description);
    info.appendChild(price);

    slide.appendChild(image);
    slide.appendChild(info);

    return slide;
  }

  private createSliderDot(index: number, isActive: boolean): HTMLElement {
    const dot: HTMLElement = document.createElement('button');
    dot.className = `slider__dot ${isActive ? 'is-active' : ''}`;
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    dot.setAttribute('aria-controls', `slide-${index + 1}`);

    return dot;
  }

  private renderSlides(products: ApiProduct[]): void {
    if (!this.sliderTrack) return;

    this.sliderTrack.innerHTML = '';
    products.forEach((product: ApiProduct, index: number): void => {
      const slide: HTMLElement = this.createSliderSlide(product);
      if (index === 0) {
        slide.classList.add('is-active');
      }
      this.sliderTrack?.appendChild(slide);
    });

    this.renderDots(products);
  }

  private renderDots(products: ApiProduct[]): void {
    if (!this.sliderDots) return;

    this.sliderDots.innerHTML = '';
    products.forEach((_: ApiProduct, index: number): void => {
      const dot: HTMLElement = this.createSliderDot(index, index === 0);
      this.sliderDots?.appendChild(dot);
    });
  }

  async loadFavoriteProducts(): Promise<void> {
    try {
      this.showLoading();
      
      const products: ApiProduct[] = await productsService.getFavoriteProducts();
      this.renderSlides(products);
      
      this.initSliderControls();
      
      this.hideLoading();
    } catch (error) {
      console.error('Error loading favorite products:', error);
      
      this.showError();
    }
  }

  private showError(): void {
    this.hideLoading();
    
    if (this.sliderLoading) {
      const errorMessage: HTMLElement = document.createElement('div');
      errorMessage.style.textAlign = 'center';
      errorMessage.style.padding = '60px 20px';
      errorMessage.innerHTML = `
                <div style="color: #dc3545; font-size: 18px; margin-bottom: 10px;">Something went wrong.</div>
                <div style="color: #6c757d; font-size: 14px;">Please refresh the page</div>
      `;
      
      this.sliderLoading.innerHTML = '';
      this.sliderLoading.appendChild(errorMessage);
      this.sliderLoading.style.display = 'block';
    }
  }

  private initSliderControls(): void {
    const slider: HTMLElement | null = document.querySelector('.slider');
    if (!slider) return;

    const track: HTMLElement | null = slider.querySelector('.slider__track');
    const slides: HTMLElement[] = Array.from(slider.querySelectorAll('.slider__slide'));
    const prev: HTMLElement | null = slider.querySelector('.slider__arrow--prev');
    const next: HTMLElement | null = slider.querySelector('.slider__arrow--next');
    const dots: HTMLElement[] = Array.from(slider.querySelectorAll('.slider__dot'));

    if (!slides.length) return;

    let currentIndex: number = 0;
    let autoSlideInterval: number | undefined;
    const autoSlideDelay: number = 5000;

    function updateSlider(): void {
      if (!track) return;
      const slideCount: number = slides.length;
      const translateX: number = currentIndex * (100 / slideCount);
      track.style.transform = `translateX(-${translateX}%)`;
      
      slides.forEach((slide: HTMLElement, i: number): void => {
        slide.classList.toggle('is-active', i === currentIndex);
      });
      
      dots.forEach((dot: HTMLElement, i: number): void => {
        dot.classList.toggle('is-active', i === currentIndex);
      });
    }

    function goToSlide(targetIndex: number): void {
      if (targetIndex < 0) {
        currentIndex = slides.length - 1;
      } else if (targetIndex >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = targetIndex;
      }
      updateSlider();
    }

    function nextSlide(): void {
      goToSlide(currentIndex + 1);
    }

    function startAutoSlide(): void {
      autoSlideInterval = window.setInterval(nextSlide, autoSlideDelay);
    }

    function stopAutoSlide(): void {
      clearInterval(autoSlideInterval);
    }

    function handlePrevClick(): void {
      stopAutoSlide();
      goToSlide(currentIndex - 1);
      startAutoSlide();
    }

    function handleNextClick(): void {
      stopAutoSlide();
      goToSlide(currentIndex + 1);
      startAutoSlide();
    }

    function handleDotClick(index: number): void {
      stopAutoSlide();
      goToSlide(index);
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

    updateSlider();
    startAutoSlide();
  }

  async init(): Promise<void> {
    await this.loadFavoriteProducts();
  }
}

export const apiSliderService = new ApiSliderService();

