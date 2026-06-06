// Load saved data, or start fresh (Using NGN defaults)
let balance = parseFloat(localStorage.getItem('balance')) || 1000000; // Increased starting balance for NGN
let btcHeld = parseFloat(localStorage.getItem('btcHeld')) || 0;
let currentPrice = 95000000; // Adjusted for a realistic BTC/NGN price
let lastPrice = 95000000;

function saveProgress() {
    localStorage.setItem('balance', balance);
    localStorage.setItem('btcHeld', btcHeld);
}

function updateDisplay() {
    const priceEl = document.getElementById('btc-price');
    // Using Nigerian locale (en-NG) and NGN currency
    const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
    });

    document.getElementById('balance').innerText = formatter.format(balance);
    document.getElementById('btc-price').innerText = formatter.format(currentPrice);
    document.getElementById('holdings').innerText = btcHeld.toFixed(4) + ' BTC';
    
    priceEl.className = currentPrice >= lastPrice ? 'up' : 'down';
}

function addLog(msg) {
    const log = document.getElementById('trade-log');
    const entry = document.createElement('li');
    entry.innerText = msg;
    log.prepend(entry);
}

// Market Simulator: Prices now fluctuate in NGN ranges
setInterval(() => {
    lastPrice = currentPrice;
    const change = (Math.random() * 2000000) - 1000000; // Bigger volatility for Naira
    currentPrice += change;
    updateDisplay();
}, 3000);

document.getElementById('buy-btn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('trade-amount').value);
    const cost = amount * currentPrice;
    if (amount > 0 && balance >= cost) {
        balance -= cost;
        btcHeld += amount;
        addLog(`Bought ${amount} BTC @ ₦${currentPrice.toLocaleString()}`);
        saveProgress();
        updateDisplay();
    } else {
        alert("Check your balance!");
    }
});

document.getElementById('sell-btn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('trade-amount').value);
    if (amount > 0 && btcHeld >= amount) {
        balance += (amount * currentPrice);
        btcHeld -= amount;
        addLog(`Sold ${amount} BTC @ ₦${currentPrice.toLocaleString()}`);
        saveProgress();
        updateDisplay();
    } else {
        alert("Not enough BTC!");
    }
});

updateDisplay();