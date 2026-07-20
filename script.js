// ==========================================================================
// 1. INITIALIZATION & ELEMENT SELECTORS (ดึง Element จาก HTML)
// ==========================================================================
const inputValue = document.getElementById('inputValue');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const resultDisplay = document.getElementById('resultDisplay');
const swapBtn = document.getElementById('swapBtn');

// ==========================================================================
// 2. DATA CONFIGURATION (ตั้งค่าอัตราส่วนหน่วยวัดโดยใช้ เมตร เป็นหน่วยกลาง)
// ==========================================================================
const factorsInMeter = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344
};

// ชื่อเต็มและสัญลักษณ์ภาษาไทยสำหรับนำไปแสดงผลบนหน้าจอให้สวยงาม
const unitNames = {
    mm: 'มิลลิเมตร (mm)',
    cm: 'เซนติเมตร (cm)',
    m: 'เมตร (m)',
    km: 'กิโลเมตร (km)',
    in: 'นิ้ว (in)',
    ft: 'ฟุต (ft)',
    yd: 'หลา (yd)',
    mi: 'ไมล์ (mi)'
};

// ==========================================================================
// 3. CORE LOGIC FUNCTION (ฟังก์ชันการคำนวณแปลงหน่วย)
// ==========================================================================
function convertLength() {
    let value = parseFloat(inputValue.value);
    
    // ดักข้อผิดพลาด: ถ้าผู้ใช้ไม่ได้พิมพ์ตัวเลข หรือ ลบข้อมูลจนหมด
    if (isNaN(value)) {
        resultDisplay.textContent = "โปรดระบุตัวเลข";
        return;
    }

    // ดักข้อผิดพลาด: ความยาวในเชิงวิศวกรรม/ก่อสร้างไม่ควรติดลบ
    if (value < 0) {
        value = 0;
        inputValue.value = 0;
    }

    const from = fromUnit.value;
    const to = toUnit.value;

    // สูตรการคิด: (ค่าเริ่มต้น * อัตราส่วนเมตรของหน่วยนั้น) / อัตราส่วนเมตรของหน่วยปลายทาง
    const valueInMeters = value * factorsInMeter[from];
    const finalResult = valueInMeters / factorsInMeter[to];

    // ปรับแต่งความละเอียดทศนิยม: ถ้าผลลัพธ์น้อยมากๆ ให้แสดง 6 ตำแหน่ง ถ้าปกติให้แสดง 4 ตำแหน่ง
    let precision = (finalResult < 0.001 && finalResult > 0) ? 6 : 4;
    const formattedResult = Number(finalResult.toFixed(precision));

    // แสดงผลลัพธ์บนหน้าเว็บในรูปแบบที่อ่านง่าย (.toLocaleString ช่วยใส่คอมม่าคั่นหลักพันให้)
    resultDisplay.textContent = `${formattedResult.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: precision})} ${unitNames[to]}`;
}

// ==========================================================================
// 4. SWAP FUNCTION (ฟังก์ชันสำหรับกดปุ่มสลับหน่วยต้นทาง-ปลายทาง)
// ==========================================================================
function swapUnits() {
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    
    // เมื่อสลับหน่วยเสร็จแล้ว ให้สั่งคำนวณผลลัพธ์ใหม่ทันที
    convertLength();
}

// ==========================================================================
// 5. EVENT LISTENERS (ระบบตรวจจับการเปลี่ยนแปลงบนหน้าเว็บ)
// ==========================================================================
// คำนวณทันทีเมื่อมีการพิมพ์ตัวเลข หรือเปลี่ยนตัวเลือกใน Dropdown
inputValue.addEventListener('input', convertLength);
fromUnit.addEventListener('change', convertLength);
toUnit.addEventListener('change', convertLength);

// ทำงานเมื่อคลิกปุ่มสลับหน่วย (Swap)
swapBtn.addEventListener('click', swapUnits);

// สั่งให้โปรแกรมคำนวณ 1 ครั้งอัตโนมัติเมื่อเปิดหน้าเว็บครั้งแรก
convertLength();