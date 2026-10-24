document.addEventListener("DOMContentLoaded", function() {

    // ==========================================
    // 1. TANGKAP NAMA TAMU DAN UBAH TOMBOL
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const namaTamu = urlParams.get('to');

    if (namaTamu) {
        const elemenNama = document.getElementById('nama-tamu');
        if (elemenNama) {
            elemenNama.innerText = namaTamu;
        }

        const btnMasuk = document.querySelector('.btn-masuk');
        if (btnMasuk) {
            const baseURL = btnMasuk.getAttribute('href').split('?')[0]; 
            btnMasuk.href = `${baseURL}?to=${encodeURIComponent(namaTamu)}`;
        }

        const btnQR = document.querySelector('.btn-tampil-qr');
        if (btnQR) {
            const baseURL = btnQR.getAttribute('href').split('?')[0]; 
            btnQR.href = `${baseURL}?to=${encodeURIComponent(namaTamu)}`;
        }
    }

    // ==========================================
    // 2. GENERATE QR CODE
    // ==========================================
    const wadahQR = document.getElementById('qrcode');
    if (wadahQR) {
        new QRCode(wadahQR, {
            text: namaTamu || 'Tamu VIP',
            width: 200,
            height: 200,
            colorDark : "#721c24", 
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }

    // ==========================================
    // 3. HALAMAN "IT'S A MATCH"
    // ==========================================
    if (document.body.innerHTML.includes("It's a match") || document.body.innerHTML.includes("saling menyukai")) {
        
        let targetHalaman = 'welcome.html';

        if (namaTamu) {
            targetHalaman += `?to=${encodeURIComponent(namaTamu)}`;
        }

        const timerPindahOtomatis = setTimeout(function() {
            window.location.href = targetHalaman;
        }, 20000); 

        document.body.addEventListener('click', function() {
            clearTimeout(timerPindahOtomatis); 
            window.location.href = targetHalaman; 
        });
        
        document.body.style.cursor = "pointer";
    }

    // ==========================================
    // 4. SISTEM BUKU TAMU (GOOGLE SHEETS)
    // ==========================================
    const wishesForm = document.querySelector('.wishes-form');
    const displayBox = document.querySelector('.wishes-display-box');
    
    // URL GOOGLE APPS SCRIPT YANG SUDAH DIMASUKKAN:
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwwoEuhwOIilYAZwgN58Uoxmem7KfyjP8JuT2rtLdsA3BNlj8UzespQft3bEgYKa4WN/exec'; 

    if (wishesForm && displayBox && scriptURL !== 'URL_WEB_APP_KAMU_DISINI') {
        
        // Fungsi untuk mengambil data ucapan saat halaman dimuat
        function loadWishes() {
            fetch(scriptURL)
                .then(response => response.json())
                .then(data => {
                    displayBox.innerHTML = ''; // Bersihkan data dummy
                    data.forEach(item => {
                        const wishItem = document.createElement('div');
                        wishItem.classList.add('wish-item');
                        wishItem.innerHTML = `
                            <div class="wish-name">${item.nama}</div>
                            <div class="wish-text">${item.ucapan}</div>
                        `;
                        displayBox.prepend(wishItem); // Menampilkan ucapan terbaru di atas
                    });
                })
                .catch(error => console.error('Gagal memuat ucapan:', error));
        }

        // Panggil fungsi untuk menampilkan daftar ucapan
        loadWishes();

        // Fungsi saat tombol kirim ditekan
        wishesForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            const submitTombol = wishesForm.querySelector('button');
            const teksTombolAsli = submitTombol.innerText;
            submitTombol.innerText = 'Mengirim...'; // Ubah teks tombol loading

            const nama = document.getElementById('namaLengkap').value;
            const ucapan = document.getElementById('ucapan').value;

            // Membungkus data untuk dikirim ke Google Sheets
            let requestBody = new FormData();
            requestBody.append('nama', nama);
            requestBody.append('ucapan', ucapan);

            // Mengirim data ke Google Sheets
            fetch(scriptURL, { method: 'POST', body: new URLSearchParams(requestBody) })
                .then(response => {
                    // Jika sukses, langsung munculkan di layar tanpa perlu refresh
                    const wishItem = document.createElement('div');
                    wishItem.classList.add('wish-item');
                    wishItem.innerHTML = `
                        <div class="wish-name">${nama}</div>
                        <div class="wish-text">${ucapan}</div>
                    `;
                    displayBox.prepend(wishItem);
                    
                    wishesForm.reset();
                    submitTombol.innerText = teksTombolAsli;
                })
                .catch(error => {
                    console.error('Gagal mengirim:', error.message);
                    submitTombol.innerText = 'Gagal, Coba Lagi';
                });
        });
    }

    // ==========================================
    // 5. HITUNG MUNDUR ACARA
    // ==========================================
    const tanggalTujuan = new Date("January 20, 2027 09:00:00").getTime();

    const hitungMundur = setInterval(function() {
        const sekarang = new Date().getTime();
        const selisih = tanggalTujuan - sekarang;

        const hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
        const jam = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));

        const elemenHari = document.getElementById("hari");
        const elemenJam = document.getElementById("jam");
        const elemenMenit = document.getElementById("menit");

        if (elemenHari && elemenJam && elemenMenit) {
            elemenHari.innerHTML = hari < 10 ? "0" + hari : hari;
            elemenJam.innerHTML = jam < 10 ? "0" + jam : jam;
            elemenMenit.innerHTML = menit < 10 ? "0" + menit : menit;
        }

        if (selisih < 0) {
            clearInterval(hitungMundur);
            if (elemenHari && elemenJam && elemenMenit) {
                elemenHari.innerHTML = "00";
                elemenJam.innerHTML = "00";
                elemenMenit.innerHTML = "00";
            }
        }
    }, 1000);

});