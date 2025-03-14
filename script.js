// تحديث الساعة
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

// جلب بيانات الطقس
async function fetchWeather() {
    const apiKey = '23fc01f97a7dc8491f9d0905a0e47b7b'; // ضع مفتاح API الخاص بك هنا
    const city = 'Tolga, DZ';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ar&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        document.getElementById('temperature').textContent = `درجة الحرارة: ${data.main.temp}°C`;
        document.getElementById('description').textContent = `الوصف: ${data.weather[0].description}`;
    } catch (error) {
        document.getElementById('temperature').textContent = 'تعذر جلب الطقس';
        document.getElementById('description').textContent = '';
    }
}

// استدعاء الطقس عند تحميل الصفحة
fetchWeather();
