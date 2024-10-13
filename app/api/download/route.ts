import { NextResponse, NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ipfsHash = searchParams.get('ipfsHash');

  if (!ipfsHash) {
    return NextResponse.json({ error: "No IPFS hash provided" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${ipfsHash}`);
    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${ipfsHash}`,
      },
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json({ error: "Error downloading file" }, { status: 500 });
  }
}