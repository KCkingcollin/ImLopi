setInterval(() => {
    const button = document.getElementById('lopiButton');
    const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    button.dispatchEvent(clickEvent);
}, 100);