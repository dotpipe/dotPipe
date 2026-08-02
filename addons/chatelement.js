class ChatElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.messageQueue = [];
        this.sessionData = {};
        this.lastSeen = {};
    }

    static get observedAttributes() {
        return ['list-type', 'channel-id', 'user-handle', 'admin-mode'];
    }

    connectedCallback() {
        this.render();
        this.initializeChat();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const listType = this.getAttribute('list-type') || 'channel';
        const channelId = this.getAttribute('channel-id');
        const userHandle = this.getAttribute('user-handle');
        const isAdmin = this.hasAttribute('admin-mode');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                }
                .chat-container {
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 10px;
                    max-width: 400px;
                }
                .listbox {
                    max-height: 200px;
                    overflow-y: auto;
                    border: 1px solid #ddd;
                    padding: 5px;
                    margin-bottom: 10px;
                }
                .list-item {
                    padding: 5px;
                    cursor: pointer;
                    border-bottom: 1px solid #eee;
                }
                .list-item:hover {
                    background-color: #f0f0f0;
                }
                .list-item.active {
                    background-color: #007bff;
                    color: white;
                }
                .admin-controls {
                    display: ${isAdmin ? 'block' : 'none'};
                    margin-top: 10px;
                }
                .ownership-transfer {
                    display: none;
                    margin-top: 10px;
                }
                .transfer-button {
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .sliding-input {
                    margin-top: 10px;
                    display: none;
                }
                .sliding-input.show {
                    display: block;
                    animation: slideDown 0.3s ease-out;
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                select {
                    width: 100%;
                    padding: 5px;
                    margin: 5px 0;
                }
            </style>
            <div class="chat-container">
                <div class="listbox" id="listbox">
                    ${this.renderListItems(listType, channelId)}
                </div>
                <div class="admin-controls">
                    <chat-ownership-change channel-id="${channelId}" user-handle="${userHandle}">
                    </chat-ownership-change>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderListItems(listType, channelId) {
        if (listType === 'channel') {
            return this.renderChannels();
        } else if (listType === 'handle') {
            return this.renderHandles(channelId);
        }
        return '';
    }

    renderChannels() {
        const channels = this.getChannelsFromStorage();
        return channels.map(channel => 
            `<div class="list-item" data-channel="${channel.id}">${channel.name}</div>`
        ).join('');
    }

    renderHandles(channelId) {
        const handles = this.getHandlesFromStorage(channelId);
        return handles.map(handle => 
            `<div class="list-item" data-handle="${handle.name}">${handle.name}</div>`
        ).join('');
    }

    attachEventListeners() {
        const listbox = this.shadowRoot.getElementById('listbox');
        listbox.addEventListener('click', (e) => {
            if (e.target.classList.contains('list-item')) {
                this.selectItem(e.target);
            }
        });
    }

    selectItem(item) {
        // Remove active class from all items
        this.shadowRoot.querySelectorAll('.list-item').forEach(el => 
            el.classList.remove('active')
        );
        
        // Add active class to selected item
        item.classList.add('active');
        
        // Emit custom event
        const event = new CustomEvent('chat-item-selected', {
            detail: {
                type: this.getAttribute('list-type'),
                value: item.dataset.channel || item.dataset.handle
            }
        });
        this.dispatchEvent(event);
    }
}

customElements.define('chat', ChatElement);
