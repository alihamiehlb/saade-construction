document.addEventListener("DOMContentLoaded", () => {

    // ─── Hamburger Toggle ───────────────────────────────
    const hamburger = document.getElementById("hamburger");
    const navLinks  = document.getElementById("nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("open");
        });
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navLinks.classList.remove("open");
            });
        });
    }

    // ─── Elements ───────────────────────────────────────
    const slides       = document.querySelectorAll(".slide");
    const slideTexts   = document.querySelectorAll(".slide-text");
    const totalSlides  = slides.length;
    const progressFill = document.querySelector(".progress-fill");
    const currentNum   = document.querySelector(".current");

    let currentSlide   = 0;
    const SLIDE_DURATION = 7; // seconds
    let progressTween;

    // ─── Initial Load Animation ─────────────────────────
    const init = gsap.timeline();

    // Show first slide
    init.to(".slide-1", { opacity: 1, duration: 1.5, ease: "power2.inOut" }, 0);
    init.to(".slide-1 .slide-img", { scale: 1, duration: 5, ease: "power1.out" }, 0);

    // Stagger title reveal
    gsap.set(".title span", { yPercent: 110 });
    init.to(".title span", {
        yPercent: 0,
        stagger: 0.18,
        duration: 1.3,
        ease: "power4.out"
    }, 0.4);

    // Show first slide text
    gsap.set(slideTexts, { opacity: 0, y: 25 });
    init.to(".slide-text-1", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
    }, 1.1);

    // ─── Progress Bar ───────────────────────────────────
    function animateProgress() {
        if (progressTween) progressTween.kill();
        gsap.set(progressFill, { width: "0%" });
        progressTween = gsap.to(progressFill, {
            width: "100%",
            duration: SLIDE_DURATION,
            ease: "none",
            onComplete: nextSlide
        });
    }

    // ─── Slide Transition ───────────────────────────────
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;

        const curElem = slides[currentSlide];
        const nxtElem = slides[next];
        const nxtImg  = nxtElem.querySelector(".slide-img");
        const curText = slideTexts[currentSlide];
        const nxtText = slideTexts[next];

        const tl = gsap.timeline();

        // Layer ordering
        gsap.set(nxtElem, { zIndex: 1, opacity: 1 });
        gsap.set(nxtImg,  { scale: 1.15, transformOrigin: "center center" });
        gsap.set(curElem, { zIndex: 2 });

        // Image crossfade
        tl.to(curElem, { opacity: 0, duration: 1.5, ease: "power2.inOut" }, 0);
        tl.to(nxtImg,  { scale: 1, duration: 5, ease: "power2.out" }, 0);

        // Text crossfade — out
        if (curText) {
            tl.to(curText, { opacity: 0, y: -12, duration: 0.8, ease: "power2.inOut" }, 0);
        }

        // Text crossfade — in
        if (nxtText) {
            gsap.set(nxtText, { opacity: 0, y: 25 });
            tl.to(nxtText, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, 0.5);
        }

        currentSlide = next;
        currentNum.textContent = String(currentSlide + 1).padStart(2, "0");
        animateProgress();
    }

    // ─── Smooth Scroll for Nav & Anchor Links ───────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            const targetElem = document.querySelector(targetId);
            if (targetElem) {
                e.preventDefault();
                targetElem.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // ─── Work Filter Tabs ───────────────────────────────
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filterValue === "all" || filterValue === category) {
                    card.classList.remove("hide");
                    gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
                } else {
                    card.classList.add("hide");
                }
            });
        });
    });

    // ─── WhatsApp Contact Form Handling ───────────────
    const contactForm = document.getElementById("contactForm");
    const formStatus  = document.getElementById("formStatus");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name    = document.getElementById("fullName").value.trim();
            const phone   = document.getElementById("phoneNum").value.trim();
            const service = document.getElementById("serviceType").value;
            const message = document.getElementById("message").value.trim();

            if (!name || !phone || !message) {
                if (formStatus) {
                    formStatus.textContent = "Please fill in all required fields.";
                    formStatus.className = "form-status error";
                }
                return;
            }

            // Construct structured WhatsApp message
            const waText = `Hello Saade Construction!\n\n` +
                           `*New Project Inquiry*\n` +
                           `• *Name:* ${name}\n` +
                           `• *Phone:* ${phone}\n` +
                           `• *Service:* ${service}\n` +
                           `• *Details:* ${message}`;

            const encodedMsg = encodeURIComponent(waText);
            const waUrl = `https://wa.me/96171705292?text=${encodedMsg}`;

            if (formStatus) {
                formStatus.textContent = "Launching WhatsApp to send your inquiry...";
                formStatus.className = "form-status success";
            }

            // Redirect to WhatsApp chat after short delay
            setTimeout(() => {
                window.open(waUrl, "_blank");
                contactForm.reset();
            }, 800);
        });
    }

    // ─── Start loop after intro finishes ────────────────
    setTimeout(animateProgress, 2200);
});

