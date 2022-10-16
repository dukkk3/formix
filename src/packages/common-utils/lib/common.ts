export function isFunction(value: any): value is Function {
	return typeof value === "function";
}

export function debounce<T extends any[]>(
	callback: (...args: T) => void,
	time: number
): (...args: T) => void {
	let timeout: any;

	if (time <= 0) return callback;

	return function (this: any, ...args: any[]) {
		const effect = () => {
			timeout = null;
			return callback.apply(this, args as unknown as any);
		};

		clearTimeout(timeout);

		timeout = setTimeout(effect, time);
	};
}

export function isArray(value: any): value is Array<any> {
	return Array.isArray(value);
}

export function mergeRefs<E extends Element>(
	...refs: (React.ForwardedRef<any> | null | undefined)[]
): ((element: E | null) => void) | undefined {
	const filteredRefs = refs.filter(Boolean);

	if (filteredRefs.length === 0) {
		return undefined;
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

const emptyFunction = () => {};

export function mergeCallbacks(
	...callbacks: (Function | null | undefined)[]
): (...args: any[]) => void {
	const filteredCallbacks = callbacks.filter(Boolean) as Function[];

	if (filteredCallbacks.length === 0) {
		return emptyFunction;
	}

	return (...args: any[]) => {
		for (const callback of filteredCallbacks) {
			callback(...args);
		}
	};
}

export function convertToNumber(numberOrString: string | number | undefined): number {
	return typeof numberOrString === "string"
		? safeNumber(Number(numberOrString.replace(",", ".").replace(/[^\d.]+/, "")))
		: safeNumber(numberOrString);
}

export function safeNumber(number: any): number {
	number = Number(number);
	return !Number.isFinite(number) ? 0 : (number as number);
}
