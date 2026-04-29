import { NextResponse } from 'next/server';
import { getShakedownLogs } from '@/lib/shakedown-logger';

export async function GET() {
  try {
    const logs = getShakedownLogs();
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
