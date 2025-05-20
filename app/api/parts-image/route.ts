import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
        return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }

    const apiKey = process.env.SERPAPI_KEY
    if (!apiKey) {
        return NextResponse.json({ error: 'Missing SerpAPI key' }, { status: 500 })
    }

    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query + ' CPU')}&tbm=isch&api_key=${apiKey}`

    try {
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error(`SerpAPI request failed: ${res.status}`)
        }
        
        const data = await res.json()
        
        // Try to find the best image available
        const images = data.images_results || []
        // @ts-ignore
        const imageUrl = images.find(img => img.original?.includes('jpg') || img.original?.includes('png'))?.original
            || images[0]?.thumbnail || null

        if (!imageUrl) {
            console.warn('No suitable image found for query:', query)
        }

        return NextResponse.json({ image: imageUrl })
    } catch (error) {
        console.error('Error fetching image:', error)
        return NextResponse.json({ 
            image: null,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
