class ChatMessageQueue {
    constructor() {
        this.RETENTION_DAYS = 5;
        this.CHUNK_MINUTES = 5;
        this.storageKey = 'chat_message_queue';
    }

    // Store message with timestamp chunks
    storeMessage(channelId, message, userHandle) {
        const now = new Date();
        const chunkId = this.getTimeChunk(now);
        
        const messageData = {
            id: this.generateMessageId(),
            channelId,
            message,
            userHandle,
            timestamp: now.toISOString(),
            chunkId,
            recipients: this.getChannelMembers(channelId)
        };

        this.addToQueue(messageData);
        this.cleanOldMessages();
    }

    // Get time chunk (5-minute intervals)
    getTimeChunk(date) {
        const minutes = Math.floor(date.getMinutes() / this.CHUNK_MINUTES) * this.CHUNK_MINUTES;
        const chunkDate = new Date(date);
        chunkDate.setMinutes(minutes, 0, 0);
        return chunkDate.toISOString();
    }

    // Add message to queue
    addToQueue(messageData) {
        const queue = this.getQueue();
        queue.push(messageData);
        localStorage.setItem(this.storageKey, JSON.stringify(queue));
    }

    // Get messages for user since last seen
    getMessagesForUser(channelId, userHandle) {
        const lastSeen = this.getLastSeen(channelId, userHandle);
        const queue = this.getQueue();
        
        return queue.filter(msg => {
            return msg.channelId === channelId && 
                   new Date(msg.timestamp) > new Date(lastSeen) &&
                   msg.recipients.includes(userHandle);
        });
    }

    // Mark messages as received by user
    markMessagesReceived(channelId, userHandle, messageIds) {
        const queue = this.getQueue();
        
        queue.forEach(msg => {
            if (messageIds.includes(msg.id)) {
                msg.recipients = msg.recipients.filter(recipient => recipient !== userHandle);
            }
        });

        // Remove messages with no remaining recipients
        const filteredQueue = queue.filter(msg => msg.recipients.length > 0);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredQueue));
        
        this.updateLastSeen(channelId, userHandle);
    }

    // Clean messages older than 5 days
    cleanOldMessages() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.RETENTION_DAYS);
        
        const queue = this.getQueue();
        const filteredQueue = queue.filter(msg => 
            new Date(msg.timestamp) > cutoffDate
        );
        
        localStorage.setItem(this.storageKey, JSON.stringify(filteredQueue));
    }

    // Session management
    updateLastSeen(channelId, userHandle) {
        const sessionKey = `last_seen_${channelId}_${userHandle}`;
        localStorage.setItem(sessionKey, new Date().toISOString());
    }

    getLastSeen(channelId, userHandle) {
        const sessionKey = `last_seen_${channelId}_${userHandle}`;
        return localStorage.getItem(sessionKey) || new Date(0).toISOString();
    }

    // Utility methods
    getQueue() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    generateMessageId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getChannelMembers(channelId) {
        const membersKey = `channel_members_${channelId}`;
        const stored = localStorage.getItem(membersKey);
        return stored ? JSON.parse(stored) : [];
    }
}
