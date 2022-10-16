export function deepEntries(
	object: Record<string, any>,
	conditionFn?: (key: string, value: any) => boolean
): [string, any][] {
	const keys = Object.keys(object);
	const entries: [key: string, value: any][] = [];

	for (const key of keys) {
		const value = object[key];
		entries.push([key, value]);

		if (typeof value === "object" && (!conditionFn || conditionFn(key, value))) {
			const subEntires = deepEntries(value, conditionFn);
			entries.push(...subEntires.map(([entryKey, value]) => [`${key}.${entryKey}`, value] as any));
		}
	}

	return entries;
}
