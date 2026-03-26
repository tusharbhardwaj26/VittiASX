import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const logsDir = path.join(process.cwd(), 'logs');
    
    // If exact directory doesn't exist, just return an empty array smoothly
    if (!fs.existsSync(logsDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(logsDir);
    
    // Filter for JSON files and strictly match YYYY-MM-DD structure
    const dates = files
      .filter(f => f.endsWith('.json') && /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map(f => f.replace('.json', ''))
      .sort((a, b) => b.localeCompare(a)); // Sort newest first (Z-A)

    return NextResponse.json(dates);
  } catch (error) {
    console.error('Error scanning logs directory:', error);
    return NextResponse.json([], { status: 500 });
  }
}
