import {NextResponse} from 'next/server'
import {createClient} from '@/utils/supabase/server'

const imageCache = new Map<string, string>()

const typeKeywords: Record<string, string> = {
    cpu: 'CPU box',
    gpu: 'graphics card box',
    motherboard: 'motherboard box',
    ram: 'RAM stick',
    ssd: 'SSD',
    hdd: 'hard drive',
    psu: 'power supply unit',
    case: 'PC case',
    cooler: 'CPU cooler',
    monitor: 'monitor display',
    keyboard: 'keyboard',
    mouse: 'gaming mouse',
    default: ''
}

const tableMap: Record<string, string> = {
    cpu: "processors",
    gpu: "graphic_cards",
    motherboard: "motherboards",
    ram: "memory",
    ssd: "storage",
    hdd: "storage",
    psu: "power_supplies",
    case: "cases",
    cooler: "coolers",
    monitor: "monitors",
    keyboard: "keyboards",
    mouse: "mice"
}

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type')?.toLowerCase() || 'default'
    const tableName = tableMap[type] || "default_table"

    if (!query) {
        return NextResponse.json({error: 'Missing query'}, {status: 400})
    }

    const keyword = typeKeywords[type] || typeKeywords.default
    const searchQuery = `${query} ${keyword}`.trim()

    // In-memory cache check
    if (imageCache.has(searchQuery)) {
        return NextResponse.json({image: imageCache.get(searchQuery)})
    }

    const supabase = await createClient()

    // Supabase DB check first
    const {data: dbMatch, error: dbError} = await supabase
        .from(tableName)
        .select('image_url')
        .ilike('name', `%${query}%`)
        .maybeSingle()

    if (dbMatch?.image_url) {
        imageCache.set(searchQuery, dbMatch.image_url)
        return NextResponse.json({image: dbMatch.image_url})
    }

    // Fallback to SerpAPI
    const apiKey = process.env.SERPAPI_KEY
    if (!apiKey) {
        return NextResponse.json({error: 'Missing SerpAPI key'}, {status: 500})
    }

    const url = `https://serpapi.com/search?engine=google_images_light&q=${encodeURIComponent(searchQuery)}&tbm=isch&api_key=${apiKey}`

    try {
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error(`SerpAPI request failed: ${res.status}`)
        }

        const data = await res.json()

        interface ImageResult {
            original: string
            thumbnail: string
        }

        const images: ImageResult[] = data.images_results || []


        const imageUrl = images.find(img => img.original)?.original || images[0]?.thumbnail || null

        if (imageUrl) {
            imageCache.set(searchQuery, imageUrl)
        } else {
            console.warn(`No image found for: ${searchQuery}`)
        }

        return NextResponse.json({image: imageUrl})
    } catch (error) {
        console.error('Error fetching image:', error)
        return NextResponse.json({
            image: null,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, {status: 500})
    }
}