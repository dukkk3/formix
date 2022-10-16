import { useEvent } from "./useEvent";
import { common } from "../../packages/common-utils";

export function useDebounce<T extends any[]>(callback: (...args: T) => void, time: number) {
	return useEvent(common.debounce(callback, time));
}
