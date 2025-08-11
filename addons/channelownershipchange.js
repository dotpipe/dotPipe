class ChatOwnershipChange extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const channelId = this.getAttribute('channel-id');
        const userHandle = this.getAttribute('user-handle');
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .ownership-controls {
                    margin-top: 10px;
                }
                .transfer-button {
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 10px;
                }
                .transfer-button:hover {
                    background: #218838;
                }
                .sliding-input {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease-out;
                }
                .sliding-input.show {
                    max-height: 100px;
                }
                .user-select {
                    width: 100%;
                    padding: 8px;
                    margin: 10px 0;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                .confirm-button {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 5px;
                }
                .cancel-button {
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                }
            </style>
            <div class="ownership-controls">
                <button class="transfer-button" id="transferBtn">
                    Transfer Ownership
                </button>
                <div class="sliding-input" id="slidingInput">
                    <select class="user-select" id="userSelect">
                        <option value="">Select new admin...</option>
                        ${this.renderUserOptions(channelId, userHandle)}
                    </select>
                    <button class="confirm-button" id="confirmBtn">Confirm Transfer</button>
                    <button class="cancel-button" id="cancelBtn">Cancel</button>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderUserOptions(channelId, currentAdmin) {
        const membersKey = `channel_members_${channelId}`;
        const members = JSON.parse(localStorage.getItem(membersKey) || '[]');
        
        return members
            .filter(member => member !== currentAdmin)
            .map(member => `<option value="${member}">${member}</option>`)
            .join('');
    }

    attachEventListeners() {
        const transferBtn = this.shadowRoot.getElementById('transferBtn');
        const slidingInput = this.shadowRoot.getElementById('slidingInput');
        const confirmBtn = this.shadowRoot.getElementById('confirmBtn');
        const cancelBtn = this.shadowRoot.getElementById('cancelBtn');
        const userSelect = this.shadowRoot.getElementById('userSelect');

        transferBtn.addEventListener('click', () => {
            slidingInput.classList.toggle('show');
        });

        confirmBtn.addEventListener('click', () => {
            const newAdmin = userSelect.value;
            if (newAdmin) {
                this.transferOwnership(newAdmin);
                slidingInput.classList.remove('show');
            }
        });

        cancelBtn.addEventListener('click', () => {
            slidingInput.classList.remove('show');
            userSelect.value = '';
        });
    }

    transferOwnership(newAdmin) {
        const channelId = this.getAttribute('channel-id');
        const currentAdmin = this.getAttribute('user-handle');
        
        // Update channel admin in storage
        const adminKey = `channel_admin_${channelId}`;
        localStorage.setItem(adminKey, newAdmin);
        
        // Create ownership transfer message
        const messageQueue = new ChatMessageQueue();
        messageQueue.storeMessage(
            channelId,
            `Channel ownership transferred from ${currentAdmin} to ${newAdmin}`,
            'SYSTEM'
        );
        
        // Emit ownership change event
        const event = new CustomEvent('ownership-transferred', {
            detail: {
                channelId,
                oldAdmin: currentAdmin,
                newAdmin
            }
        });
        this.dispatchEvent(event);
        
        // Hide admin controls for current user
        this.style.display = 'none';
    }
}

customElements.define('chat-ownership-change', ChatOwnershipChange);
