// Type guards для проверки элементов

export function isHTMLElement(element: Element | null): element is HTMLElement {
  return element instanceof HTMLElement;
}

export function isHTMLImageElement(element: Element | null): element is HTMLImageElement {
  return element instanceof HTMLImageElement;
}

export function isHTMLButtonElement(element: Element | null): element is HTMLButtonElement {
  return element instanceof HTMLButtonElement;
}


