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
		const { fileName, method } = body;
		const storageClient = new S3Storage();
		const url = await storageClient.getPresignedUrl({
			filePath: fileName,
			method,
		});
		res.send(url);
	} catch (error) {
		console.log(error);
		next(error);
	}
}

export const getViewUrlsHandler = async (req: Request, res: Response) => {
	const { keys } = req.body;
	const storageClient = new S3Storage();
	const urls = await storageClient.getPresignedViewUrls(keys);
	res.send(urls);
};
