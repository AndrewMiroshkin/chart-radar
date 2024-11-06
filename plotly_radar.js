const LIGHT_SPEED = 300000; 
const MAX_RADIUS = 100; 
const scanResults = {};

// Ініціалізація графіка
Plotly.newPlot('chart-radar', [{
    type: 'scatterpolar',
    mode: 'markers',
    r: [],
    theta: [],
    marker: {
        color: [],
        size: 8,
    },
}], {
    polar: {
        radialaxis: {
            range: [0, MAX_RADIUS],
            showline: true,
        },
        angularaxis: {
            direction: "clockwise",
        },
    },
    showlegend: false,
});

// Функція для обчислення яскравості
function calculateBrightness(power, distance) {
    let result = Math.min(1, ((power / distance) * 300));
    return result;
}

// Функція для оновлення графіка
function updateChart(scanData) {
    scanResults[scanData.scanAngle] = scanData.echoResponses.map(response => {
        return {
            distance: (response.time * LIGHT_SPEED) / 2,
            power: response.power,
        };
    });

    const radii = [];
    const angles = [];
    const colors = [];

    for (const [angle, responses] of Object.entries(scanResults)) {
        responses.forEach(response => {
            if (response.distance > 0) {
                const brightness = calculateBrightness(response.power, response.distance);
                radii.push(response.distance);
                angles.push(angle);
                colors.push(`rgba(36, 170, 54, ${brightness})`);
            }
        });
    }
    
    Plotly.update('chart-radar', {
        r: [radii],
        theta: [angles],
        marker: { color: colors },
    });
}

// Функція для зміни параметрів вимірювальної частини радару
function updateRadarConfig(config) {
    fetch('http://localhost:4000/config', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Конфігурація оновлена:', data);
    })
    .catch(error => {
        console.error('Помилка оновлення конфігурації:', error);
    });
}

// Підключення до WebSocket сервера
const socket = new WebSocket('ws://localhost:4000');

socket.onopen = () => {
    console.log('Підключено до WebSocket сервера');
};

socket.onmessage = (event) => {
    //console.log('Отримані дані:', event.data);
    const data = JSON.parse(event.data);
    updateChart(data);
};

socket.onclose = () => {
    console.log('З\'єднання закрито');
};

socket.onerror = (error) => {
    console.error('Помилка WebSocket:', error);
};

updateRadarConfig({
    measurementsPerRotation: 360,
    rotationSpeed: 60,
    targetSpeed: 500
});
