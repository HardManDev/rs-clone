function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  props: {
    [key: string]: string
    | number
    | boolean
    | object
    | EventListenerOrEventListenerObject
  } = {},
  children: Array<Element | Text> = [],
): HTMLElementTagNameMap[K] {
  const domElement = document.createElement(tagName);

  Object.entries(props)
    .forEach(([key, value]) => {
      if (value instanceof Function) {
        const type = key.startsWith('on')
          ? key.split('on')[1]
          : key;

        domElement.addEventListener(type.toLowerCase(), value);
        return;
      }

      if (typeof value === 'boolean') {
        if (value) {
          domElement.setAttribute(key, '');
        }
        return;
      }

      domElement.setAttribute(key, value.toString());
    });

  children.forEach((child) => {
    domElement.appendChild(child);
  });

  return domElement;
}

export default createElement;
