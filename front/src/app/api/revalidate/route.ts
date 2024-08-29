import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')

  if (path) {
    try {
      revalidatePath(path)
      console.log(`Revalidated path: ${path}`)
      return NextResponse.json({ revalidated: true, now: Date.now() })
    } catch (error) {
      console.error(`Error revalidating path ${path}:`, error)
      return NextResponse.json(
        { revalidated: false, error: String(error) },
        { status: 500 },
      )
    }
  }

  return NextResponse.json(
    { revalidated: false, error: 'No path provided' },
    { status: 400 },
  )
}
