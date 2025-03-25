document.addEventListener("DOMContentLoaded", () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll("nav ul li a").forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            document.getElementById(targetId).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // Show more content in the Art section with animation
    window.showMoreArt = function () {
        const moreArt = document.getElementById("more-art");
        moreArt.classList.toggle("expanded");
    };

    // Hero button interaction
    window.exploreMore = function () {
        document.getElementById("art").scrollIntoView({
            behavior: "smooth"
        });
    };

    // Fade-in effect on scroll
    const fadeInElements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    fadeInElements.forEach(element => {
        observer.observe(element);
    });

    // Dynamic theme switcher
    const themeToggle = document.createElement("button");
    themeToggle.innerText = "Toggle Theme";
    themeToggle.classList.add("theme-toggle");
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    // Interactive form validation
    const contactForm = document.querySelector("form");
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = contactForm.querySelector("input[name='name']").value;
        const email = contactForm.querySelector("input[name='email']").value;
        const message = contactForm.querySelector("textarea[name='message']").value;

        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        alert("Thank you for your message! We will get back to you soon.");
        contactForm.reset();
    });

    // Background animation effect
    const particles = document.createElement("div");
    particles.classList.add("particles");
    document.body.appendChild(particles);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement("span");
        particle.classList.add("particle");
        particle.style.top = Math.random() * 100 + "vh";
        particle.style.left = Math.random() * 100 + "vw";
        particles.appendChild(particle);
    }
});