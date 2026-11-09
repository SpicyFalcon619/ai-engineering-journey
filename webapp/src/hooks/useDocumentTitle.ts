import { useEffect } from 'react'

const BASE_TITLE = 'AI Engineering Field Guide'

// Gives every page its own browser-tab title (and so its own history/bookmark
// entry) instead of the same static one everywhere.
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE_TITLE}` : BASE_TITLE
    return () => {
      document.title = BASE_TITLE
    }
  }, [title])
}
