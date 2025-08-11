// Stateless version using URL parameters and session storage
class StatelessChatManager {
    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
    }

    // Get current state from URL and session
    getCurrentState() {
        return {
            channelId: this.urlParams.get('channel') || sessionStorage.getItem('currentChannel'),
            userHandle: this.urlParams.get('user') || sessionStorage.getItem('userHandle'),
            listType: this.urlParams.get('view') || 'channel'
        };
    }

    // Update state and URL
    updateState(newState) {
        Object.keys(newState).forEach(key => {
            if (newState[key]) {
                this.urlParams.set(key, newState[key]);
                sessionStorage.setItem(key, newState[key]);
            }
        });
        
        // Update URL without page reload
        const newUrl = `${window.location.pathname}?${this.urlParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    }

    // Initialize chat from current state
    initializeFromState() {
        const state = this.getCurrentState();
        
        if (state.channelId && state.userHandle) {
            const chatElement = document.querySelector('chat');
            chatElement.setAttribute('channel-id', state.channelId);
            chatElement.setAttribute('user-handle', state.userHandle);
            chatElement.setAttribute('list-type', state.listType);
        }
    }
}

// Usage in HTML
// <chat id="statelessChat"></chat>
// <script>
//     const statelessManager = new StatelessChatManager();
//     statelessManager.initializeFromState();
// </script>
