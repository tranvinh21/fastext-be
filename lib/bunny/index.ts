import type { StorageInterface } from "../../interfaces/storage.interface";
import * as BunnyStorageSDK from "@bunny.net/storage-sdk";
const SZ_ZONE = process.env.SZ_ZONE!;
const ACCESS_KEY = process.env.ACCESS_KEY!;


export class Bunny implements StorageInterface {
  private sz: BunnyStorageSDK.StorageZone;

  constructor() { 
    this.sz =  BunnyStorageSDK.zone.connect_with_accesskey(BunnyStorageSDK.regions.StorageRegion.Falkenstein, SZ_ZONE, ACCESS_KEY);
  }
  list(path: string = '/'): Promise<BunnyStorageSDK.StorageFile[]> {
    return BunnyStorageSDK.file.list(this.sz, path);
  }
  upload({ file, path }: { file: ReadableStream<Uint8Array>; path: string }): Promise<any> {
    return BunnyStorageSDK.file.upload(this.sz, path, file);
  }
  

}