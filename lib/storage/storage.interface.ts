export type StorageInterface = {
	getPresignedUrl: ({
		method,
		filePath,
	}: { method: "get" | "put"; filePath: string }) => Promise<string>;
};
