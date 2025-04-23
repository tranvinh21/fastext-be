import { serve } from "@bunny.net/edgescript-sdk";
import { signUrl, uploadFile } from "bunny-presigned-urls";

// Configuration
const maxSize = 10 * 1024 * 1024; // 10MB
const expires = 60 * 60; // 1hr
const signPathname = "/sign";
const uploadPathname = "/upload";

const key = "6eff3a4c-c736-45d7-9320e798a171-3f14-4830";

const storageZone = {
	name: "fastext-media",
	password: "6eff3a4c-c736-45d7-9320e798a171-3f14-4830",
	storageHostname: "sg.storage.bunnycdn.com",
};

// Serve function to handle requests
serve(async (req) => {
	if (req.method === "POST" && (req.url.pathname as string) === signPathname) {
		// Authorize user
		// Validate request
		const formData = await req.formData();
		const file = formData.get("file");
		if (!file) {
			return new Response("Bad Request", { status: 400 });
		}

		await signUrl({
			baseUrl: "http://localhost:3000/api/media/sign-up",
			checksum: false,
			expires,
			filePath: "test/ok",
			fileSizeInBytes: file.fileSizeInBytes,
			key: key,
			maxSize,
			storageZone: storageZone,
		});

		return new Response(JSON.stringify({ url, fields }), {
			headers: { "Content-Type": "application/json" },
		});
	} else if (req.method === "POST" && req.url.pathname === uploadPathname) {
		// Validate request
		const formData = await req.formData();
		const file = formData.get("file");
		if (!file) {
			return new Response("Bad Request", { status: 400 });
		}

		// Upload file
		const presignedUrls = new PresignedUrls({
			key: process.env.KEY,
			storageZoneName: process.env.STORAGE_ZONE_NAME,
			storageZonePassword: process.env.STORAGE_ZONE_PASSWORD,
			storageZoneStorageHostname: process.env.STORAGE_ZONE_STORAGE_HOSTNAME,
		});

		uploadFile({
			url: req.url,
			fields: Object.fromEntries(formData.entries()),
			file,
		});

		return new Response("OK", { status: 201 });
	} else {
		return new Response("Not Found", { status: 404 });
	}
});
