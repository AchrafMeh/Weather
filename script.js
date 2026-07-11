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

// ضع رابط تحميل التطبيق الخاص بك هنا بين القوسين
const DOWNLOAD_URL = "https://www.mediafire.com/file/cfj35787p3ftg8z/TOLGA-M%25C3%2589T%25C3%2589O.apk/file"; 

// تعيين الرابط لزر التحميل
document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('download-btn');
    if(downloadBtn) {
        downloadBtn.href = DOWNLOAD_URL;
    }
});

// جلب بيانات الطقس الحالي والتوقعات لمدينة طولقة
async function fetchWeather() {
    const apiKey = '23fc01f97a7dc8491f9d0905a0e47b7b'; 
    const city = 'Tolga, DZ';
    
    // روابط جلب الطقس الحالي والتوقعات (الساعات والأيام)
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ar&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ar&appid=${apiKey}`;

    const tempElement = document.getElementById('temperature');
    const descElement = document.getElementById('description');
    const iconContainer = document.getElementById('weather-icon-container');
    const hourlyContainer = document.getElementById('hourly-forecast');
    const dailyContainer = document.getElementById('daily-forecast');

    // 1. جلب الطقس الحالي
    try {
        const response = await fetch(currentWeatherUrl);
        if (!response.ok) throw new Error('فشل في جلب البيانات الحالية');
        const data = await response.json();
        
        tempElement.classList.remove('loading-text');
        descElement.classList.remove('loading-text');
        
        tempElement.textContent = `درجة الحرارة الحالية: ${Math.round(data.main.temp)}°C`;
        descElement.textContent = `حالة الجو: ${data.weather[0].description}`;
        
        // إضافة صورة وصف حالة الطقس الرسمية
        const iconCode = data.weather[0].icon;
        iconContainer.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${data.weather[0].description}" class="weather-icon">`;
        
    } catch (error) {
        console.error(error);
        tempElement.textContent = 'تعذر جلب بيانات الطقس حالياً';
        descElement.textContent = 'يرجى التحقق من الاتصال بالإنترنت';
    }

    // 2. جلب التوقعات بالساعات والأيام
    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) throw new Error('فشل في جلب التوقعات');
        const data = await response.json();
        
        // تنظيف الحاويات من نصوص التحميل
        hourlyContainer.innerHTML = '';
        dailyContainer.innerHTML = '';
        
        // عرض الطقس بالساعات (أول 5 فترات مستقبلية - كل فترة 3 ساعات)
        for (let i = 0; i < 5; i++) {
            const item = data.list[i];
            const time = new Date(item.dt_txt).toLocaleTimeString('ar-DZ', {hour: '2-digit', minute:'2-digit'});
            const temp = Math.round(item.main.temp);
            const icon = item.weather[0].icon;
            
            hourlyContainer.innerHTML += `
                <div class="forecast-item">
                    <span>${time}</span>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="طقس">
                    <strong>${temp}°C</strong>
                </div>
            `;
        }

        // عرض الطقس بالأيام (ناخذ قراءة واحدة من كل يوم ليلا أو نهارا)
        const daysAdded = {};
        data.list.forEach(item => {
            const dateStr = new Date(item.dt_txt).toLocaleDateString('ar-DZ', {weekday: 'long'});
            const todayStr = new Date().toLocaleDateString('ar-DZ', {weekday: 'long'});
            
            // لتجنب تكرار نفس اليوم، نأخذ قراءة واحدة فقط لكل يوم مستقبلي
            if (!daysAdded[dateStr] && dateStr !== todayStr && Object.keys(daysAdded).length < 4) {
                daysAdded[dateStr] = true;
                const temp = Math.round(item.main.temp);
                const icon = item.weather[0].icon;
                const desc = item.weather[0].description;
                
                dailyContainer.innerHTML += `
                    <div class="daily-item">
                        <span class="day-name">${dateStr}</span>
                        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}">
                        <span class="day-desc">${desc}</span>
                        <strong>${temp}°C</strong>
                    </div>
                `;
            }
        });

    } catch (error) {
        console.error(error);
        hourlyContainer.innerHTML = '<p>تعذر جلب التوقعات بالساعات</p>';
        dailyContainer.innerHTML = '<p>تعذر جلب التوقعات بالأيام</p>';
    }
}

document.addEventListener('DOMContentLoaded', fetchWeather);
