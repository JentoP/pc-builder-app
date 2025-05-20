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
        const data = await res.json()
        const imageUrl = data.images_results?.[0]?.thumbnail || null

        return NextResponse.json({ image: imageUrl })
    } catch (error) {
        console.error('SerpAPI image fetch error:', error)
        return NextResponse.json({ image: null }, { status: 500 })
    }
}
