export function removeUnmountedElements<T extends Element>(elements: T[]) {
	return elements.filter((element) => document.body.contains(element));
}

export function isSelectElement(element: Element): element is HTMLSelectElement {
	return element.tagName.toLowerCase() === "select";
}

export function isTextAreaElement(element: Element): element is HTMLTextAreaElement {
	return element.tagName.toLocaleLowerCase() === "textarea";
}

export function isInputElement(element: Element): element is HTMLInputElement {
	return element.tagName.toLocaleLowerCase() === "input";
}
