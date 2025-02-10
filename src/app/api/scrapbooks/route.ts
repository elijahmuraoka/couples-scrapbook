import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { title } = await request.json()
        
        // Generate a random 6-character code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase()
        
        const { data, error } = await supabase
            .from('scrapbooks')
            .insert([
                { 
                    title,
                    code,
                }
            ])
            .select()
            .single()
        
        if (error) throw error
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error creating scrapbook:', error)
        return NextResponse.json(
            { error: 'Error creating scrapbook' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('scrapbooks')
            .select('*, photos(*)')
        
        if (error) throw error
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching scrapbooks:', error)
        return NextResponse.json(
            { error: 'Error fetching scrapbooks' },
            { status: 500 }
        )
    }
} 