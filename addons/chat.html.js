// dotpipe.js chat integration
function createChatInterface(containerId, userHandle) {
    var container = document.getElementById(containerId);
    
    container.innerHTML = [
        '<div style="display: flex; gap: 20px;">',
        '<div style="flex: 1; max-width: 300px;">',
        '<h3>Channels</h3>',
        '<chat list-type="channel" user-handle="' + userHandle + '" id="channels"></chat>',
        '<button onclick="createChannel()">Create Channel</button>',
        '</div>',
        '<div style="flex: 2;">',
        '<h3 id="currentChannelName">Select a channel</h3>',
        '<div id="messageArea" style="border: 1px solid #ddd; height: 300px; padding: 10px; overflow-y: auto; margin-bottom: 10px;"></div>',
        '<input type="text" id="messageInput" placeholder="Type a message..." style="width: 100%; padding: 10px;" onkeypress="handleMessageInput(event)">',
        '</div>',
        '<div style="flex: 1; max-width: 200px;">',
        '<h3>Members</h3>',
        '<chat list-type="handle" user-handle="' + userHandle + '" id="members"></chat>',
        '</div>',
        '</div>'
    ].join('');
    
    var currentChannel = null;
    
    // Channel selection handler
    document.getElementById('channels').addEventListener('chat-item-selected', function(e) {
        if (e.detail.type === 'channel') {
            if (currentChannel) {
                window.chatAPI.leaveChannel(currentChannel, userHandle);
            }
            
            currentChannel = e.detail.value;
            var messages = window.chatAPI.joinChannel(currentChannel, userHandle);
            
            // Update UI
            var channels = window.chatAPI.getChannels();
            var channel = channels.find(function(ch) { return ch.id === currentChannel; });
            document.getElementById('currentChannelName').textContent = channel ? channel.name : 'Unknown Channel';
            
            // Display messages
            var messageArea = document.getElementById('messageArea');
            messageArea.innerHTML = messages.map(function(msg) {
                return '<div><strong>' + msg.userHandle + ':</strong> ' + msg.message + '</div>';
            }).join('');
            messageArea.scrollTop = messageArea.scrollHeight;
            
            // Update members list
            var membersList = document.getElementById('members');
            membersList.setAttribute('channel-id', currentChannel);
            if (window.chatAPI.isAdmin(currentChannel, userHandle)) {
                membersList.setAttribute('admin-mode', '');
            } else {
                membersList.removeAttribute('admin-mode');
            }
            window.chatAPI.refreshChatElement('members');
        }
    });
    
    // Message input handler
    window.handleMessageInput = function(event) {
        if (event.key === 'Enter' && currentChannel) {
            var input = event.target;
            var message = input.value.trim();
            
            if (message) {
                window.chatAPI.sendMessage(currentChannel, message, userHandle);
                input.value = '';
                
                // Refresh messages
                var messages = window.chatAPI.getMessages(currentChannel, userHandle);
                var messageArea = document.getElementById('messageArea');
                messageArea.innerHTML = messages.map(function(msg) {
                    return '<div><strong>' + msg.userHandle + ':</strong> ' + msg.message + '</div>';
                }).join('');
                messageArea.scrollTop = messageArea.scrollHeight;
            }
        }
    };
    
    // Create channel function
    window.createChannel = function() {
        var channelName = prompt('Enter channel name:');
        if (channelName) {
            window.chatAPI.createChannel(channelName, userHandle);
            window.chatAPI.refreshChatElement('channels');
        }
    };
}
// Create chat elements dynamically
function createChannelSelector(containerId, userHandle) {
    var container = document.getElementById(containerId);
    var chatElement = document.createElement('chat');
    
    chatElement.setAttribute('list-type', 'channel');
    chatElement.setAttribute('user-handle', userHandle);
    chatElement.id = 'dynamic-chat-' + Date.now();
    
    container.appendChild(chatElement);
    
    // The element will be automatically initialized by the mutation observer
    
    return chatElement;
}

// Update chat element attributes
function switchToMemberView(chatElement, channelId) {
    chatElement.setAttribute('list-type', 'handle');
    chatElement.setAttribute('channel-id', channelId);
    
    // Check if user is admin
    var userHandle = chatElement.getAttribute('user-handle');
    if (window.chatAPI.isAdmin(channelId, userHandle)) {
        chatElement.setAttribute('admin-mode', '');
    }
}

// Usage
// createChatInterface('chatContainer', 'current_user');

// Global chat state management
window.chatState = {
    messageQueues: {},
    sessions: {},
    channels: {},
    admins: {},
    RETENTION_DAYS: 5,
    CHUNK_MINUTES: 5
};

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getTimeChunk(date) {
    const minutes = Math.floor(date.getMinutes() / window.chatState.CHUNK_MINUTES) * window.chatState.CHUNK_MINUTES;
    const chunkDate = new Date(date);
    chunkDate.setMinutes(minutes, 0, 0);
    return chunkDate.toISOString();
}

function getStorageItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Storage error:', e);
    }
}

// Message queue management functions
function storeMessage(channelId, message, userHandle) {
    const now = new Date();
    const chunkId = getTimeChunk(now);
    
    const messageData = {
        id: generateId(),
        channelId: channelId,
        message: message,
        userHandle: userHandle,
        timestamp: now.toISOString(),
        chunkId: chunkId,
        recipients: getChannelMembers(channelId)
    };

    addToMessageQueue(messageData);
    cleanOldMessages();
    return messageData.id;
}

function addToMessageQueue(messageData) {
    const queue = getStorageItem('chat_message_queue', []);
    queue.push(messageData);
    setStorageItem('chat_message_queue', queue);
}

function getMessagesForUser(channelId, userHandle) {
    const lastSeen = getLastSeen(channelId, userHandle);
    const queue = getStorageItem('chat_message_queue', []);
    
    return queue.filter(function(msg) {
        return msg.channelId === channelId && 
               new Date(msg.timestamp) > new Date(lastSeen) &&
               msg.recipients.indexOf(userHandle) !== -1;
    });
}

function markMessagesReceived(channelId, userHandle, messageIds) {
    const queue = getStorageItem('chat_message_queue', []);
    
    queue.forEach(function(msg) {
        if (messageIds.indexOf(msg.id) !== -1) {
            msg.recipients = msg.recipients.filter(function(recipient) {
                return recipient !== userHandle;
            });
        }
    });

    const filteredQueue = queue.filter(function(msg) {
        return msg.recipients.length > 0;
    });
    
    setStorageItem('chat_message_queue', filteredQueue);
    updateLastSeen(channelId, userHandle);
}

function cleanOldMessages() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - window.chatState.RETENTION_DAYS);
    
    const queue = getStorageItem('chat_message_queue', []);
    const filteredQueue = queue.filter(function(msg) {
        return new Date(msg.timestamp) > cutoffDate;
    });
    
    setStorageItem('chat_message_queue', filteredQueue);
}

// Session management functions
function updateLastSeen(channelId, userHandle) {
    const sessionKey = 'last_seen_' + channelId + '_' + userHandle;
    localStorage.setItem(sessionKey, new Date().toISOString());
}

function getLastSeen(channelId, userHandle) {
    const sessionKey = 'last_seen_' + channelId + '_' + userHandle;
    return localStorage.getItem(sessionKey) || new Date(0).toISOString();
}

function joinChannel(channelId, userHandle) {
    addUserToChannel(channelId, userHandle);
    const messages = getMessagesForUser(channelId, userHandle);
    setActiveSession(channelId, userHandle);
    return messages;
}

function leaveChannel(channelId, userHandle) {
    updateLastSeen(channelId, userHandle);
    removeActiveSession(channelId, userHandle);
}

function addUserToChannel(channelId, userHandle) {
    const membersKey = 'channel_members_' + channelId;
    const members = getStorageItem(membersKey, []);
    
    if (members.indexOf(userHandle) === -1) {
        members.push(userHandle);
        setStorageItem(membersKey, members);
    }
}

function getChannelMembers(channelId) {
    const membersKey = 'channel_members_' + channelId;
    return getStorageItem(membersKey, []);
}

function setActiveSession(channelId, userHandle) {
    const sessions = getStorageItem('chat_sessions', {});
    const sessionId = channelId + '_' + userHandle;
    
    sessions[sessionId] = {
        channelId: channelId,
        userHandle: userHandle,
        joinTime: new Date().toISOString(),
        active: true
    };
    
    setStorageItem('chat_sessions', sessions);
}

function removeActiveSession(channelId, userHandle) {
    const sessions = getStorageItem('chat_sessions', {});
    const sessionId = channelId + '_' + userHandle;
    
    if (sessions[sessionId]) {
        sessions[sessionId].active = false;
        sessions[sessionId].leaveTime = new Date().toISOString();
    }
    
    setStorageItem('chat_sessions', sessions);
}

// Channel administration functions
function createChannel(channelName, creatorHandle) {
    const channelId = 'ch_' + generateId();
    const adminKey = 'channel_admin_' + channelId;
    
    localStorage.setItem(adminKey, creatorHandle);
    
    const channels = getStorageItem('channels', []);
    channels.push({
        id: channelId,
        name: channelName,
        admin: creatorHandle,
        created: new Date().toISOString()
    });
    
    setStorageItem('channels', channels);
    addUserToChannel(channelId, creatorHandle);
    
    return channelId;
}

function isChannelAdmin(channelId, userHandle) {
    const adminKey = 'channel_admin_' + channelId;
    const admin = localStorage.getItem(adminKey);
    return admin === userHandle;
}

function getChannelAdmin(channelId) {
    const adminKey = 'channel_admin_' + channelId;
    return localStorage.getItem(adminKey);
}

function transferOwnership(channelId, newAdmin) {
    const adminKey = 'channel_admin_' + channelId;
    localStorage.setItem(adminKey, newAdmin);
    
    const channels = getStorageItem('channels', []);
    for (var i = 0; i < channels.length; i++) {
        if (channels[i].id === channelId) {
            channels[i].admin = newAdmin;
            break;
        }
    }
    setStorageItem('channels', channels);
}

function getChannels() {
    return getStorageItem('channels', []);
}

// Chat element rendering functions
function renderChatElement(element) {
    const listType = element.getAttribute('list-type') || 'channel';
    const channelId = element.getAttribute('channel-id');
    const userHandle = element.getAttribute('user-handle');
    const isAdmin = element.hasAttribute('admin-mode');

    const html = [
        '<style>',
        '.chat-container { border: 1px solid #ccc; border-radius: 8px; padding: 10px; max-width: 400px; font-family: Arial, sans-serif; }',
        '.listbox { max-height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 5px; margin-bottom: 10px; }',
        '.list-item { padding: 5px; cursor: pointer; border-bottom: 1px solid #eee; }',
        '.list-item:hover { background-color: #f0f0f0; }',
        '.list-item.active { background-color: #007bff; color: white; }',
        '.admin-controls { display: ' + (isAdmin ? 'block' : 'none') + '; margin-top: 10px; }',
        '.ownership-transfer { display: none; margin-top: 10px; }',
        '.transfer-button { background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }',
        '.sliding-input { margin-top: 10px; max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }',
        '.sliding-input.show { max-height: 100px; }',
        'select { width: 100%; padding: 5px; margin: 5px 0; }',
        '.confirm-button { background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px; }',
        '.cancel-button { background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }',
        '</style>',
        '<div class="chat-container">',
        '<div class="listbox" data-listbox="true">',
        renderListItems(listType, channelId),
        '</div>',
        isAdmin ? renderAdminControls(channelId, userHandle) : '',
        '</div>'
    ].join('');

    element.innerHTML = html;
    attachChatEventListeners(element);
}

function renderListItems(listType, channelId) {
    if (listType === 'channel') {
        return renderChannels();
    } else if (listType === 'handle') {
        return renderHandles(channelId);
    }
    return '';
}

function renderChannels() {
    const channels = getChannels();
    return channels.map(function(channel) {
        return '<div class="list-item" data-channel="' + channel.id + '">' + channel.name + '</div>';
    }).join('');
}

function renderHandles(channelId) {
    const handles = getChannelMembers(channelId);
    return handles.map(function(handle) {
        return '<div class="list-item" data-handle="' + handle + '">' + handle + '</div>';
    }).join('');
}

function renderAdminControls(channelId, userHandle) {
    const members = getChannelMembers(channelId);
    const otherMembers = members.filter(function(member) {
        return member !== userHandle;
    });

    const options = otherMembers.map(function(member) {
        return '<option value="' + member + '">' + member + '</option>';
    }).join('');

    return [
        '<div class="admin-controls">',
        '<button class="transfer-button" data-transfer-btn="true">Transfer Ownership</button>',
        '<div class="sliding-input" data-sliding-input="true">',
        '<select data-user-select="true">',
        '<option value="">Select new admin...</option>',
        options,
        '</select>',
        '<button class="confirm-button" data-confirm-btn="true">Confirm Transfer</button>',
        '<button class="cancel-button" data-cancel-btn="true">Cancel</button>',
        '</div>',
        '</div>'
    ].join('');
}

// Event handling functions
function attachChatEventListeners(element) {
    const listbox = element.querySelector('[data-listbox]');
    const transferBtn = element.querySelector('[data-transfer-btn]');
    const slidingInput = element.querySelector('[data-sliding-input]');
    const confirmBtn = element.querySelector('[data-confirm-btn]');
    const cancelBtn = element.querySelector('[data-cancel-btn]');
    const userSelect = element.querySelector('[data-user-select]');

    if (listbox) {
        listbox.addEventListener('click', function(e) {
            if (e.target.classList.contains('list-item')) {
                selectChatItem(element, e.target);
            }
        });
    }

    if (transferBtn && slidingInput) {
        transferBtn.addEventListener('click', function() {
            slidingInput.classList.toggle('show');
        });
    }

    if (confirmBtn && userSelect) {
        confirmBtn.addEventListener('click', function() {
            const newAdmin = userSelect.value;
            if (newAdmin) {
                handleOwnershipTransfer(element, newAdmin);
                if (slidingInput) {
                    slidingInput.classList.remove('show');
                }
            }
        });
    }

    if (cancelBtn && slidingInput && userSelect) {
        cancelBtn.addEventListener('click', function() {
            slidingInput.classList.remove('show');
            userSelect.value = '';
        });
    }
}

function selectChatItem(element, item) {
    // Remove active class from all items
    const allItems = element.querySelectorAll('.list-item');
    for (var i = 0; i < allItems.length; i++) {
        allItems[i].classList.remove('active');
    }
    
    // Add active class to selected item
    item.classList.add('active');
    
    // Create and dispatch custom event
    const eventDetail = {
        type: element.getAttribute('list-type'),
        value: item.getAttribute('data-channel') || item.getAttribute('data-handle')
    };
    
    const event = new CustomEvent('chat-item-selected', { detail: eventDetail });
    element.dispatchEvent(event);
}

function handleOwnershipTransfer(element, newAdmin) {
    const channelId = element.getAttribute('channel-id');
    const currentAdmin = element.getAttribute('user-handle');
    
    transferOwnership(channelId, newAdmin);
    
    // Store system message
    storeMessage(
        channelId,
        'Channel ownership transferred from ' + currentAdmin + ' to ' + newAdmin,
        'SYSTEM'
    );
    
    // Create and dispatch ownership transfer event
    const eventDetail = {
        channelId: channelId,
        oldAdmin: currentAdmin,
        newAdmin: newAdmin
    };
    
    const event = new CustomEvent('ownership-transferred', { detail: eventDetail });
    element.dispatchEvent(event);
    
    // Hide admin controls
    const adminControls = element.querySelector('.admin-controls');
    if (adminControls) {
        adminControls.style.display = 'none';
    }
}

// Main chat element initialization function
function initializeChatElement(element) {
    // Set up mutation observer to re-render when attributes change
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes') {
                renderChatElement(element);
            }
        });
    });
    
    observer.observe(element, {
        attributes: true,
        attributeFilter: ['list-type', 'channel-id', 'user-handle', 'admin-mode']
    });
    
    // Initial render
    renderChatElement(element);
}

// DotPipe integration - Register the chat element
function registerChatElement() {
    // Find all chat elements and initialize them
    const chatElements = document.querySelectorAll('chat');
    for (var i = 0; i < chatElements.length; i++) {
        initializeChatElement(chatElements[i]);
    }
    
    // Set up observer for dynamically added chat elements
    const bodyObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    if (node.tagName && node.tagName.toLowerCase() === 'chat') {
                        initializeChatElement(node);
                    }
                    // Check for chat elements within added nodes
                    const chatElements = node.querySelectorAll && node.querySelectorAll('chat');
                    if (chatElements) {
                        for (var i = 0; i < chatElements.length; i++) {
                            initializeChatElement(chatElements[i]);
                        }
                    }
                }
            });
        });
    });
    
    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Helper functions for external use
window.chatAPI = {
    // Message functions
    sendMessage: storeMessage,
    getMessages: getMessagesForUser,
    markReceived: markMessagesReceived,
    
    // Channel functions
    createChannel: createChannel,
    joinChannel: joinChannel,
    leaveChannel: leaveChannel,
    getChannels: getChannels,
    getChannelMembers: getChannelMembers,
    
    // Admin functions
    isAdmin: isChannelAdmin,
    getAdmin: getChannelAdmin,
    transferOwnership: transferOwnership,
    
    // Utility functions
    refreshChatElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element && element.tagName.toLowerCase() === 'chat') {
            renderChatElement(element);
        }
    },
    
    // State management
    getCurrentState: function() {
        return {
            channels: getChannels(),
            sessions: getStorageItem('chat_sessions', {}),
            messageCount: getStorageItem('chat_message_queue', []).length
        };
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerChatElement);
} else {
    registerChatElement();
}
