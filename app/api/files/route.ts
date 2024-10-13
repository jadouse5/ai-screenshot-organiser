import { NextResponse, NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const upload = await pinata.upload.file(file);
    const url = await pinata.gateways.createSignedURL({
      cid: upload.cid,
      expires: 3600,
    });
    return NextResponse.json({ url, ipfsHash: upload.cid }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
