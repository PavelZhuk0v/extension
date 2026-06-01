const api = typeof browser !== 'undefined' ? browser : chrome;

api.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendToServer") {

        handleServerRequest(request.data)
            .then(message => {
                sendResponse({ success: true, message: message });
            })
            .catch(error => {
                console.error("Ошибка в фоновом процессе:", error);
                sendResponse({ success: false, error: error.toString() });
            });

        return true;
    }
});

async function handleServerRequest(data) {
    const response = await fetch('http://127.0.0.1:8000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const result = await response.json();
    return result.message;
}