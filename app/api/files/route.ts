import { NextResponse, NextRequest } from "next/server";
import PinataSDK from '@pinata/sdk';

const pinata = new PinataSDK({ pinataJWTKey: process.env.PINATA_JWT_KEY });

export const runtime = 'nodejs'; // Changed from 'edge' due to Pinata SDK compatibility

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await pinata.pinFileToIPFS({
      content: buffer,
      options: {
        pinataMetadata: {
          name: file.name,
        },
      },
    });

    const url = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${result.IpfsHash}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
