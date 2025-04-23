import * as BunnySDK from "@bunny.net/edgescript-sdk";
import * as BunnyStorageSDK from "@bunny.net/storage-sdk";
import { signUrl, uploadFile } from "bunny-presigned-urls";
import type { NextFunction, Request, Response } from "express";
const sz_zone = "fastext-media";
const access_key = "6eff3a4c-c736-45d7-9320e798a171-3f14-4830";
const signPathname = "/sign";
const uploadPathname = "/upload";
const baseUrl = "http://localhost:3000";
const expires = "1hr";
const maxSize = "30MB";
const sz = BunnyStorageSDK.zone.connect_with_accesskey(
	BunnyStorageSDK.regions.StorageRegion.Singapore,
	sz_zone,
	access_key,
);

export async function signUrlHandler(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const body = req.body;
		const data = await signUrl({
			// biome-ignore lint/style/useTemplate: <explanation>
			baseUrl: "http://localhost:3000/api/media/upload",
			checksum: false,
			expires,
			filePath: body.filePath,
			fileSizeInBytes: body.fileSizeInBytes,
			key: access_key,
			maxSize,
			storageZone: sz,
		});
		console.log("data", data);
		return data;
	} catch (error) {
		console.log(error);
		next(error);
	}
}

export async function uploadHandler(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const body = req.body;
		console.log({
			body,
			expires,
			key: accessKey,
			storageZone,
			url: "http://localhost:3000/api/media/upload",
			maxSize,
		});
		const data = await uploadFile({
			body,
			expires,
			key: accessKey,
			storageZone,
			url: "http://localhost:3000/api/media/upload",
			maxSize,
		});
		console.log(data);
	} catch (error) {
		next(error);
	}
}
