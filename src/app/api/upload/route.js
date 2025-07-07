import { writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { mkdirSync, existsSync } from 'fs';

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    const publicPath = `/uploads/${fileName}`;
    return NextResponse.json({ path: publicPath }, { status: 200 });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
