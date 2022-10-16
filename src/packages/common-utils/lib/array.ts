export function removeDuplicates<T>(array: T[]): T[] {
	return Array.from<T>(new Set(array));
}
