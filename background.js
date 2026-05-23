const api = typeof browser !== 'undefined' ? browser : chrome;

api.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendToServer") {
        fetch('http://127.0.0.1:8000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request.data)
        })
        .then(response => {
            if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
            return response.json();
        })
        .then(data => sendResponse({ success: true, message: data.message }))
        .catch(error => sendResponse({ success: false, error: error.toString() }));

        return true;
    }
});