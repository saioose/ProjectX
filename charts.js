// Get container elements
const btc15mContainer = document.getElementById('btc-15m-chart-container');
const btc1hContainer = document.getElementById('btc-1h-chart-container');
const eth15mContainer = document.getElementById('eth-15m-chart-container');
const eth1hContainer = document.getElementById('eth-1h-chart-container');

// Create the charts dynamically based on container size
const btcChart15m = LightweightCharts.createChart(btc15mContainer, {
    width: btc15mContainer.clientWidth,
    height: btc15mContainer.clientHeight,
    layout: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
    },
    grid: {
        vertLines: {
            color: '#eeeeee',
        },
        horzLines: {
            color: '#eeeeee',
        },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
    },
    priceScale: {
        borderColor: '#ccc',
    },
    timeScale: {
        borderColor: '#ccc',
        visible: true,
    },
});

const btcCandlestickSeries15m = btcChart15m.addCandlestickSeries();
const btcChart1h = LightweightCharts.createChart(btc1hContainer, {
    width: btc1hContainer.clientWidth,
    height: btc1hContainer.clientHeight,
    layout: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
    },
    grid: {
        vertLines: {
            color: '#eeeeee',
        },
        horzLines: {
            color: '#eeeeee',
        },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
    },
    priceScale: {
        borderColor: '#ccc',
    },
    timeScale: {
        borderColor: '#ccc',
        visible: true,
    },
});

const btcCandlestickSeries1h = btcChart1h.addCandlestickSeries();
const ethChart15m = LightweightCharts.createChart(eth15mContainer, {
    width: eth15mContainer.clientWidth,
    height: eth15mContainer.clientHeight,
    layout: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
    },
    grid: {
        vertLines: {
            color: '#eeeeee',
        },
        horzLines: {
            color: '#eeeeee',
        },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
    },
    priceScale: {
        borderColor: '#ccc',
    },
    timeScale: {
        borderColor: '#ccc',
        visible: true,
    },
});

const ethCandlestickSeries15m = ethChart15m.addCandlestickSeries();
const ethChart1h = LightweightCharts.createChart(eth1hContainer, {
    width: eth1hContainer.clientWidth,
    height: eth1hContainer.clientHeight,
    layout: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
    },
    grid: {
        vertLines: {
            color: '#eeeeee',
        },
        horzLines: {
            color: '#eeeeee',
        },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
    },
    priceScale: {
        borderColor: '#ccc',
    },
    timeScale: {
        borderColor: '#ccc',
        visible: true,
    },
});

const ethCandlestickSeries1h = ethChart1h.addCandlestickSeries();

// WebSocket connections for BTC and ETH (15m and 1h candles)
const btc15mSocket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_15m');
const btc1hSocket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1h');
const eth15mSocket = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@kline_15m');
const eth1hSocket = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@kline_1h');

// Function to handle the WebSocket messages for candles and update the percentage display for BTC and ETH
function handleKlineData(kline, asset, timeframe) {
    const open = parseFloat(kline.o);
    const close = parseFloat(kline.c);

    // Calculate percentage change for the current candle
    const percentageChange = ((close - open) / open) * 100;

    // Store the most recent percentage change in sessionStorage (or localStorage)
    const percentageKey = `${asset}-${timeframe}-percentage`;
    sessionStorage.setItem(percentageKey, percentageChange.toFixed(2));

    // Display the percentage change for the respective asset and timeframe
    if (asset === 'btc' && timeframe === '15m') {
        const btc15mPercentageElement = document.getElementById('percentage-display-btc-15m');
        btc15mPercentageElement.innerText = `BTC 15m Percentage Change: ${percentageChange.toFixed(2)}%`;
    } else if (asset === 'btc' && timeframe === '1h') {
        const btc1hPercentageElement = document.getElementById('percentage-display-btc-1h');
        btc1hPercentageElement.innerText = `BTC 1h Percentage Change: ${percentageChange.toFixed(2)}%`;
    } else if (asset === 'eth' && timeframe === '15m') {
        const eth15mPercentageElement = document.getElementById('percentage-display-eth-15m');
        eth15mPercentageElement.innerText = `ETH 15m Percentage Change: ${percentageChange.toFixed(2)}%`;
    } else if (asset === 'eth' && timeframe === '1h') {
        const eth1hPercentageElement = document.getElementById('percentage-display-eth-1h');
        eth1hPercentageElement.innerText = `ETH 1h Percentage Change: ${percentageChange.toFixed(2)}%`;
    }

    // Calculate and display the Helix values
    calculateAndDisplayHelix();
}

// Function to calculate the Helix values
function calculateAndDisplayHelix() {
    // Retrieve the latest percentage changes for BTC and ETH
    const btc15m = parseFloat(sessionStorage.getItem('btc-15m-percentage'));
    const eth15m = parseFloat(sessionStorage.getItem('eth-15m-percentage'));
    const btc1h = parseFloat(sessionStorage.getItem('btc-1h-percentage'));
    const eth1h = parseFloat(sessionStorage.getItem('eth-1h-percentage'));

    // Calculate the Helix values for 15m and 1h
    let helix15m = 0;
    let helix1h = 0;

    if (!isNaN(btc15m) && !isNaN(eth15m)) {
        helix15m = btc15m - eth15m;
        const helix15mElement = document.getElementById('helix-display-15m');
        helix15mElement.innerText = `Helix 15m: ${helix15m.toFixed(2)}%`;
    }

    if (!isNaN(btc1h) && !isNaN(eth1h)) {
        helix1h = btc1h - eth1h;
        const helix1hElement = document.getElementById('helix-display-1h');
        helix1hElement.innerText = `Helix 1h: ${helix1h.toFixed(2)}%`;
    }

    // Save the Helix data to a CSV file
    saveHelixToServer(helix15m, helix1h);
}

// Function to send Helix data to the server for storage
function saveHelixToServer(helix15m, helix1h) {
    const timestamp = Date.now();  // Unix timestamp

    // Format data for sending to server
    const helixData = {
        timestamp: timestamp,
        helix15m: helix15m.toFixed(2),
        helix1h: helix1h.toFixed(2),
    };

    // Send data to backend server via POST request
    fetch('http://localhost:3000/api/saveHelixData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(helixData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data successfully saved:', data);
    })
    .catch(error => {
        console.error('Error saving data:', error);
    });
}


// WebSocket handlers for each chart
btc15mSocket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    const kline = message.k;
    handleKlineData(kline, 'btc', '15m');
    btcCandlestickSeries15m.setData([{
        time: kline.t / 1000,
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c)
    }]);
};

btc1hSocket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    const kline = message.k;
    handleKlineData(kline, 'btc', '1h');
    btcCandlestickSeries1h.setData([{
        time: kline.t / 1000,
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c)
    }]);
};

eth15mSocket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    const kline = message.k;
    handleKlineData(kline, 'eth', '15m');
    ethCandlestickSeries15m.setData([{
        time: kline.t / 1000,
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c)
    }]);
};

eth1hSocket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    const kline = message.k;
    handleKlineData(kline, 'eth', '1h');
    ethCandlestickSeries1h.setData([{
        time: kline.t / 1000,
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c)
    }]);
};

// Function to handle window resizing
window.addEventListener('resize', () => {
    // Resize charts when the window is resized
    btcChart15m.resize(btc15mContainer.clientWidth, btc15mContainer.clientHeight);
    btcChart1h.resize(btc1hContainer.clientWidth, btc1hContainer.clientHeight);
    ethChart15m.resize(eth15mContainer.clientWidth, eth15mContainer.clientHeight);
    ethChart1h.resize(eth1hContainer.clientWidth, eth1hContainer.clientHeight);
});
