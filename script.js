// ================================================
// ROMANTIC NOIR - CINEMATIC INTERACTIONS
// ================================================

// ===== CONFIGURATION =====
const CONFIG = {
    particles: {
        count: 100,
        colors: ['#8B1538', '#E8B4A8', '#D4AF37'],
        maxSize: 3,
        speed: 0.3
    }
};

// ===== PARTICLE SYSTEM =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * CONFIG.particles.speed;
        this.vy = (Math.random() - 0.5) * CONFIG.particles.speed;
        this.size = Math.random() * CONFIG.particles.maxSize + 1;
        this.color = CONFIG.particles.colors[Math.floor(Math.random() * CONFIG.particles.colors.length)];
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.particles.count; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all animatable elements
document.addEventListener('DOMContentLoaded', () => {
    const letterCard = document.querySelector('.letter-card');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (letterCard) observer.observe(letterCard);
    timelineItems.forEach(item => observer.observe(item));
});

// ===== MUSIC TOGGLE =====
const musicBtn = document.getElementById('musicToggle');
let audioContext = null;
let oscillator = null;
let gainNode = null;
let isPlaying = false;

musicBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;

    if (isPlaying) {
        playAmbientMusic();
        musicBtn.style.background = 'rgba(232, 180, 168, 0.3)';
        musicBtn.style.borderColor = 'var(--rose-gold)';
    } else {
        stopAmbientMusic();
        musicBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        musicBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    }
});

function playAmbientMusic() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
}

function stopAmbientMusic() {
    if (oscillator) {
        oscillator.stop();
        oscillator = null;
    }
}

// ===== INTERACTIVE HEART =====
const finalHeart = document.getElementById('finalHeart');
let heartClicks = 0;

finalHeart.addEventListener('click', () => {
    heartClicks++;

    // Create floating hearts
    createFloatingHeart(event.clientX, event.clientY);

    // Change label after clicks
    const label = finalHeart.querySelector('.heart-label');
    if (heartClicks === 1) {
        label.textContent = 'Again! 💕';
    } else if (heartClicks === 3) {
        label.textContent = 'You make my heart flutter! 💗';
    } else if (heartClicks === 5) {
        label.textContent = 'I love you too! ❤️';
        createHeartExplosion(finalHeart);
    }
});

function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = '2rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.animation = 'floatUp 2s ease-out forwards';

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 2000);
}

function createHeartExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const distance = 100;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        setTimeout(() => {
            createFloatingHeart(centerX, centerY);
        }, i * 100);
    }
}

// Add CSS for floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: translateY(-150px) scale(1.5) rotate(20deg);
        }
    }
`;
document.head.appendChild(style);

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');

    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / 500);
    }
});

// ===== INITIALIZATION =====
window.addEventListener('load', () => {
    resizeCanvas();
    initParticles();
    animateParticles();
});

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// ===== SMOOTH SCROLL FOR INDICATOR =====
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
}

console.log('💖 Love Letter Initialized - Click the heart at the bottom!');
