import {
	createConversationMember,
	createPrivateConversation,
	getConversationByChatKey,
} from "../../lib/db/queries/conversation";

const generateChatKey = (memberIds: number[]) => {
	return memberIds.sort().join("_");
};

export const findOrCreatePrivateConversation = async (memberIds: number[]) => {
	const chatKey = generateChatKey(memberIds);
	const conversation = await getConversationByChatKey(chatKey);
	if (conversation) {
		return conversation;
	}
	const newConversation = await createPrivateConversation(chatKey);
	if (!newConversation) {
		throw new Error("Failed to create conversation");
	}
	for (const memberId of memberIds) {
		console.log("memberId", memberId);
		await createConversationMember(newConversation.id, memberId);
	}
	return newConversation;
};
