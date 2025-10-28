// ===============================
// 🌤️ DỰ BÁO THỜI TIẾT - ĐỖ HUỲNH GIA VĨ
// ===============================

// 🌀 Hiện thông báo đang tải
function showLoading() {
  document.getElementById("current-weather").innerHTML = `
    <div style="padding:20px; text-align:center; color:#0277bd;">
      <div class="spinner"></div>
      <p>Đang tải dữ liệu thời tiết...</p>
    </div>
  `;
}

// 📦 Bản đồ mã thời tiết → mô tả & icon PNG
function getWeatherInfo(code) {
  let iconCode;
  switch (code) {
    case 0: case 1: iconCode = "01d"; break;
    case 2: iconCode = "02d"; break;
    case 3: iconCode = "03d"; break;
    case 45: case 48: iconCode = "50d"; break;
    case 51: case 53: iconCode = "09d"; break;
    case 55: case 61: case 63: iconCode = "10d"; break;
    case 65: iconCode = "11d"; break;
    case 71: case 73: case 75: iconCode = "13d"; break;
    case 95: case 99: iconCode = "11d"; break;
    default: iconCode = "03d";
  }

  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const texts = {
    0: "Trời quang đãng", 1: "Gần như quang đãng",
    2: "Có mây rải rác", 3: "Nhiều mây",
    45: "Sương mù", 48: "Sương mù đông kết",
    51: "Mưa phùn nhẹ", 53: "Mưa phùn vừa", 55: "Mưa phùn dày",
    61: "Mưa nhỏ", 63: "Mưa vừa", 65: "Mưa to",
    71: "Tuyết nhẹ", 73: "Tuyết vừa", 75: "Tuyết dày",
    95: "Giông bão", 99: "Giông có mưa đá"
  };
  return { text: texts[code] || "Không xác định", icon: iconUrl };
}

// 📍 Lấy tọa độ từ tên thành phố (chỉ trong Việt Nam)
async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=vi&format=json`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    const loc = data.results[0];
    if (loc.country_code?.toUpperCase() !== "VN") return null;
    return loc;
  } catch (err) {
    console.error("Lỗi khi tìm tọa độ:", err);
    return null;
  }
}

// 🌡️ Lấy & hiển thị dữ liệu thời tiết
async function fetchWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const cw = data.current_weather;
    const info = getWeatherInfo(cw.weathercode);

    document.getElementById("current-weather").innerHTML = `
      <div style="background: linear-gradient(135deg, #5ec8ff, #3a9bdc); color: white; border-radius: 15px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); text-align:center;">
        <img src="${info.icon}" alt="${info.text}" style="width:80px;height:80px;">
        <h3>${info.text}</h3>
        <h2 style="font-size:2rem;">${cw.temperature}°C</h2>
        <p>Tốc độ gió: ${cw.windspeed} km/h</p>
        <p>Hướng gió: ${cw.winddirection}°</p>
        <p style="font-size:0.9rem;opacity:0.8;">Cập nhật lúc: ${new Date(cw.time).toLocaleString("vi-VN")}</p>
      </div>
      <div id="forecast" style="display:flex;justify-content:center;gap:10px;margin-top:15px;flex-wrap:wrap;"></div>
    `;

    const forecast = document.getElementById("forecast");
    const days = data.daily.time;
    const codes = data.daily.weathercode;
    const tempMax = data.daily.temperature_2m_max;
    const tempMin = data.daily.temperature_2m_min;

    for (let i = 0; i < days.length; i++) {
      const d = getWeatherInfo(codes[i]);
      forecast.innerHTML += `
        <div>
          <h4>${new Date(days[i]).toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" })}</h4>
          <img src="${d.icon}" alt="${d.text}">
          <p>${d.text}</p>
          <p style="font-weight:bold;">${tempMin[i]}°C - ${tempMax[i]}°C</p>
        </div>
      `;
    }
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu:", err);
    document.getElementById("current-weather").innerHTML = `
      <div style="padding:15px; background:#e57373; color:white; border-radius:10px;">⚠️ Lỗi khi tải dữ liệu thời tiết.</div>
    `;
  }
}

// 🔎 Khi người dùng nhập tên thành phố
async function getWeather(city) {
  showLoading();
  const loc = await getCoordinates(city);
  if (!loc) {
    document.getElementById("current-weather").innerHTML = `
      <p>Không tìm thấy thành phố này tại Việt Nam 🇻🇳.</p>
    `;
    return;
  }
  await fetchWeather(loc.latitude, loc.longitude);
}

// 🎯 Sự kiện click nút tìm kiếm
document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("city-input").value.trim();
  if (city) getWeather(city);
});
