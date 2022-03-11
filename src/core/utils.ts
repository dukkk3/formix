export function deepObjectEntries<T extends Record<string, any>>(
	object: T,
	conditionFn?: (key: string, value: any) => boolean
) {
	const entries: [key: string, value: any][] = [];
	const keys = Object.keys(object);

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

export function removeDuplicateElements<T>(array: T[]) {
	return [...new Set(array)];
}
