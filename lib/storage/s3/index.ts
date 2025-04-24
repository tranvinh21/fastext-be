import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { StorageInterface } from "../storage.interface";

export class S3Storage implements StorageInterface {
	private s3: S3Client;
	constructor() {
		this.s3 = new S3Client({
			region: "ap-southeast-1", // Đúng region
			credentials: {
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				accessKeyId: process.env.S3_ACCESS_KEY!,
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				secretAccessKey: process.env.S3_SECRET_KEY!,
			},
		});
	}

	async getPresignedUrl({
		method,
		filePath,
	}: { method: "get" | "put"; filePath: string }): Promise<string> {
		const ObjectCommand = new PutObjectCommand({
			Bucket: process.env.S3_BUCKET,
			Key: "test/test.txt",
		});

		const signedUrl = await getSignedUrl(this.s3, ObjectCommand, {
			expiresIn: 3600,
		});
		return signedUrl;
	}
}
