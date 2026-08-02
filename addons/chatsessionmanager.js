class ChatSessionManager {
    constructor() {
        this.sessionKey = 'chat_sessions';
    }

    // Join channel and get message history
    joinChannel(channelId, userHandle) {
        this.addUserToChannel(channelId, userHandle);
        const messageQueue = new ChatMessageQueue();
        
        // Get messages since last visit (with 1-day buffer)
        const messages = messageQueue.getMessagesForUser(channelId, userHandle);
        
        // Mark user as active in channel
        this.setActiveSession(channelId, userHandle);
        
        return messages;
    }

    // Leave channel
    leaveChannel(channelId, userHandle) {
        const messageQueue = new ChatMessageQueue();
        messageQueue.updateLastSeen(channelId, userHandle);
        this.removeActiveSession(channelId, userHandle);
    }

    // Add user to channel members
    addUserToChannel(channelId, userHandle) {
        const membersKey = `channel_members_${channelId}`;
        const members = JSON.parse(localStorage.getItem(membersKey) || '[]');
        
        if (!members.includes(userHandle)) {
            members.push(userHandle);
            localStorage.setItem(membersKey, JSON.stringify(members));
        }
    }

    // Set active session
    setActiveSession(channelId, userHandle) {
        const sessions = this.getSessions();
        const sessionId = `${channelId}_${userHandle}`;
        
        sessions[sessionId] = {
            channelId,
            userHandle,
            joinTime: new Date().toISOString(),
            active: true
        };
        
        localStorage.setItem(this.sessionKey, JSON.stringify(sessions));
    }

    // Remove active session
    removeActiveSession(channelId, userHandle) {
        const sessions = this.getSessions();
        const sessionId = `${channelId}_${userHandle}`;
        
        if (sessions[sessionId]) {
            sessions[sessionId].active = false;
            sessions[sessionId].leaveTime = new Date().toISOString();
        }
        
        localStorage.setItem(this.sessionKey, JSON.stringify(sessions));
    }

    getSessions() {
        const stored = localStorage.getItem(this.sessionKey);
        return stored ? JSON.parse(stored) : {};
    }
}
