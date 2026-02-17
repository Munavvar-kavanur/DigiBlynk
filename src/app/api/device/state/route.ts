import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('digiblynk');

        const state = await db.collection('device_states').findOne({ deviceId: 'water-controller' });

        if (!state) {
            // Default state if nothing in DB yet
            return NextResponse.json({
                v0: 0,
                v1: 0,
                v2: 0,
                v3: 0,
                lastUpdated: null
            });
        }

        return NextResponse.json(state);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
