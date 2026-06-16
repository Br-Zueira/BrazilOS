setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleString();
}, 1000);