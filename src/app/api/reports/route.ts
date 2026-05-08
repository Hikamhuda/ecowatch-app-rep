import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToS3 } from '@/lib/s3';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const file = formData.get('image') as File | null;

    if (!title || !description || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imageUrl = null;

    if (file && file.size > 0) {
      try {
        console.log('Uploading file to S3:', file.name);
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `reports/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        imageUrl = await uploadToS3(buffer, fileName, file.type);
        console.log('File uploaded successfully. URL:', imageUrl);
      } catch (s3Error) {
        console.error('S3 Upload Error:', s3Error);
        throw new Error('Gagal mengupload foto ke S3. Pastikan kredensial AWS benar.');
      }
    }

    const report = await prisma.report.create({
      data: {
        title,
        description,
        location,
        imageUrl,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to create report', details: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
