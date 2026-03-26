import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  const { date } = params;

  // Validate date format YYYY-MM-DD strictly
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: `Invalid date format: ${date}` }, { status: 400 });
  }

  // Extra sanity: year must be reasonable
  const year = parseInt(date.slice(0, 4));
  if (year < 2020 || year > 2100) {
    return NextResponse.json({ error: `Invalid year in date: ${date}` }, { status: 400 });
  }

  try {
    const logsDir = path.join(process.cwd(), 'logs');
    const filePath = path.join(logsDir, `${date}.json`);
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    return NextResponse.json(data);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json(
        { error: `No log found for ${date}. Run fetch_asx.py to fetch data.` },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: 'Failed to read log' }, { status: 500 });
  }
}
