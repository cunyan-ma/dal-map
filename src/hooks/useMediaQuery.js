import { useCallback, useSyncExternalStore } from 'react'

// matchMedia hook that stays in sync as the viewport / orientation changes.
// Backed by useSyncExternalStore so the media query list is the source of
// truth (no setState-in-effect resync).
export function useMediaQuery(query) {
    const subscribe = useCallback((callback) => {
        const mql = window.matchMedia(query)
        mql.addEventListener('change', callback)
        return () => mql.removeEventListener('change', callback)
    }, [query])

    const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

    return useSyncExternalStore(subscribe, getSnapshot)
}

// True on the small/touch layout — matches the 900px CSS breakpoint used
// throughout the components so JS and CSS agree on what "mobile" means.
export function useIsMobile() {
    return useMediaQuery('(max-width: 900px)')
}
