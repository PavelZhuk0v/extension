const shortenBtn = document.createElement('button');
shortenBtn.id = 'shortenText';
shortenBtn.innerText = "Сократить";
shortenBtn.style.display = "none";
document.body.appendChild(shortenBtn);

const api = typeof browser !== 'undefined' ? browser : chrome;

let isActive = false;

function checkContextAndGetStatus() {
    if (!api.runtime?.id) return; // Контекст расширения уничтожен (нужно обновить страницу)

    api.storage.local.get('isSelectModeActive', (data) => {
        if (api.runtime?.id) {
            isActive = data.isSelectModeActive || false;
        }
    });
}

checkContextAndGetStatus();

api.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleSelectMode") {
        isActive = message.enabled;
        if (!isActive) {
            shortenBtn.style.display = 'none';
        }
    }
});

api.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.isSelectModeActive) {
        isActive = changes.isSelectModeActive.newValue;
        if (!isActive) {
            shortenBtn.style.display = 'none';
        }
    }
});

document.addEventListener('mouseup', () => {
    if (!isActive) return;

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 5) {
        try {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            shortenBtn.style.left = `${rect.left + window.scrollX}px`;
            shortenBtn.style.top = `${rect.top + window.scrollY - 35}px`;
            shortenBtn.style.display = 'block';
        } catch (e) {
            console.error(e);
        }
    } else {
        shortenBtn.style.display = 'none';
    }
});

document.addEventListener('mousedown', (e) => {
    if (e.target !== shortenBtn) {
        shortenBtn.style.display = 'none';
    }
});

shortenBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();

    if (!api.runtime?.id) {
        alert("Контекст расширения обновился. Пожалуйста, просто перезагрузите эту вкладку (F5).");
        return;
    }

    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) return;

    api.storage.local.get('reductionPercent', (data) => {
        const finalPercent = data.reductionPercent || 50;

        const jsonData = {
            text: selectedText,
            reduction: parseInt(finalPercent, 10)
        };

        api.runtime.sendMessage({
            action: "sendToServer",
            data: jsonData
        }, (response) => {
            if (api.runtime.lastError) {
                console.error("Ошибка связи:", api.runtime.lastError);
                alert("Ошибка связи с расширением. Перезагрузите страницу (F5).");
                return;
            }

            if (response && response.success) {
                alert(response.message);
            } else {
                alert(response?.error || "Не удалось связаться с сервером. Проверьте server.py.");
            }
        });
    });

    shortenBtn.style.display = 'none';
});