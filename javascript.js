// Konfigurasi API OpenWeatherMap
// Jika ingin menggunakan data asli, silakan ganti teks di bawah dengan API key dari openweathermap.org
const API_KEY = "181ae2479db9b485fd6970f7d070e909"; 

// Mengambil Elemen DOM
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const messageBox = document.getElementById('message-box');

const locationName = document.getElementById('location-name');
const temperature = document.getElementById('temperature');
const weatherDesc = document.getElementById('weather-desc');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const recommendationText = document.getElementById('recommendation-text');

// Fungsi Logika Penentu Rekomendasi Aktivitas
function dapatkanRekomendasi(temp, kondisi) {
    const kon = kondisi.toLowerCase();
    
    // Mengecek apakah kondisi cuaca mengandung unsur hujan (Mendukung bahasa Inggris dari API & Indonesia dari simulasi)
    if (kon.includes('rain') || kon.includes('drizzle') || kon.includes('thunderstorm') || kon.includes('hujan')) {
        return "Pakai payung atau jas hujan! Lebih baik lakukan aktivitas dalam ruangan dan nikmati minuman hangat.";
    } else if (temp >= 30) {
        return "Cuaca cukup terik. Gunakan pakaian berbahan tipis, pakai sunscreen, dan pastikan minum air yang cukup.";
    } else if (temp <= 22) {
        return "Udara lumayan dingin. Gunakan jaket atau pakaian lengan panjang jika ingin beraktivitas keluar.";
    } else {
        return "Cuaca sangat mendukung untuk aktivitas luar ruangan seperti berolahraga atau berjalan-jalan santai.";
    }
}

// Fungsi Utama Mengambil Data Cuaca (Asynchronous)
async function ambilDataCuaca(kota) {
    // Tampilkan status loading awal dan sembunyikan container info cuaca lama
    messageBox.innerHTML = '<span class="loading-text">Sedang mencari data...</span>';
    weatherInfo.classList.add('hidden');

    // JIKA API KEY KOSONG, barulah jalankan simulasi lokal
    if (API_KEY === "") {
        setTimeout(() => {
            messageBox.innerHTML = ""; 
            
            const mockTemp = Math.floor(Math.random() * (34 - 18 + 1)) + 18;
            const kondisiList = ['Cerah Berawan', 'Hujan Ringan', 'Cerah Terik', 'Berawan Tebal'];
            const mockKondisi = kondisiList[kota.length % kondisiList.length];
            const mockHumid = 60 + (kota.length % 30);
            const mockWind = 5 + (kota.length % 15);

            locationName.innerText = `${kota.toUpperCase()}, ID (Simulasi)`;
            temperature.innerText = `${mockTemp}°C`;
            weatherDesc.innerText = mockKondisi;
            humidity.innerText = `${mockHumid}%`;
            windSpeed.innerText = `${mockWind} km/h`;
            recommendationText.innerText = dapatkanRekomendasi(mockTemp, mockKondisi);
            
            weatherInfo.classList.remove('hidden');
        }, 800);
        return;
    }

    // PENGAMBILAN DATA ASLI (Karena API_KEY sudah terisi kode asli Anda)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${kota}&appid=${API_KEY}&units=metric&lang=id`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Kota tidak ditemukan. Periksa kembali ejaan nama kota Anda.');
        }

        const data = await response.json();
        messageBox.innerHTML = ""; 

        // Pengisian Data API ke Elemen HTML
        locationName.innerText = `${data.name}, ${data.sys.country}`;
        temperature.innerText = `${Math.round(data.main.temp)}°C`;
        weatherDesc.innerText = data.weather[0].description;
        humidity.innerText = `${data.main.humidity}%`;
        windSpeed.innerText = `${data.wind.speed} km/h`;
        
        // Pengecekan rekomendasi menggunakan data utama cuaca
        recommendationText.innerText = dapatkanRekomendasi(data.main.temp, data.weather[0].main);

        // Tampilkan container info cuaca ke layar
        weatherInfo.classList.remove('hidden');

    } catch (error) {
        messageBox.innerHTML = `<span class="error-text">${error.message}</span>`;
        weatherInfo.classList.add('hidden');
    }
}

// Event Listener saat tombol 'Cari' di-klik
searchBtn.addEventListener('click', () => {
    const kota = cityInput.value.trim();
    if (kota) {
        ambilDataCuaca(kota);
    }
});

// Event Listener saat menekan tombol 'Enter' di keyboard pada input teks
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const kota = cityInput.value.trim();
        if (kota) {
            ambilDataCuaca(kota);
        }
    }
});
