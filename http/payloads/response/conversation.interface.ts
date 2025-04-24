export interface PrivateChatResponse {
	id: number;
	name: string;
	chatKey: string;
	createdAt: Date;
	updatedAt: Date;
	friend: {
		id: number;
		name: string;
		avatar: string;
	};
}
