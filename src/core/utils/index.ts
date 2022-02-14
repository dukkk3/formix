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
