import { useLocalObservable } from "mobx-react-lite";

import { storeSchema } from "@core/helpers";

export function useLocalStore<T extends Record<string, any>>(schema: T) {
	const localStore = useLocalObservable(() => storeSchema(schema));

	return localStore;
}
