export function deepObjectEntries(
	object: Record<string, any>,
	conditionFn?: (key: string, value: any) => boolean
) {
	const keys = Object.keys(object);
	const entries: [key: string, value: any][] = [];

	for (const key of keys) {
		const value = object[key];

		entries.push([key, value]);

		if (typeof value === "object" && (!conditionFn || conditionFn(key, value))) {
			const subEntires = deepObjectEntries(value, conditionFn);

			entries.push(...subEntires.map(([entryKey, value]) => [`${key}.${entryKey}`, value] as any));
		}
	}

	return entries;
}

export function excludeProperties<T, K extends keyof T>(object: T, ...keys: K[]) {
	const entries = Object.entries(object) as [K, any][];
	const filteredEntries = entries.filter(([key]) => !keys.includes(key));

	return Object.fromEntries(filteredEntries) as Omit<T, K>;
}

export function pickProperties<T, K extends keyof T>(object: T, ...keys: K[]) {
	const entries = Object.entries(object) as [K, any][];
	const filteredEntries = entries.filter(([key]) => keys.includes(key));

	return Object.fromEntries(filteredEntries) as Pick<T, K>;
}

export function mergeRefs<E = Element>(...refs: (React.ForwardedRef<any> | null | undefined)[]) {
	const filteredRefs = refs.filter(Boolean);

	if (filteredRefs.length === 0) {
		return null;
	}

	return (instance: E | null) => {
		for (const ref of filteredRefs) {
			if (typeof ref === "function") {
				ref(instance);
			} else if (ref) {
				ref.current = instance;
			}
		}
	};
}

export function removeDuplicateElements<T>(array: T[]) {
	return Array.from(new Set(array));
}

export function removeUnusedElement<T extends Element>(elements: T[]) {
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

export function mergeCallbacks(...callbacks: (Function | null | undefined)[]) {
	const filteredCallbacks = callbacks.filter(Boolean) as Function[];

	if (filteredCallbacks.length === 0) {
		return null;
	}

	return (...args: any[]) => {
		for (const callback of filteredCallbacks) {
			callback(...args);
		}
	};
}

export function unflattenObject(
	object: Record<string, any>,
	getValue?: (sourceKey: string) => any
) {
	const result = {} as Record<string, any>;
	const keys = Object.keys(object);

	let temp: Record<string, any>;
	let substrings: string[];

	for (const key of keys) {
		substrings = key.split(".");
		temp = result;

		for (let i = 0; i < substrings.length - 1; i++) {
			const substring = substrings[i];

			if (!(substring in temp)) {
				if (Number.isFinite(substrings[i + 1])) {
					temp[substring] = [];
				} else {
					temp[substring] = {};
				}
			}

			temp = temp[substring];
		}

		temp[substrings[substrings.length - 1]] = getValue ? getValue(key) : object[key];
	}

	return result;
}
