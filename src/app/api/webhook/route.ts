import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    return handleWebhook(request);
}

export async function POST(request: NextRequest) {
    return handleWebhook(request);
}

async function handleWebhook(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        let pin = searchParams.get('pin');
        let value = searchParams.get('value');

        // If not in query params, try body
        if (!pin || !value) {
            try {
                const body = await request.json();
                pin = pin || body.pin;
                value = value || body.value;
            } catch (e) {
                // Body might not be JSON or empty
            }
        }

        if (!pin || value === null) {
            return NextResponse.json({ error: 'Missing pin or value' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('digiblynk');

        // Update the device state in MongoDB
        // We map the pin (e.g. V0) to a field
        const field = pin.toLowerCase(); // v0, v1, v2, v3

        await db.collection('device_states').updateOne(
            { deviceId: 'water-controller' },
            {
                $set: { [field]: value, lastUpdated: new Date() },
                $setOnInsert: { deviceId: 'water-controller' }
            },
            { upsert: true }
        );

        return NextResponse.json({ success: true, updated: field, value });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
