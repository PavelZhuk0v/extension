const shortenBtn = document.createElement('button');
shortenBtn.id = 'shortenText';
shortenBtn.innerText = "Сократить";
shortenBtn.style.display = "none";
document.body.appendChild(shortenBtn);

let isActive = false;

browser.storage.local.get('isSelectModeActive').then((data) => {
    isActive = data.isSelectModeActive || false;
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleSelectMode") {
        isActive = message.enabled;
        if (!isActive) {
            shortenBtn.style.display = 'none';
        }
    }
});

shortenBtn.addEventListener('mousedown', async (e) => {
    e.preventDefault();

    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) return;

    const data = await browser.storage.local.get('reductionPercent');
    const finalPercent = data.reductionPercent || 50;

    const jsonData = {
        text: selectedText,
        reduction: parseInt(finalPercent, 10)
    };

    console.log("Данные отправляются в фон:", jsonData);

    browser.runtime.sendMessage({
        action: "sendToServer",
        data: jsonData
    }, (response) => {
        if (browser.runtime.lastError) {
            console.error("Ошибка связи:", browser.runtime.lastError);
            alert("Ошибка связи с расширением. Перезагрузите страницу сайта (F5).");
            return;
        }

        if (response && response.success) {
            alert(response.message);
        } else {
            console.error("Ошибка от сервера:", response?.error);
            alert("Не удалось сжать текст. Проверьте консоль или server.py");
        }
    });

    shortenBtn.style.display = 'none';
});

document.addEventListener('mouseup', () => {
    if (!isActive) return;

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 5) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        shortenBtn.style.left = `${rect.left + window.scrollX}px`;
        shortenBtn.style.top = `${rect.top + window.scrollY - 35}px`;
        shortenBtn.style.display = 'block';
    } else {
        shortenBtn.style.display = 'none';
    }
});

document.addEventListener('mousedown', (e) => {
    if (e.target !== shortenBtn) {
        shortenBtn.style.display = 'none';
    }
});