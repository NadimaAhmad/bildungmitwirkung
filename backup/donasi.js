
        document.addEventListener('DOMContentLoaded', function () {
            // NAVBAR background on scroll
            (function () {
                const nav = document.querySelector('.navbar');
                if (!nav) return;
                const onScroll = () => {
                    if (window.scrollY > 50) {
                        nav.classList.add('bg-white', 'shadow-sm');
                        nav.classList.remove('bg-transparent');
                    } else {
                        nav.classList.add('bg-transparent');
                        nav.classList.remove('bg-white', 'shadow-sm');
                    }
                };
                document.addEventListener('scroll', onScroll, { passive: true });
                onScroll();
            })();

            // Currency conversion rates (approximate, update as needed)
            const rates = {
                EUR: 1,
                USD: 1.1,
                IDR: 17000
            };
            // Donation options in EUR
            const donationOptionsEUR = [
                { amount: 25, label: "School supplies for one child for a month" },
                { amount: 50, label: "Textbooks for a small classroom" },
                { amount: 100, label: "One month of teacher training for one educator" },
                { amount: 250, label: "Learning materials for an entire classroom" }
            ];

            // Format currency
            function formatCurrency(amount, currency) {
                if (currency === "IDR") {
                    // Show in thousands (50,000 etc)
                    return "Rp" + amount.toLocaleString('id-ID');
                }
                if (currency === "USD") {
                    return "$" + amount.toLocaleString('en-US');
                }
                // Default EUR
                return "€" + amount.toLocaleString('de-DE');
            }

            // Update donation options when currency changes
            function updateDonationOptions(currency) {
                const options = document.querySelectorAll('.donation-option');
                options.forEach((option, idx) => {
                    if (option.querySelector('input')) return; // skip custom
                    const data = donationOptionsEUR[idx];
                    let converted = data.amount;
                    if (currency === "USD") {
                        converted = Math.round(data.amount * rates.USD);
                    } else if (currency === "IDR") {
                        // Round to nearest 5,000 for neatness
                        converted = Math.round(data.amount * rates.IDR / 5000) * 5000;
                    }
                    option.setAttribute('data-amount', converted);
                    option.querySelector('.fw-bold').textContent = formatCurrency(converted, currency);
                });
            }

            // Donation option selection
            (function() {
                const options = document.querySelectorAll('.donation-option');
                const quickDonationAmount = document.getElementById('quickDonationAmount');
                options.forEach(option => {
                    option.addEventListener('click', function() {
                        options.forEach(opt => opt.classList.remove('bg-light', 'border-primary'));
                        this.classList.add('bg-light', 'border-primary');
                        const amount = this.getAttribute('data-amount');
                        if (amount && quickDonationAmount) {
                            quickDonationAmount.value = amount;
                        }
                    });
                });

                // Custom donation input
                const customInput = document.getElementById('customDonation');
                if (customInput) {
                    customInput.addEventListener('change', function() {
                        if (this.value) {
                            options.forEach(opt => opt.classList.remove('bg-light', 'border-primary'));
                            document.querySelector('.donation-option:last-child').classList.add('bg-light', 'border-primary');
                            if (quickDonationAmount) {
                                quickDonationAmount.value = this.value;
                            }
                        }
                    });
                }

                // Frequency buttons
                const frequencyButtons = document.querySelectorAll('[data-frequency]');
                const quickDonationFrequency = document.getElementById('quickDonationFrequency');
                frequencyButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        frequencyButtons.forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                        if (quickDonationFrequency) {
                            quickDonationFrequency.value = this.getAttribute('data-frequency');
                        }
                    });
                });
            })();

            // Currency select logic
            (function() {
                const currencySelect = document.getElementById('currencySelect');
                const quickDonationAmount = document.getElementById('quickDonationAmount');
                const customInput = document.getElementById('customDonation');
                if (!currencySelect) return;

                currencySelect.addEventListener('change', function() {
                    const currency = this.value;
                    updateDonationOptions(currency);

                    // Update quick donation amount currency symbol
                    let val = parseInt(quickDonationAmount.value, 10) || 0;
                    // Try to match to one of the options
                    let matched = false;
                    document.querySelectorAll('.donation-option').forEach(option => {
                        if (option.classList.contains('bg-light') && option.getAttribute('data-amount')) {
                            quickDonationAmount.value = option.getAttribute('data-amount');
                            matched = true;
                        }
                    });
                    if (!matched) {
                        // If custom selected, try to convert the value
                        if (customInput && customInput.value) {
                            let base = parseInt(customInput.value, 10) || 0;
                            let converted = base;
                            if (currency === "USD") {
                                converted = Math.round(base * rates.USD);
                            } else if (currency === "IDR") {
                                converted = Math.round(base * rates.IDR / 5000) * 5000;
                            }
                            quickDonationAmount.value = converted;
                        }
                    }
                });

                // Initial update
                updateDonationOptions(currencySelect.value);
            })();

            // COUNTERS (IntersectionObserver + counting)
            (function () {
                const counters = document.querySelectorAll('.display-4[data-target]');
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
                    counters.forEach(c => animateCount(c));
                }
            })();

            // Newsletter subscription
            (function () {
                const nf = document.getElementById('newsletterForm');
                if (nf) {
                    nf.addEventListener('submit', function(e) {
                        e.preventDefault();
                        const email = document.getElementById('newsletterEmail').value.trim();
                        if (!email) {
                            alert('Please provide an email address.');
                            return;
                        }
                        alert('Thank you for subscribing to our newsletter!');
                        nf.reset();
                    });
                }
            })();
        });
