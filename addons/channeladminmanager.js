class ChannelAdminManager {
    constructor() {
        this.adminKey = 'channel_admins';
    }

    // Create new channel
    createChannel(channelName, creatorHandle) {
        const channelId = this.generateChannelId();
        const adminKey = `channel_admin_${channelId}`;
        
        // Set creator as admin
        localStorage.setItem(adminKey, creatorHandle);
        
        // Add channel to list
        const channels = this.getChannels();
        channels.push({
            id: channelId,
            name: channelName,
            admin: creatorHandle,
            created: new Date().toISOString()
        });
        
        localStorage.setItem('channels', JSON.stringify(channels));
        
        // Add creator to channel members
        const sessionManager = new ChatSessionManager();
        sessionManager.addUserToChannel(channelId, creatorHandle);
        
        return channelId;
    }

    // Check if user is admin of channel
    isChannelAdmin(channelId, userHandle) {
        const adminKey = `channel_admin_${channelId}`;
        const admin = localStorage.getItem(adminKey);
        return admin === userHandle;
    }

    // Get channel admin
    getChannelAdmin(channelId) {
        const adminKey = `channel_admin_${channelId}`;
        return localStorage.getItem(adminKey);
    }

    // Transfer ownership
    transferOwnership(channelId, newAdmin) {
        const adminKey = `channel_admin_${channelId}`;
        localStorage.setItem(adminKey, newAdmin);
        
        // Update channels list
        const channels = this.getChannels();
        const channelIndex = channels.findIndex(ch => ch.id === channelId);
        if (channelIndex !== -1) {
            channels[channelIndex].admin = newAdmin;
            localStorage.setItem('channels', JSON.stringify(channels));
        }
    }

    getChannels() {
        const stored = localStorage.getItem('channels');
        return stored ? JSON.parse(stored) : [];
    }

    generateChannelId() {
        return 'ch_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
