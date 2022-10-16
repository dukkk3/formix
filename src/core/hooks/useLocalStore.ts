import { useLocalObservable } from "mobx-react-lite";

export function useLocalStore<T extends object>(schema: T): T {
	return useLocalObservable(() => schema);
}
