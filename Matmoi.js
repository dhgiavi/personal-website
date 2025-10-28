function showSection(sectionId) {
  const sections = document.querySelectorAll(".content-section");

  sections.forEach(sec => {
    if (sec.id === sectionId) {
      // Nếu là section cần hiển thị
      sec.style.display = "block";
      setTimeout(() => sec.classList.add("active"), 50);
    } else {
      // Ẩn mượt các section khác
      sec.classList.remove("active");
      setTimeout(() => (sec.style.display = "none"), 400);
    }
  });
}

//  WEATHER API
document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("city-input");
  const searchBtn = document.getElementById("search-btn");
  const weatherBox = document.getElementById("current-weather");

  if (searchBtn) {
    searchBtn.addEventListener("click", async () => {
      const city = cityInput.value.trim();
      if (!city) {
        weatherBox.innerHTML = `<p class="muted">⚠️ Vui lòng nhập tên thành phố.</p>`;
        return;
      }

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=21.0285&longitude=105.8542&current_weather=true`
        );
        const data = await res.json();
        const temp = data.current_weather.temperature;
        const wind = data.current_weather.windspeed;

        weatherBox.innerHTML = `
          <p>🌡️ Nhiệt độ hiện tại: <strong>${temp}°C</strong></p>
          <p>💨 Tốc độ gió: <strong>${wind} km/h</strong></p>
          <p>📍 Thành phố: <strong>${city}</strong></p>
        `;
      } catch (err) {
        weatherBox.innerHTML = `<p class="muted">❌ Không thể lấy dữ liệu thời tiết.</p>`;
      }
    });
  }
});

// ===================== CURRENCY CONVERTER =====================
document.addEventListener("DOMContentLoaded", () => {
  const convertBtn = document.getElementById("convert-btn");
  const usdInput = document.getElementById("usd-input");
  const resultDiv = document.getElementById("converted-result");
  const rateDiv = document.getElementById("exchange-rate");

  if (convertBtn) {
    convertBtn.addEventListener("click", async () => {
      const usdValue = parseFloat(usdInput.value);

      if (isNaN(usdValue) || usdValue <= 0) {
        resultDiv.textContent = "⚠️ Vui lòng nhập số tiền hợp lệ.";
        rateDiv.textContent = "";
        return;
      }

      try {
        // 🌍 API chuẩn bạn cung cấp
        const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=VND");
        const data = await res.json();
        const rate = data.rates.VND;
        const vndValue = usdValue * rate;

        rateDiv.textContent = `💹 Tỷ giá hiện tại: 1 USD = ${rate.toLocaleString("vi-VN")} VND`;
        resultDiv.innerHTML = `💰 ${usdValue.toLocaleString("en-US")} USD = <strong>${vndValue.toLocaleString("vi-VN")}</strong> VND`;

        // ✨ Hiệu ứng sáng nhẹ mỗi khi hiển thị kết quả
        resultDiv.classList.add("glow-effect");
        setTimeout(() => resultDiv.classList.remove("glow-effect"), 800);

      } catch (error) {
        resultDiv.textContent = "❌ Không thể lấy dữ liệu tỷ giá. Vui lòng thử lại.";
      }
    });
  }
});
