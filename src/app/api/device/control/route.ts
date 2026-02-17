import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const BLYNK_AUTH_TOKEN = process.env.BLYNK_AUTH_TOKEN;
const BLYNK_API_URL = process.env.BLYNK_API_URL || 'https://blynk.cloud/external/api';

export async function POST(request: NextRequest) {
    try {
        const { pin, value } = await request.json();

        if (!pin || value === undefined) {
            return NextResponse.json({ error: 'Missing pin or value' }, { status: 400 });
        }

        // 1. Update Blynk
        const blynkUrl = `${BLYNK_API_URL}/update?token=${BLYNK_AUTH_TOKEN}&${pin}=${value}`;
        const blynkResponse = await fetch(blynkUrl);

        if (!blynkResponse.ok) {
            throw new Error('Failed to update Blynk');
        }

        // 2. Update MongoDB
        const client = await clientPromise;
        const db = client.db('digiblynk');
        const field = pin.toLowerCase();

        await db.collection('device_states').updateOne(
            { deviceId: 'water-controller' },
            {
                $set: { [field]: value, lastUpdated: new Date() },
                $setOnInsert: { deviceId: 'water-controller' }
            },
            { upsert: true }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Control error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
