export enum Category {
  COFFEE = 'coffee',
  TEA = 'tea',
  DESSERT = 'dessert'
}

export enum Size {
  SMALL = 'S',
  MEDIUM = 'M',
  LARGE = 'L'
}

export enum CoffeeAdditive {
  SUGAR = 'sugar',
  CINNAMON = 'cinnamon',
  SYRUP = 'syrup'
}

export enum TeaAdditive {
  SUGAR = 'sugar',
  LEMON = 'lemon',
  SYRUP = 'syrup'
}

export enum DessertAdditive {
  BERRIES = 'berries',
  NUTS = 'nuts',
  JAM = 'jam'
}

export interface SizeData {
  size: Size;
  volume: string;
  text: string;
}

export interface AdditiveData {
  additive: string;
  name: CoffeeAdditive | TeaAdditive | DessertAdditive;
  text: string;
  label: string;
}

export interface MenuCard extends Element {
  getAttribute(name: 'data-category'): Category | null;
}

export interface SliderElements {
  track: HTMLElement | null;
  slides: HTMLElement[];
  prev: HTMLElement | null;
  next: HTMLElement | null;
  dots: HTMLElement[];
}

export interface BurgerMenuElements {
  burgerMenu: HTMLElement | null;
  mobileMenu: HTMLElement | null;
  mobileMenuLinks: NodeListOf<HTMLElement>;
}

export interface ModalData {
  image: HTMLImageElement;
  title: Element;
  description: Element;
  price: Element;
}

export interface PartialModalData extends Partial<ModalData> {
  category?: Category;
}

export interface PriceCalculator {
  calculatePrice(basePrice: number, size?: Size, additives?: number): number;
}

// API Types
export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: string | number; // API returns string, we convert to number
  discountPrice?: string | number;
  category: Category;
  image?: string; // May not be present in API response
  popular?: boolean;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiResponseWrapper {
  status?: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
}

export interface FetchOptions extends RequestInit {
  timeout?: number;
}

export * from './types/cart';
export * from './types/auth';


