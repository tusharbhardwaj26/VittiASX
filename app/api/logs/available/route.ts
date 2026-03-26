import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const logsDir = path.join(process.cwd(), 'logs');
    const files = await readdir(logsDir);
    const dates = files
      .filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map(f => f.replace('.json', ''))
      .sort()
      .reverse(); // newest first
    return NextResponse.json({ dates });
  } catch {
    return NextResponse.json({ dates: [] });
  }
}
