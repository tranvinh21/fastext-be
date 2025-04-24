import {
	createConversationMember,
	createPrivateConversation,
	getPrivateConversationByChatKey,
} from "../../lib/db/queries/conversation";

const generateChatKey = (memberIds: number[]) => {
	return memberIds.sort().join("_");
};

export const findOrCreatePrivateConversation = async (memberIds: number[]) => {
	const chatKey = generateChatKey(memberIds);

	// Check if conversation already exists
	const conversation = await getPrivateConversationByChatKey(chatKey);
	if (conversation) {
		return conversation;
	}

	// Create conversation
	const newConversation = await createPrivateConversation(chatKey);
	if (!newConversation) {
		throw new Error("Failed to create conversation");
	}

	// Create conversation members
	for (const memberId of memberIds) {
		await createConversationMember(newConversation.id, memberId);
	}

	return await getPrivateConversationByChatKey(chatKey);
};
