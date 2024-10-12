import { NextResponse, NextRequest } from "next/server";
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
});

export const config = {
  runtime: 'edge',
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await pinata.pinFileToIPFS(buffer, {
      pinataMetadata: {
        name: file.name,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    });

    const url = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
