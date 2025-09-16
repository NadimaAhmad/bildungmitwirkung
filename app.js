/* === KODE ASLI DARI index.html (Bagian Bawah) === */

// Enable Bootstrap scrollspy
document.addEventListener("DOMContentLoaded", function () {
    var scrollSpyEl = document.querySelector('[data-bs-spy="scroll"]');
    if (scrollSpyEl) {
        var scrollSpy = new bootstrap.ScrollSpy(document.body, {
            target: '.navbar',
            offset: 90 // adjust if needed for your navbar height
        });
    }

    // Add fw-bold to active nav-link
    function updateActiveBold() {
        document.querySelectorAll('.navbar .nav-link').forEach(function (link) {
            if (link.classList.contains('active')) {
                link.classList.add('fw-bold');
            } else {
                link.classList.remove('fw-bold');
            }
        });
    }
    
    // Initial call and on scrollspy event
    if (document.body.dataset.bsSpy === 'scroll') {
        updateActiveBold();
        document.body.addEventListener('activate.bs.scrollspy', updateActiveBold);
    }
});

// NAVBAR background on scroll
(function () {
    const nav = document.querySelector('.navbar');
    if (nav) {
        const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
        document.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
})();

// COUNTERS (IntersectionObserver + counting)
(function () {
    const counters = document.querySelectorAll('.impact-num');
    if (counters.length > 0) {
        const options = { root: null, rootMargin: '0px', threshold: 0.4 };
        const animateCount = (el) => {
            const target = +el.getAttribute('data-target') || +el.textContent || 0;
            const duration = 1800;
            const start = 0;
            const startTime = performance.now();
            const step = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                el.textContent = Math.floor(progress * (target - start) + start).toLocaleString();
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries, obs) => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        animateCount(e.target);
                        obs.unobserve(e.target);
                    }
                });
            }, options);
            counters.forEach(c => io.observe(c));
        } else {
            // fallback
            counters.forEach(c => animateCount(c));
        }
    }
})();

// CONTACT FORM (frontend-only placeholder)
(function () {
    const form = document.getElementById('contactForm');
    const alertBox = document.getElementById('formAlert');
    if (form && alertBox) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            // Simple validation
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();
            if (!name || !email || !message) {
                alertBox.style.display = 'block';
                alertBox.className = 'alert alert-danger';
                alertBox.textContent = 'Please fill all fields before submitting.';
                return;
            }
            // Fake submit (no backend). Show success message.
            alertBox.style.display = 'block';
            alertBox.className = 'alert alert-success';
            alertBox.textContent = 'Thanks! Your message has been received. We will reply to your email soon.';
            form.reset();
            setTimeout(() => { alertBox.style.display = 'none'; }, 5000);
        });
    }
})();

// NEWSLETTER (simple)
(function () {
    const nf = document.getElementById('newsletterForm');
    if (nf) {
        nf.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail').value.trim();
            if (!email) {
                alert('Please provide an email address.');
                return;
            }
            // placeholder success
            alert('Thanks for subscribing — this demo does not connect to an email service.');
            nf.reset();
        });
    }
})();

// Accessibility: enable keyboard focus outlines for keyboard users only
(function () {
    function handleFirstTab(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('user-is-tabbing');
            window.removeEventListener('keydown', handleFirstTab);
        }
    }
    window.addEventListener('keydown', handleFirstTab);
})();


/* === KODE ASLI DARI index.html (Bagian Donasi) === */
document.addEventListener('DOMContentLoaded', function () {

    // --- BAGIAN 1: LOGIKA WIDGET DONASI ---
    const rates = {
        EUR: 1,
        USD: 1.1,
        IDR: 17000
    };
    const donationOptionsEUR = [
        { amount: 25, label: "School supplies for one child for a month" },
        { amount: 50, label: "Textbooks for a small classroom" },
        { amount: 100, label: "One month of teacher training for one educator" },
        { amount: 250, label: "Learning materials for an entire classroom" }
    ];

    function formatCurrency(amount, currency) {
        if (currency === "IDR") {
            return "Rp" + amount.toLocaleString('id-ID');
        }
        if (currency === "USD") {
            return "$" + amount.toLocaleString('en-US');
        }
        return "€" + amount.toLocaleString('de-DE');
    }

    function updateDonationOptions(currency) {
        const options = document.querySelectorAll('.donation-option');
        options.forEach((option, idx) => {
            if (option.querySelector('input')) return;
            if (idx >= donationOptionsEUR.length) return; 
            const data = donationOptionsEUR[idx];
            let converted = data.amount;
            if (currency === "USD") {
                converted = Math.round(data.amount * rates.USD);
            } else if (currency === "IDR") {
                converted = Math.round(data.amount * rates.IDR / 5000) * 5000;
            }
            option.setAttribute('data-amount', converted);
            option.querySelector('.fw-bold').textContent = formatCurrency(converted, currency);
        });
    }

    // IIFE untuk Logika Seleksi Opsi Donasi
    (function () {
        const options = document.querySelectorAll('.donation-option');
        const quickDonationAmount = document.getElementById('quickDonationAmount');
        options.forEach(option => {
            option.addEventListener('click', function () {
                options.forEach(opt => opt.classList.remove('bg-light', 'border-primary'));
                this.classList.add('bg-light', 'border-primary');
                const amount = this.getAttribute('data-amount');
                if (amount && quickDonationAmount) {
                    quickDonationAmount.value = amount;
                }
                const customInput = document.getElementById('customDonation');
                if (customInput && this.getAttribute('data-amount')) {
                    customInput.value = '';
                }
            });
        });

        const customInput = document.getElementById('customDonation');
        if (customInput) {
            function updateCustom() {
                if (customInput.value && quickDonationAmount) {
                    options.forEach(opt => opt.classList.remove('bg-light', 'border-primary'));
                    customInput.closest('.donation-option').classList.add('bg-light', 'border-primary');
                    quickDonationAmount.value = customInput.value;
                }
            }
            customInput.addEventListener('change', updateCustom);
            customInput.addEventListener('keyup', updateCustom);
        }

        const frequencyButtons = document.querySelectorAll('[data-frequency]');
        const quickDonationFrequency = document.getElementById('quickDonationFrequency');
        frequencyButtons.forEach(button => {
            button.addEventListener('click', function () {
                frequencyButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                if (quickDonationFrequency) {
                    quickDonationFrequency.value = this.getAttribute('data-frequency');
                }
            });
        });
    })();

    // IIFE untuk Logika Seleksi Mata Uang
    (function () {
        const currencySelect = document.getElementById('currencySelect');
        const quickDonationAmount = document.getElementById('quickDonationAmount');
        const customInput = document.getElementById('customDonation');
        if (!currencySelect) return;

        currencySelect.addEventListener('change', function () {
            const currency = this.value;
            updateDonationOptions(currency);

            let matched = false;
            document.querySelectorAll('.donation-option').forEach(option => {
                if (option.classList.contains('bg-light') && option.getAttribute('data-amount')) {
                    quickDonationAmount.value = option.getAttribute('data-amount');
                    matched = true;
                }
            });

            if (!matched && customInput && customInput.value) {
                quickDonationAmount.value = customInput.value;
            }
        });

        updateDonationOptions(currencySelect.value); // Panggil saat dimuat
    })();

    // Logika Toast QR Code (jika ada)
    (function () {
        var thumb = document.getElementById('qrThumbnail');
        var toast = document.getElementById('qrToast'); // Asumsi #qrToast ada di HTML Anda
        if (thumb && toast) {
            function showToast() { toast.style.opacity = '1'; }
            function hideToast() { toast.style.opacity = '0'; }
            thumb.addEventListener('mouseenter', showToast);
            thumb.addEventListener('mouseleave', hideToast);
            thumb.addEventListener('focus', showToast);
            thumb.addEventListener('blur', hideToast);
        }
    })();


    // --- BAGIAN 2: LOGIKA MODAL DONASI ---
    const donationModal = document.getElementById('donationDataModal');
    if (donationModal) {
        donationModal.addEventListener('show.bs.modal', function (event) {
            const programEl = document.getElementById('programSelect');
            const amountEl = document.getElementById('quickDonationAmount');
            const currencyEl = document.getElementById('currencySelect');
            const frequencyEl = document.getElementById('quickDonationFrequency');

            const selectedProgram = (programEl && programEl.value) ? programEl.value : '';
            const selectedAmount = amountEl ? amountEl.value : '0';
            const selectedCurrencyText = currencyEl ? currencyEl.options[currencyEl.selectedIndex].text : '';
            const selectedCurrencyValue = currencyEl ? currencyEl.value : 'EUR';
            const selectedFrequency = frequencyEl ? frequencyEl.value : 'one-time';

            if (!selectedProgram && programEl && programEl.tagName === 'SELECT') { 
                alert('Please select a program to support first!');
                event.preventDefault(); 
                return;
            }

            const summaryPreview = donationModal.querySelector('#donationSummaryPreview');
            const modalProgramInput = donationModal.querySelector('#modalProgramValue');
            const modalAmountInput = donationModal.querySelector('#modalAmountValue');
            const modalCurrencyInput = donationModal.querySelector('#modalCurrencyValue');
            const modalFrequencyInput = donationModal.querySelector('#modalFrequencyValue');

            if (summaryPreview) {
                summaryPreview.innerHTML = `
                    <h5 class="fw-bold mb-0">Donation Summary</h5>
                    <p class="mb-0 mt-2">
                        <span class="fs-4 fw-bold text-bmw-coral">${selectedCurrencyText} ${selectedAmount}</span>
                        <span class="text-muted">(${selectedFrequency})</span>
                    </p>
                    <p class="mb-0"><strong>Supporting:</strong> ${selectedProgram}</p>
                `;
            }

            if (modalProgramInput) modalProgramInput.value = selectedProgram;
            if (modalAmountInput) modalAmountInput.value = selectedAmount;
            if (modalCurrencyInput) modalCurrencyInput.value = selectedCurrencyValue;
            if (modalFrequencyInput) modalFrequencyInput.value = selectedFrequency;
        });
    }
}); 
/* === AKHIR DARI DOMContentLoaded UNTUK DONASI === */


/* === TAMBAHAN KODE BARU UNTUK GOOGLE TRANSLATE WIDGET === */

function setCookie(key, value, expiryDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    document.cookie = key + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
}

function getCookie(key) {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function changeLanguage(lang) {
    // Cari elemen <select> yang dibuat oleh Google
    var googleSelect = document.querySelector("#google_translate_element select");
    
    if (!googleSelect) {
        console.warn("Google Translate select not found. Trying again in 500ms...");
        // Coba lagi setelah sedikit penundaan jika elemen belum dimuat
        setTimeout(function() { changeLanguage(lang); }, 500);
        return;
    }

    // Setel nilai select tersembunyi
    googleSelect.value = lang;
    
    // Picu event 'change' untuk memulai translasi
    var event = new Event('change');
    googleSelect.dispatchEvent(event);
    
    // Set cookie untuk mengingat bahasa
    // Cookie 'googtrans' memberi tahu Google bahasa apa yang harus digunakan saat memuat
    setCookie('googtrans', '/en/' + lang, 1); 

    // Perbarui status aktif pada tombol
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Pasang listener klik ke tombol bendera
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            changeLanguage(this.getAttribute('data-lang'));
        });
    });

    // Fungsi untuk memeriksa dan menetapkan bahasa aktif saat dimuat
    function setInitialLanguage() {
        let currentLang = getCookie('googtrans');
        let initialLang = 'en'; // Default ke English
        
        if (currentLang && currentLang !== 'null' && currentLang.includes('/')) {
             // Ekstrak bahasa target dari cookie (misal: /en/de -> de)
            initialLang = currentLang.split('/')[2];
        }

        let activeBtn = document.querySelector('.lang-btn[data-lang="' + initialLang + '"]');
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Pastikan cookie disetel ulang jika tidak ada (untuk konsistensi)
        if (!currentLang || currentLang === 'null' || !currentLang.includes('/')) {
             setCookie('googtrans', '/en/en', 1);
        }
    }

    // Panggil fungsi untuk set bahasa
    setInitialLanguage();

    // Pastikan #google_translate_element ada sebelum mencoba
    if (!document.getElementById('google_translate_element')) {
        console.error('Div #google_translate_element tidak ditemukan di HTML.');
    }
});
/* === AKHIR KODE GOOGLE TRANSLATE === */