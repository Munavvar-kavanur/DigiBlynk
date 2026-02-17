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

        console.log(`Webhook Received - RAW: pin=${pin}, value=${value}`);

        // If not in query params, try body
        if (!pin || !value) {
            try {
                const body = await request.json();
                pin = pin || body.pin;
                value = value || body.value;
                console.log(`Webhook Body fallback: pin=${pin}, value=${value}`);
            } catch (e) {
                // Body might not be JSON or empty
            }
        }

        if (!pin || value === null || value === undefined) {
            console.error('Webhook Error: Missing pin or value');
            return NextResponse.json({ error: 'Missing pin or value' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('digiblynk');

        // Update the device state in MongoDB
        const field = pin.toLowerCase(); // v0, v1, v2, v3

        // Ensure value is stored as a number for consistency
        const numericValue = parseInt(value.toString(), 10);

        console.log(`Updating DB: deviceId=water-controller, ${field}=${numericValue}`);

        await db.collection('device_states').updateOne(
            { deviceId: 'water-controller' },
            {
                $set: { [field]: numericValue, lastUpdated: new Date() },
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
