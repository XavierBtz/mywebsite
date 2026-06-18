document.addEventListener("DOMContentLoaded", () => {
    const loginCard = document.getElementById("loginCard");

    // Smooth cinematic reveal on entry
    setTimeout(() => {
        loginCard.style.opacity = "1";
        loginCard.style.transform = "translateY(0)";
    }, 300);

    // Dynamic mouse-tracking background shift for subtle 3D parallax feel
    document.addEventListener("mousemove", (e) => {
        const bgImage = document.querySelector(".bg-image");
        const moveX = (e.clientX - window.innerWidth / 2) * 0.015;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.015;

        bgImage.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
    });
});