export type StorageInterface = {
  list(): Promise<any[]>;
  upload({ file, path }: { file: ReadableStream<Uint8Array>; path: string }): Promise<any>;
};
