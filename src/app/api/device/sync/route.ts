import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const BLYNK_AUTH_TOKEN = process.env.BLYNK_AUTH_TOKEN;
const BLYNK_API_URL = process.env.BLYNK_API_URL || 'https://blynk.cloud/external/api';

export async function GET() {
    try {
        // Fetch valid pins from Blynk
        // V0: Motor, V1: Bottom, V2: Top, V3: Status
        const pins = ['V0', 'V1', 'V2', 'V3'];
        const updates: Record<string, any> = {};

        for (const pin of pins) {
            const response = await fetch(`${BLYNK_API_URL}/get?token=${BLYNK_AUTH_TOKEN}&${pin}`);
            if (response.ok) {
                const text = await response.text();
                // Blynk returns values as strings like "1" or "0"
                const val = parseInt(text.replace(/["']/g, ""), 10); // clear quotes if any
                if (!isNaN(val)) {
                    updates[pin.toLowerCase()] = val;
                }
            }
        }

        if (Object.keys(updates).length > 0) {
            const client = await clientPromise;
            const db = client.db('digiblynk');

            updates.lastUpdated = new Date();

            await db.collection('device_states').updateOne(
                { deviceId: 'water-controller' },
                {
                    $set: updates,
                    $setOnInsert: { deviceId: 'water-controller' }
                },
                { upsert: true }
            );

            return NextResponse.json({ success: true, updates });
        }

        return NextResponse.json({ success: false, message: 'No data fetched' });

    } catch (error: any) {
        console.error('Sync Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
