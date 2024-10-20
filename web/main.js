let username = '';
let channel = '';

function submitUsernameAndChannel(event) {
    if (event) event.preventDefault();
    username = document.getElementById('username').value.trim();
    channel = document.getElementById('channel').value.trim();
    if(!channel) {
        channel ='general';
    }
    if (username) {
        document.getElementById('usernameInput').style.display = 'none';
        document.getElementById('chat').style.display = 'block';
        startWebSocket();
    } else {
        alert('Please enter a valid username.');
    }
}


function startWebSocket() {
    const messages = document.getElementById('messages');
    const form = document.getElementById('form');
    const input = document.getElementById('input');

    const ws = new WebSocket(`ws://localhost:8080/ws/${channel}`);

    ws.onmessage = (event) => {
        const message = document.createElement('div');
        message.textContent = event.data;
        messages.appendChild(message);
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = input.value.trim();
        if (message) {
            ws.send(username + ': ' + message);
            input.value = '';
        }
    });
}

// Add event listener for Enter key in the username input field
const usernameInput = document.getElementById('username');
usernameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        submitUsernameAndChannel(event);
    }
});