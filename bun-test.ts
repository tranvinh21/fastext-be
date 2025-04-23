import { createReadStream, statSync } from "node:fs";
import path, { basename } from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import { checksumFromReadableStream } from "bunny-presigned-urls";

// Đường dẫn file local
const filePath = "./test.txt";
const fileName = basename(filePath);
const fileSize = statSync(filePath).size;

const baseUrl = "https://media.fastext.vicidev.io.vn";
// const baseUrl = "http://127.0.0.1:3002";

// gọi API để lấy signed URL
const signedUrlResponse = await fetch(`${baseUrl}/sign`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		filePath: `./${fileName}`,
		fileSizeInBytes: fileSize,
	}),
});

const message = await signedUrlResponse.text();
console.log("message", message);
const uploadResponse = await fetch(message, {
	method: "POST",
	body: Readable.toWeb(
		createReadStream(path.resolve(filePath)),
	) as ReadableStream<Uint8Array>,
	duplex: "half",
	redirect: "follow",
	verse: true,
});
console.log("uploadResponse", uploadResponse);

const { status, statusText } = uploadResponse;
if (status === 201) {
	console.log("Done");
} else {
	console.error({
		message: await uploadResponse.text(),
		status,
		statusText,
	});
}
