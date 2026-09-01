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

    // ─── Start loop after intro finishes ────────────────
    setTimeout(animateProgress, 2200);
});
