document.addEventListener("DOMContentLoaded", function() {

    if (document.body.innerHTML.includes("It's a match") || document.body.innerHTML.includes("saling menyukai")) {
        

        const targetHalaman = 'barcodetm.html'; 
        

        const timerPindahOtomatis = setTimeout(function() {
            window.location.href = targetHalaman;
        }, 20000); 


        document.body.addEventListener('click', function() {
            clearTimeout(timerPindahOtomatis); 
            window.location.href = targetHalaman; 
        });
        
        document.body.style.cursor = "pointer";
    }


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