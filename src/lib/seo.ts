import { useEffect } from 'react'

export const SITE_NAME = 'Prajahita'

type PageMeta = {
  /** Omit to leave the current title untouched (another component owns it). */
  title?: string
  description?: string
  /** Path such as "/shop". Used for the canonical URL and og:url. */
  path?: string
  /** Optional JSON-LD object (e.g. a schema.org Product). Replaced on every change. */
  jsonLd?: Record<string, unknown> | null
  noindex?: boolean
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Keeps <title>, description, canonical, Open Graph and JSON-LD in sync with the current page. */
export function usePageMeta({ title, description, path, jsonLd, noindex }: PageMeta) {
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    if (title) {
      document.title = title
      upsertMeta('property', 'og:title', title)
    }
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    if (description) {
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:description', description)
    }

    if (path !== undefined) {
      const url = `${window.location.origin}${path}`
      upsertCanonical(url)
      upsertMeta('property', 'og:url', url)
    }
  }, [title, description, path, noindex])

  useEffect(() => {
    const id = 'page-jsonld'
    document.getElementById(id)?.remove()
    if (!jsonLdText) return

    const script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    script.textContent = jsonLdText
    document.head.appendChild(script)
    return () => script.remove()
  }, [jsonLdText])
}
