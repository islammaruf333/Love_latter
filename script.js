// ================================
// ROMANTIC LOVE LETTER - JavaScript
// Premium Interactions & Animations
// ================================

// ===== PARTICLE SYSTEM =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(type) {
        this.type = type; // 'petal', 'star', 'heart'
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.speed = Math.random() * 1 + 0.5;
        this.size = Math.random() * 10 + 5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.drift = Math.random() * 2 - 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
    }

    update() {
        this.y += this.speed;
        this.x += this.drift;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height) {
            this.y = -20;
            this.x = Math.random() * canvas.width;
        }

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);

        if (this.type === 'petal') {
            // Rose petal
            ctx.fillStyle = '#C41E3A';
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'star') {
            // Twinkling star
            ctx.fillStyle = '#D4AF37';
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(
                    Math.cos((i * 4 * Math.PI) / 5) * this.size,
                    Math.sin((i * 4 * Math.PI) / 5) * this.size
                );
            }
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'heart') {
            // Floating heart
            ctx.fillStyle = '#B76E79';
            const size = this.size;
            ctx.beginPath();
            ctx.moveTo(0, size / 4);
            ctx.bezierCurveTo(-size / 2, -size / 4, -size, size / 4, 0, size);
            ctx.bezierCurveTo(size, size / 4, size / 2, -size / 4, 0, size / 4);
            ctx.fill();
        }

        ctx.restore();
    }
}

// Create particles
const particles = [];
for (let i = 0; i < 30; i++) {
    particles.push(new Particle('petal'));
}
for (let i = 0; i < 20; i++) {
    particles.push(new Particle('star'));
}
for (let i = 0; i < 15; i++) {
    particles.push(new Particle('heart'));
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===== CUSTOM CURSOR =====
const cursorTrail = document.querySelector('.cursor-trail');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const speed = 0.15;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    cursorTrail.style.left = cursorX + 'px';
    cursorTrail.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// ===== MUSIC TOGGLE =====
const musicToggle = document.getElementById('musicToggle');
const ambientMusic = document.getElementById('ambientMusic');
const musicOnIcon = document.querySelector('.music-on');
const musicOffIcon = document.querySelector('.music-off');
let isMusicPlaying = false;

// Create a simple ambient tone using Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillator = null;
let gainNode = null;

function startAmbientSound() {
    if (oscillator) return;
    
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    
    // Add subtle frequency variation for ambient feel
    setInterval(() => {
        if (oscillator && isMusicPlaying) {
            const newFreq = 220 + Math.random() * 20 - 10;
            oscillator.frequency.setValueAtTime(newFreq, audioContext.currentTime);
        }
    }, 3000);
}

function stopAmbientSound() {
    if (oscillator) {
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
        
        setTimeout(() => {
            if (oscillator) {
                oscillator.stop();
                oscillator = null;
            }
        }, 1000);
    }
}

musicToggle.addEventListener('click', () => {
    isMusicPlaying = !isMusicPlaying;
    
    if (isMusicPlaying) {
        startAmbientSound();
        musicOnIcon.style.display = 'block';
        musicOffIcon.style.display = 'none';
    } else {
        stopAmbientSound();
        musicOnIcon.style.display = 'none';
        musicOffIcon.style.display = 'block';
    }
});

// ===== ENVELOPE OPENING =====
const envelopeWrapper = document.getElementById('envelopeWrapper');
const openLetterBtn = document.getElementById('openLetterBtn');
const letterContent = document.getElementById('letterContent');

openLetterBtn.addEventListener('click', () => {
    // Open envelope
    envelopeWrapper.classList.add('opening');
    
    setTimeout(() => {
        // Hide envelope and show letter
        envelopeWrapper.classList.add('hide');
        
        setTimeout(() => {
            envelopeWrapper.style.display = 'none';
            letterContent.classList.add('show');
            
            // Start typewriter effect
            startTypewriterEffect();
        }, 800);
    }, 1200);
});

// ===== TYPEWRITER EFFECT =====
function startTypewriterEffect() {
    const paragraphs = document.querySelectorAll('.letter-text p');
    
    // Since CSS animation handles the reveal, we just need to ensure
    // they're visible. The staggered animation is already in CSS.
    paragraphs.forEach((p, index) => {
        setTimeout(() => {
            p.style.opacity = '1';
        }, index * 200);
    });
}

// ===== HIDDEN MESSAGES =====
const hiddenNotes = document.querySelectorAll('.hidden-note');

hiddenNotes.forEach(note => {
    note.addEventListener('click', () => {
        // Create floating heart effect
        const heart = document.createElement('div');
        heart.textContent = '❤';
        heart.style.position = 'fixed';
        heart.style.left = note.getBoundingClientRect().left + 'px';
        heart.style.top = note.getBoundingClientRect().top + 'px';
        heart.style.fontSize = '2rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.color = '#C41E3A';
        heart.style.animation = 'floatUp 2s ease-out forwards';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 2000);
    });
});

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
        }
    }
`;
document.head.appendChild(style);

// ===== PARALLAX SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const letterPaper = document.querySelector('.letter-paper');
    
    if (letterPaper) {
        letterPaper.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ENTRANCE CHOREOGRAPHY =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll and resize events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ACCESSIBILITY =====
// Restore cursor for screen readers and keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.style.cursor = 'auto';
    }
});

document.addEventListener('mousedown', () => {
    document.body.style.cursor = 'none';
});

// ===== HEART CURSOR TRAIL =====
let hearts = [];

document.addEventListener('click', (e) => {
    // Create heart at click position
    const heart = document.createElement('div');
    heart.textContent = '♥';
    heart.style.position = 'fixed';
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    heart.style.fontSize = '1.5rem';
    heart.style.color = '#B76E79';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9998';
    heart.style.animation = 'heartPop 1s ease-out forwards';
    heart.style.textShadow = '0 2px 8px rgba(183, 110, 121, 0.6)';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 1000);
});

// Add heart pop animation
const heartPopStyle = document.createElement('style');
heartPopStyle.textContent = `
    @keyframes heartPop {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        50% {
            transform: scale(1.2) rotate(10deg);
        }
        100% {
            opacity: 0;
            transform: scale(0.5) rotate(20deg) translateY(-50px);
        }
    }
`;
document.head.appendChild(heartPopStyle);

// ===== LOG INITIALIZATION =====
console.log('%c♥ Love Letter Initialized ♥', 'color: #C41E3A; font-size: 20px; font-weight: bold;');
console.log('%cWith all my love...', 'color: #B76E79; font-size: 14px; font-style: italic;');
