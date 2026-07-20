// ==========================================================================
// 1. INITIALIZATION & ELEMENT SELECTORS
// ==========================================================================
const inputValue = document.getElementById('inputValue');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const resultDisplay = document.getElementById('resultDisplay');
const swapBtn = document.getElementById('swapBtn');
const ctx = document.getElementById('comparisonChart').getContext('2d');

let comparisonChart; // ตัวแปรสำหรับเก็บ Instance ของ Chart.js

// ==========================================================================
// 2. DATA CONFIGURATION
// ==========================================================================
const factorsInMeter = {
    mm: 0.001, cm: 0.01, m: 1, km: 1000,
    in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344
};

const unitNames = {
    mm: 'มิลลิเมตร (mm)', cm: 'เซนติเมตร (cm)', m: 'เมตร (m)', km: 'กิโลเมตร (km)',
    in: 'นิ้ว (in)', ft: 'ฟุต (ft)', yd: 'หลา (yd)', mi: 'ไมล์ (mi)'
};

// ==========================================================================
// 3. CHART LOGIC (ฟังก์ชันสร้างและอัปเดตกราฟแท่ง)
// ==========================================================================
function updateChart(currentValueInMeters, currentToUnit) {
    // เลือกหน่วยที่จะนำมาแสดงเปรียบพบนแกนกากบาท (ไม่รวมหน่วยขนาดใหญ่/เล็กเกินไป เช่น km หรือ mi เพื่อไม่ให้กราฟต่างกันเกินไป)
    const displayUnits = ['cm', 'm', 'in', 'ft', 'yd'];
    
    // คำนวณหาค่าในแต่ละหน่วยเพื่อส่งให้กราฟ
    const chartDataValues = displayUnits.map(unit => {
        return Number((currentValueInMeters / factorsInMeter[unit]).toFixed(2));
    });

    // แมปชื่อภาษาไทยเพื่อแสดงเป็นป้ายกำกับใต้กราฟ (Labels)
    const chartLabels = displayUnits.map(unit => {
        return unit === currentToUnit ? `⭐ ${unitNames[unit]}` : unitNames[unit];
    });

    // กำหนดสีของแท่งกราฟ (ให้แท่งที่เป็นหน่วยผลลัพธ์ไฮไลต์เป็นสีทอง ไฮไลต์จุดสังเกต)
    const barColors = displayUnits.map(unit => {
        return unit === currentToUnit ? '#f59e0b' : '#115e59';
    });

    // ถ้าเคยสร้างกราฟไว้แล้ว ให้ทำลายอันเก่าก่อนสร้างใหม่ เพื่อป้องกันกราฟซ้อนทับกัน
    if (comparisonChart) {
        comparisonChart.destroy();
    }

    // เรียกใช้งาน Chart.js วาดกราฟแท่ง (Bar Chart)
    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'ความยาวเปรียบเทียบ',
                data: chartDataValues,
                backgroundColor: barColors,
                borderRadius: 6,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false } // ปิดคำอธิบายไอคอนด้านบนเพื่อความคลีน
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f3f4f6' },
                    ticks: { font: { family: 'Prompt' } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Prompt', size: 11 } }
                }
            }
        }
    });
}

// ==========================================================================
// 4. CORE LOGIC FUNCTION (ฟังก์ชันการคำนวณหลัก)
// ==========================================================================
function convertLength() {
    let value = parseFloat(inputValue.value);
    
    if (isNaN(value)) {
        resultDisplay.textContent = "โปรดระบุตัวเลข";
        return;
    }

    if (value < 0) {
        value = 0;
        inputValue.value = 0;
    }

    const from = fromUnit.value;
    const to = toUnit.value;

    const valueInMeters = value * factorsInMeter[from];
    const finalResult = valueInMeters / factorsInMeter[to];

    let precision = (finalResult < 0.001 && finalResult > 0) ? 6 : 4;
    const formattedResult = Number(finalResult.toFixed(precision));

    resultDisplay.textContent = `${formattedResult.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: precision})} ${unitNames[to]}`;

    // เรียกฟังก์ชันอัปเดตกราฟโดยส่ง "ค่ามิเตอร์กลาง" และ "หน่วยปลายทาง" ไปทำงาน
    updateChart(valueInMeters, to);
}

// ==========================================================================
// 5. SWAP & EVENT LISTENERS
// ==========================================================================
function swapUnits() {
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    convertLength();
}

inputValue.addEventListener('input', convertLength);
fromUnit.addEventListener('change', convertLength);
toUnit.addEventListener('change', convertLength);
swapBtn.addEventListener('click', swapUnits);

// สั่งทำงานครั้งแรกเมื่อโหลดหน้าเว็บ
convertLength();
