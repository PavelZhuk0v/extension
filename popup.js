//создание всплывающей кнопки
const shortenBtn = document.createElement('button');
shortenBtn.id = 'shortenText';
shortenBtn.innerText = "Сократить";
shortenBtn.style.display = "none";
document.body.appendChild(shortenBtn);

document.addEventListener('mouseup', (event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    shortenBtn.addEventListener('mousedown', async (e) => {
    e.preventDefault(); 

    const selectedText = window.getSelection().toString();

    const data = await browser.storage.local.get('reductionPercent');

    const finalPercent = data.reductionPercent || 50;

    const jsonData = {
        text: selectedText,
        reduction: finalPercent
    };

    console.log("Данные готовы к отправке:", jsonData);

    let response = await fetch('/http://localhost:3000/form', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(jsonData)
    });

    let result = await response.json();
    alert(result.message);
    sendToServer(jsonData); 

    shortenBtn.style.display = 'none';
});

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