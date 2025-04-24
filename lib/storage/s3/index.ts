import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { StorageInterface } from "../storage.interface";
import { env } from "../../../config/env";
export class S3Storage implements StorageInterface {
	private s3: S3Client;
	constructor() {
		this.s3 = new S3Client({
			region: "ap-southeast-1", // Đúng region
			credentials: {
				accessKeyId: env.s3_config.accessKeyId,
				secretAccessKey: env.s3_config.secretAccessKey,
			},
		});
	}

	async getPresignedUrl({
		method,
		filePath,
	}: { method: "get" | "put"; filePath: string }): Promise<string> {
		const ObjectCommand =
			method === "get"
				? new GetObjectCommand({
						Bucket: env.s3_config.bucketName,
						Key: filePath,
					})
				: new PutObjectCommand({
						Bucket: env.s3_config.bucketName,
						Key: filePath,
					});

		const signedUrl = await getSignedUrl(this.s3, ObjectCommand, {
			expiresIn: 3600,
		});
		return signedUrl;
	}

	async getPresignedViewUrls(keys: string[]): Promise<Record<string, string>> {
		const urls = await Promise.all(
			keys.map(async (key) => {
				const url = await this.getPresignedUrl({
					method: "get",
					filePath: key,
				});
				return { [key]: url };
			}),
		);
		// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
		return urls.reduce((acc, curr) => ({ ...acc, ...curr }), {});
	}
}
