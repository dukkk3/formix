import { useRef, useCallback, useLayoutEffect } from "react";

export function useEvent<T extends any[], R>(callback: (...args: T) => R): (...args: T) => R {
	const callbackRef = useRef<(...args: T) => R>(null!);

	useLayoutEffect(() => {
		callbackRef.current = callback;
	});

	return useCallback((...args: T): R => {
		return callbackRef.current(...args);
	}, []);
}
