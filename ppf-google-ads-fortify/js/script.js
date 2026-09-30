/* script.js */

let currentIndex = 0;

function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    const items = document.querySelectorAll('.tc-item');
    const viewport = document.querySelector('.carousel-viewport');
    
    if (!track || items.length === 0) return;

    // Use getBoundingClientRect for sub-pixel precision (e.g., 358.66px)
    const cardWidth = items[0].getBoundingClientRect().width;
    
    // Get the exact gap from computed styles
    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.gap) || 20;
    
    // Determine how many cards are visible (usually 3)
    const visibleCards = 3; 
    
    // The max index for 5 items showing 3 at a time is 2 (5 - 3 = 2)
    const maxIndex = items.length - visibleCards;

    // Update index
    currentIndex += direction;

    // Boundary checks
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    // The logic: Move by (Card Width + Gap)
    const totalStep = cardWidth + gap;
    const offset = -(currentIndex * totalStep);

    track.style.transform = `translateX(${offset}px)`;
}
function scrollCarousel(direction) {
    const track = document.getElementById('carousel-track');
    const cardWidth = track.querySelector('.info-card').offsetWidth + 20; // Card width + gap
    track.scrollBy({
        left: direction * cardWidth,
        behavior: 'smooth'
    });
}

function toggleCard(button) {
    // Find the wrapper element relative to the clicked button
    const wrapper = button.previousElementSibling;

    if (wrapper.classList.contains("expanded")) {
        wrapper.classList.remove("expanded");
        button.innerHTML = "Show More";
        
        // Optional: Scroll back to the top of the card if it's very long
        button.closest('.tc-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        wrapper.classList.add("expanded");
        button.innerHTML = "Show Less";
    }
}
document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 1. MAIN PAGE FORM SUBMISSION
    // ==========================================
    const mainForm = document.getElementById('quoteForm');
    if (mainForm) {
        mainForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stops the white screen redirect

            const form = this;
            const messageDiv = document.getElementById('form-message');
            const submitBtn = form.querySelector('.submit-quote-btn');
            
            // Change button text while loading
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            // Send data to submit.php in the background
            fetch('submit.php', {
                method: 'POST',
                body: new FormData(form)
            })
            .then(response => response.json())
            .then(data => {
    if (data.status === 'success') {
        window.location.href = data.redirect || 'thank-you.html';
    } else {
        messageDiv.innerHTML = `<div class="alert alert-danger py-2 mb-3" style="border-radius: 30px; font-size: 14px;">${data.message}</div>`;
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
})
            
            .catch(error => {
                messageDiv.innerHTML = `<div class="alert alert-danger py-2 mb-3" style="border-radius: 30px; font-size: 14px;">An error occurred. Make sure your server is running.</div>`;
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // ==========================================
    // 2. MODAL POPUP FORM SUBMISSION
    // ==========================================
    const modalForm = document.getElementById('modalQuoteForm');
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const form = this;
            const messageDiv = document.getElementById('modal-form-message');
            const submitBtn = form.querySelector('.submit-quote-btn');
            
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            fetch('submit.php', {
                method: 'POST',
                body: new FormData(form)
            })
            .then(response => response.json())
          .then(data => {
    if (data.status === 'success') {
        window.location.href = data.redirect || 'thank-you.html';
    } else {
        messageDiv.innerHTML = `<div class="alert alert-danger py-2 mb-3" style="border-radius: 10px; font-size: 14px;">${data.message}</div>`;
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
})
            .catch(error => {
                messageDiv.innerHTML = `<div class="alert alert-danger py-2 mb-3" style="border-radius: 10px; font-size: 14px;">An error occurred. Please try again.</div>`;
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
   
    // ==========================================
    // 3. BEFORE/AFTER IMAGE SLIDER LOGIC
    // ==========================================
    const sliderContainer = document.querySelector('.ba-slider-container');
    if(sliderContainer) {
        const overlay = document.querySelector('.ba-overlay');
        const handle = document.querySelector('.ba-handle');
        const overlayImg = document.querySelector('.ba-overlay-img');

        let isDragging = false;

        function resizeOverlayImg() {
            overlayImg.style.width = sliderContainer.offsetWidth + 'px';
        }

        window.addEventListener('resize', resizeOverlayImg);
        resizeOverlayImg(); 

        handle.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            moveSlider(e.clientX);
        });

        handle.addEventListener('touchstart', () => isDragging = true, {passive: true});
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            moveSlider(e.touches[0].clientX);
        }, {passive: true});

        function moveSlider(clientX) {
            const rect = sliderContainer.getBoundingClientRect();
            let x = clientX - rect.left; 
            
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            
            let percentage = (x / rect.width) * 100;
            
            overlay.style.width = percentage + '%';
            handle.style.left = percentage + '%';
        }
    }

});




document.querySelectorAll('.submenu-toggler').forEach(toggler => {
    toggler.addEventListener('click', function(e) {
        // Stop the parent <a> tag from opening the URL
        e.preventDefault();
        e.stopPropagation();
        
        // Find the sibling submenu and toggle it
        const submenu = this.closest('.dropdown-submenu').querySelector('.submenu');
        submenu.classList.toggle('show');
    });
});



document.addEventListener("DOMContentLoaded", function () {

    const counters = document.querySelectorAll(".stats-number");
    const statsSection = document.querySelector("#statsSection");

    let started = false;

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !started) {
            started = true;

            counters.forEach(counter => {
                const target = parseFloat(counter.getAttribute("data-target"));
                let count = 0;
                const speed = 200; 
                const increment = target / speed;

                const updateCount = () => {
                    if (count < target) {
                        count += increment;
                        counter.innerText = target % 1 !== 0 
                            ? count.toFixed(1) 
                            : Math.ceil(count);
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target % 1 !== 0 
                            ? target.toFixed(1) 
                            : target + "+";
                    }
                };

                updateCount();
            });
        }
    }, { threshold: 0.4 });

    observer.observe(statsSection);
    
    var swiper = new Swiper(".shortsSwiper", {
    slidesPerView: 1,      // 1 video on small mobile
    spaceBetween: 15,     // Gap between videos
    loop: true,           // Infinite loop
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        // When window width is >= 576px (Small Tablets)
        576: {
            slidesPerView: 2,
        },
        // When window width is >= 992px (Laptops)
        992: {
            slidesPerView: 3,
        },
        // When window width is >= 1200px (Desktop)
        1200: {
            slidesPerView: 4,
        }
    },
});
    
});



