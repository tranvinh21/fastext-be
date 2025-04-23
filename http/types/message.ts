export interface MessagePart {
    type: "text" | "image" | "video" | "audio" | "file";
    content: string;
}



