export type StorageInterface = {
	getPresignedUrl: ({
		method,
		filePath,
	}: { method: "get" | "put"; filePath: string }) => Promise<string>;
	getPresignedViewUrls: (keys: string[]) => Promise<Record<string, string>>;
};
