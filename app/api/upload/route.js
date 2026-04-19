import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    const formData = await req.formData();
    console.log("Form DATA: ", formData);

    const file = formData.get('image');
    console.log("FILE: ", file);

    if (!file) return Response.json({ error: 'No file' }, { status: 400 });

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
    console.log("BASE64: ",base64);
    

    const result = await cloudinary.uploader.upload(base64, {
        folder: 'avatars',
    });

    return Response.json({ url: result.secure_url, public_id: result.public_id });
}