import type { NextFunction, Request, Response } from "express";
import "../../lib/storage/s3/index";
import { S3Storage } from "../../lib/storage/s3/index";
export async function signUrlHandler(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const body = req.body;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const { userId } = req.user!;
		const { fileName, method } = body;
		const storageClient = new S3Storage();
		const url = await storageClient.getPresignedUrl({
			filePath: `${userId}/${fileName}`,
			method,
		});
		res.send(url);
	} catch (error) {
		console.log(error);
		next(error);
	}
}
