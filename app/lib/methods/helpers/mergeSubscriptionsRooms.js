import normalizeMessage from './normalizeMessage';
// TODO: delete and update

export const merge = (subscription, room) => {
	if (room) {
		subscription.roomUpdatedAt = room._updatedAt;
		subscription.lastMessage = normalizeMessage(room.lastMessage);
		subscription.ro = room.ro;
		subscription.description = room.description;
		subscription.topic = room.topic;
		subscription.announcement = room.announcement;
		subscription.reactWhenReadOnly = room.reactWhenReadOnly;
		subscription.archived = room.archived;
		subscription.joinCodeRequired = room.joinCodeRequired;
	}
	if (subscription.roles && subscription.roles.length) {
		subscription.roles = subscription.roles.map(role => (role.value ? role : { value: role }));
	}

	subscription.blocked = !!subscription.blocker;
	// subscription.roles = [];
	return subscription;
};

export default (subscriptions = [], rooms = []) => {
	if (subscriptions.update) {
		subscriptions = subscriptions.update;
		rooms = rooms.update;
	}
	return {
		subscriptions: subscriptions.map((s) => {
			const index = rooms.findIndex(({ _id }) => _id === s.rid);
			if (index < 0) {
				return merge(s);
			}
			const [room] = rooms.splice(index, 1);
			return merge(s, room);
		}),
		rooms
	};
};