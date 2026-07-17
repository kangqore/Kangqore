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
      logger.debug('[KIMMP:SCOUT] No search API key — using simulation mode (set BRAVE_SEARCH_API_KEY, SERPER_API_KEY, or TAVILY_API_KEY for live results)')
      return this.simulate(query, count)
    } else {
      logger.debug(`[KIMMP:SCOUT] All providers failed (${keysConfigured.join(', ')}) — check API limits`)
    }
    return []
  }

  static get activeProviders(): string[] {
    const p: string[] = []
    if (process.env.BRAVE_SEARCH_API_KEY)  p.push('Brave')
    if (process.env.SERPER_API_KEY)         p.push('Serper')
    if (process.env.TAVILY_API_KEY)         p.push('Tavily')
    if (p.length === 0)                     p.push('Simulation')
    return p
  }

  private static simulate(query: string, count: number): SearchResult[] {
    const words = query.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean)
    const seed   = words.slice(0, 3).join(' ')
    const topics = [
      { domain: 'economictimes.indiatimes.com',  pub: 'Economic Times' },
      { domain: 'livemint.com',                  pub: 'Livemint' },
      { domain: 'moneycontrol.com',              pub: 'Moneycontrol' },
      { domain: 'techcrunch.com',                pub: 'TechCrunch' },
      { domain: 'inc42.com',                     pub: 'Inc42' },
      { domain: 'business-standard.com',         pub: 'Business Standard' },
    ]
    const verbs    = ['accelerates', 'doubles down on', 'expands', 'pivots to', 'announces', 'signals']
    const contexts = ['amid rising demand', 'following Q4 results', 'in new partnership', 'with fresh funding', 'for enterprise growth']
    return topics.slice(0, count).map((t, i) => {
      const v = verbs[i % verbs.length]
      const c = contexts[i % contexts.length]
      const d = new Date(Date.now() - i * 3_600_000).toISOString()
      return {
        title:       `${seed.charAt(0).toUpperCase() + seed.slice(1)} ${v} ${c}`,
        url:         `https://${t.domain}/search?q=${encodeURIComponent(query)}`,
        snippet:     `${t.pub}: Market intelligence on "${query}" — analysis of latest developments, competitive signals, and strategic implications for enterprise teams. [Simulation mode — configure a search API key for live results]`,
        publishedAt: d,
      }
    })
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
