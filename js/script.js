document.addEventListener("DOMContentLoaded", function() {

    // ==========================================
    // 1. LOGIKA UNTUK NAMA TAMU DINAMIS
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const namaTamu = urlParams.get('to');

    if (namaTamu) {
        // Ganti teks nama tamu di halaman depan
        const elemenNama = document.getElementById('nama-tamu');
        if (elemenNama) {
            elemenNama.innerText = namaTamu;
        }

        // Update tombol QR agar membawa nama tamu ke halaman selanjutnya
        const btnQR = document.querySelector('.btn-tampil-qr');
        if (btnQR) {
            const baseURL = btnQR.getAttribute('href').split('?')[0]; 
            btnQR.href = `${baseURL}?to=${encodeURIComponent(namaTamu)}`;
        }
    }

    // ==========================================
    // 2. LOGIKA PEMBUATAN QR CODE OTOMATIS
    // ==========================================
    const wadahQR = document.getElementById('qrcode');
    if (wadahQR) {
        new QRCode(wadahQR, {
            text: namaTamu || 'Tamu VIP', // Jika dibuka tanpa nama, defaultnya 'Tamu VIP'
            width: 200,
            height: 200,
            colorDark : "#721c24", 
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }

    // ==========================================
    // 3. PENGATURAN HALAMAN "IT'S A MATCH"
    // ==========================================
    if (document.body.innerHTML.includes("It's a match") || document.body.innerHTML.includes("saling menyukai")) {
        
        let targetHalaman = 'barcodetm.html';
        // Pastikan nama tamu ikut terbawa saat pindah halaman otomatis
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
    // 4. LOGIKA FORM UCAPAN
    // ==========================================
    const wishesForm = document.querySelector('.wishes-form');
    const displayBox = document.querySelector('.wishes-display-box');

    if (wishesForm && displayBox) {
        wishesForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const nama = document.getElementById('namaLengkap').value;
            const ucapan = document.getElementById('ucapan').value;

            const wishItem = document.createElement('div');
            wishItem.classList.add('wish-item');

            wishItem.innerHTML = `
                <div class="wish-name">${nama}</div>
                <div class="wish-text">${ucapan}</div>
            `;

            displayBox.prepend(wishItem);
            wishesForm.reset();
        });
    }

    // ==========================================
    // 5. LOGIKA COUNTDOWN (HITUNG MUNDUR)
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