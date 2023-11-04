import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

export async function POST(request) {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
        return NextResponse.json({ success: false });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const bucketName = 'mazindabucket';

    try {
        const s3 = new AWS.S3();

        // Generate a timestamp for the file name
        const currentDate = new Date();
        const timestamp = currentDate.toISOString().replace(/[:.]/g, '');

        const fileNameWithTimestamp = `${timestamp}_${file.name}`;

        const params = {
            Bucket: bucketName,
            Key: fileNameWithTimestamp, // Use the new filename
            Body: buffer,
        };

        let fileLocation;

        s3.upload(params, (err, data) => {
            if (err) {
                console.log(err);
                return NextResponse.json({ success: false });
            } else {
                fileLocation = data.Location;
                console.log('File uploaded successfully', data.Location);
            }
        });

        return NextResponse.json({ success: true, fileName: fileNameWithTimestamp, location: fileLocation });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ success: false, error: 'Error uploading file' });
    }
}