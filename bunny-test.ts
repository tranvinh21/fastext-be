import * as BunnySDK from "@bunny.net/edgescript-sdk";
import * as BunnyStorageSDK from "@bunny.net/storage-sdk";
import { signUrl, uploadFile } from "bunny-presigned-urls";

const sz_zone = "fastext-media";
const access_key = "6eff3a4c-c736-45d7-9320e798a171-3f14-4830";
const uploadPathname = "/upload";
const expires = "1hr";
const maxSize = "30MB";
const sz = BunnyStorageSDK.zone.connect_with_accesskey(
	BunnyStorageSDK.regions.StorageRegion.Singapore,
	sz_zone,
	access_key,
);

console.log("Starting server...");

BunnySDK.net.http.serve(
	{ port: 3000, hostname: "127.0.0.1" },
	async (request) => {
		try {
			// workaround bug where request.url protocol is http://, not https://
			const url = new URL(request.url);
			console.log(request.method);
			console.log(url.pathname);
			if (request.method === "POST" && url.pathname === uploadPathname) {
				// optionally, validate the file type before upload, but be aware of gotchas
				// return uploaded file response
				return await uploadFile({
					body: request.body,
					expires,
					key: access_key,
					maxSize,
					storageZone: sz,
					url: request.url,
				});
			}
			const parameters = await request.json();

			console.log("adsa");
			const data = await signUrl({
				// biome-ignore lint/style/useTemplate: <explanation>
				baseUrl: url.origin + "/" + uploadPathname,
				checksum: false,
				expires,
				filePath: parameters.filePath,
				fileSizeInBytes: parameters.fileSizeInBytes,
				key: access_key,
				maxSize,
				storageZone: sz,
			});
			return data;
		} catch (error) {
			console.log(error);
			// hide 500 errors for security
			return new Response(undefined, {
				status: 500,
				statusText: "Internal Server Error",
			});
		}
	},
);
