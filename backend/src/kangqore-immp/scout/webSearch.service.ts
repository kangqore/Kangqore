import logger from '../../utils/logger'

export interface SearchResult {
  title: string
  url: string
  snippet: string
  publishedAt?: string
}

export class WebSearchService {
  static async search(query: string, count = 5): Promise<SearchResult[]> {
    // Waterfall: try each configured provider in order, fall through on failure
    const keysConfigured: string[] = []
    if (process.env.BRAVE_SEARCH_API_KEY) {
      keysConfigured.push('Brave')
      const r = await this.brave(query, count).catch((e) => { logger.debug(`[KIMMP:SCOUT] Brave failed: ${e.message}`); return null })
      if (r) return r
    }
    if (process.env.SERPER_API_KEY) {
      keysConfigured.push('Serper')
      const r = await this.serper(query, count).catch((e) => { logger.debug(`[KIMMP:SCOUT] Serper failed: ${e.message}`); return null })
      if (r) return r
    }
    if (process.env.TAVILY_API_KEY) {
      keysConfigured.push('Tavily')
      const r = await this.tavily(query, count).catch((e) => { logger.debug(`[KIMMP:SCOUT] Tavily failed: ${e.message}`); return null })
      if (r) return r
    }
    if (keysConfigured.length === 0) {
      logger.warn('[KIMMP:SCOUT] No search API key configured — set BRAVE_SEARCH_API_KEY, SERPER_API_KEY, or TAVILY_API_KEY')
    } else {
      logger.debug(`[KIMMP:SCOUT] All providers failed (${keysConfigured.join(', ')}) — check API limits`)
    }
    return []
  }

  private static async brave(query: string, count: number): Promise<SearchResult[]> {
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}&search_lang=en`,
      { headers: { Accept: 'application/json', 'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY! } }
    )
    if (!res.ok) throw new Error(`Brave Search ${res.status}`)
    const data: any = await res.json()
    return (data.web?.results ?? []).map((r: any) => ({
      title:       String(r.title ?? ''),
      url:         String(r.url ?? ''),
      snippet:     String(r.description ?? ''),
      publishedAt: r.age ?? undefined,
    }))
  }

  private static async serper(query: string, count: number): Promise<SearchResult[]> {
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: { 'X-API-KEY': process.env.SERPER_API_KEY!, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query, num: count, gl: 'in', hl: 'en' }),
    })
    if (!res.ok) throw new Error(`Serper ${res.status}`)
    const data: any = await res.json()
    return (data.organic ?? []).map((r: any) => ({
      title:   String(r.title ?? ''),
      url:     String(r.link ?? ''),
      snippet: String(r.snippet ?? ''),
    }))
  }

  private static async tavily(query: string, count: number): Promise<SearchResult[]> {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: process.env.TAVILY_API_KEY, query, max_results: count }),
    })
    if (!res.ok) throw new Error(`Tavily ${res.status}`)
    const data: any = await res.json()
    return (data.results ?? []).map((r: any) => ({
      title:       String(r.title ?? ''),
      url:         String(r.url ?? ''),
      snippet:     String(r.content ?? '').slice(0, 300),
      publishedAt: r.published_date ?? undefined,
    }))
  }
}
