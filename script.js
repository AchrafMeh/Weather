// تحديث الساعة بدقة وبدون اهتزاز للواجهة
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
}
setInterval(updateClock, 1000);
updateClock();

// جلب بيانات الطقس لمدينة طولقة
async function fetchWeather() {
    const apiKey = '23fc01f97a7dc8491f9d0905a0e47b7b'; 
    const city = 'Tolga, DZ';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ar&appid=${apiKey}`;

    const tempElement = document.getElementById('temperature');
    const descElement = document.getElementById('description');

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('فشل في جلب البيانات');
        
        const data = await response.json();
        
        // إزالة فئة الـ loading وتحديث النصوص بسلاسة
        tempElement.classList.remove('loading-text');
        descElement.classList.remove('loading-text');
        
        tempElement.textContent = `درجة الحرارة الحالية: ${Math.round(data.main.temp)}°C`;
        descElement.textContent = `حالة الجو: ${data.weather[0].description}`;
    } catch (error) {
        console.error(error);
        tempElement.classList.remove('loading-text');
        descElement.classList.remove('loading-text');
        tempElement.textContent = 'تعذر جلب بيانات الطقس حالياً';
        descElement.textContent = 'يرجى التحقق من الاتصال بالإنترنت';
    }
}

// استدعاء الدالة فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', fetchWeather);
