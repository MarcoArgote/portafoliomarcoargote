// JavaScript para Portfolio Avanzado con Animaciones Únicas

// Variables globales
let isLoaded = false;
let animationFrameId;
let particles = [];
let mouseX = 0;
let mouseY = 0;

// Configuración de partículas (reducida en móviles)
const isMobileDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const particleConfig = {
    count: isMobileDevice ? 50 : 150, // Menos partículas en móviles
    speed: isMobileDevice ? 0.3 : 0.5, // Más lento en móviles
    size: 2,
    colors: ['#667eea', '#764ba2', '#f093fb'],
    maxDistance: isMobileDevice ? 60 : 100 // Menos conexiones en móviles
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupLoadingScreen();
    setupCustomCursor();
    setupNavigation();
    setupScrollProgress();
    setupParticleSystem();
    setupTypingAnimation();
    setupScrollAnimations();
    setupFormHandling();
    setupIntersectionObserver();
    setupFloatingSocialPanel();
    // Parallax effect for hero photo (mouse move)
    setupHeroParallax();
}

// Sistema de carga avanzado
function setupLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingPercentage = document.getElementById('loadingPercentage');
    let progress = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loadingPercentage.textContent = Math.floor(progress) + '%';
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                isLoaded = true;
                startMainAnimations();
            }, 500);
        }
    }, 100);
}

function startMainAnimations() {
    // Iniciar animaciones principales después de la carga
    animateHeroElements();
    if (typeof initParticles === 'function') {
        initParticles();
    }
}

// Cursor personalizado avanzado
function setupCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorInner = document.querySelector('.cursor-inner');
    
    if (!cursor) return;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Efectos de hover para elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .nav-link');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorInner.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorInner.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        el.addEventListener('mousedown', () => {
            cursor.classList.add('click');
        });
        
        el.addEventListener('mouseup', () => {
            cursor.classList.remove('click');
        });
    });
}

// Navegación avanzada con efectos de scroll
function setupNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Función para centrar navbar
    function centerNavbar() {
        if (navbar) {
            navbar.style.left = '50%';
            navbar.style.transform = 'translateX(-50%)';
        }
    }
    
    // Toggle del menú móvil
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Asegurar que esté centrado al abrir/cerrar menú
            setTimeout(centerNavbar, 10);
        });
    }
    
    // Efecto de scroll en la navegación
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Mantener siempre centrado
        centerNavbar();
        
        lastScrollY = currentScrollY;
    });
    
    // Centrar al cargar y redimensionar
    window.addEventListener('load', centerNavbar);
    window.addEventListener('resize', centerNavbar);
    
    // Centrar inmediatamente
    centerNavbar();
    
    // Navegación suave y actualización de enlaces activos
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Actualizar enlace activo
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Cerrar menú móvil
                if (navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Actualizar enlace activo en scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Barra de progreso de scroll
function setupScrollProgress() {
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    });
}

// Sistema de partículas avanzado
function setupParticleSystem() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Crear partículas
    function createParticles() {
        particles = [];
        for (let i = 0; i < particleConfig.count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * particleConfig.speed,
                vy: (Math.random() - 0.5) * particleConfig.speed,
                size: Math.random() * particleConfig.size + 1,
                color: particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)],
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    // Animar partículas
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            // Actualizar posición
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Rebotar en los bordes
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            // Interacción con el mouse
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < particleConfig.maxDistance) {
                const force = (particleConfig.maxDistance - distance) / particleConfig.maxDistance;
                particle.x -= dx * force * 0.01;
                particle.y -= dy * force * 0.01;
            }
            
            // Dibujar partícula
            ctx.save();
            ctx.globalAlpha = particle.opacity;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            // Conectar partículas cercanas
            particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    ctx.save();
                    ctx.globalAlpha = 0.1;
                    ctx.strokeStyle = particle.color;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                    ctx.restore();
                }
            });
        });
        
        animationFrameId = requestAnimationFrame(animateParticles);
    }
    
    createParticles();
    if (isLoaded) {
        animateParticles();
    }
    
    // Función global para iniciar partículas después de la carga
    window.initParticles = function() {
        animateParticles();
    };
}

// Sistema de animación de tipeo avanzado
function setupTypingAnimation() {
    const nameElement = document.getElementById('typedName');
    const professionElement = document.getElementById('typedProfession');
    
    if (!nameElement || !professionElement) return;
    
    const nameText = 'Marco Argote';
    const professionTexts = [
        'Full Stack Developer',
        'Fundador & CEO de Pensala',
        'Ingeniero en Sistemas'
    ];
    
    let nameIndex = 0;
    let professionIndex = 0;
    let currentProfessionText = 0;
    let isDeleting = false;
    
    function typeEffect() {
        // Animar nombre
        if (nameIndex < nameText.length) {
            nameElement.innerHTML = nameText.slice(0, nameIndex + 1) + '<span class="typing-cursor"></span>';
            nameIndex++;
            setTimeout(typeEffect, 100);
        } else {
            // Quitar cursor del nombre y empezar profesión
            nameElement.innerHTML = nameText;
            setTimeout(typeProfession, 500);
        }
    }
    
    function typeProfession() {
        const currentText = professionTexts[currentProfessionText];
        
        if (isDeleting) {
            professionIndex--;
        } else {
            professionIndex++;
        }
        
        professionElement.innerHTML = currentText.slice(0, professionIndex) + '<span class="typing-cursor"></span>';
        
        let speed = isDeleting ? 50 : 150;
        
        if (!isDeleting && professionIndex === currentText.length) {
            speed = 2000; // Pausa al completar
            isDeleting = true;
        } else if (isDeleting && professionIndex === 0) {
            isDeleting = false;
            currentProfessionText = (currentProfessionText + 1) % professionTexts.length;
            speed = 500;
        }
        
        setTimeout(typeProfession, speed);
    }
    
    // Iniciar animación después de un retraso
    setTimeout(() => {
        if (isLoaded) typeEffect();
    }, 2000);
    
    // Función global para iniciar typing después de la carga
    window.startTyping = function() {
        typeEffect();
    };
}

// Sistema de animaciones de scroll
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
    
    function checkAnimations() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkAnimations);
    checkAnimations(); // Check on load
}

// Manejo avanzado de formularios
function setupFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Mostrar estado de carga
        submitBtn.innerHTML = '<span>Enviando...</span><div class="button-bg"></div>';
        submitBtn.disabled = true;
        
        // Simular envío (aquí conectarías con tu backend)
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Éxito
            submitBtn.innerHTML = '<span>¡Enviado!</span><div class="button-bg"></div>';
            submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
            
        } catch (error) {
            // Error
            submitBtn.innerHTML = '<span>Error</span><div class="button-bg"></div>';
            submitBtn.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }
    });
    
    // Efectos en los inputs
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
        });
    });
}

// Observer para animaciones de intersección
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animaciones específicas para diferentes elementos
                if (entry.target.classList.contains('about-card')) {
                    setTimeout(() => {
                        entry.target.classList.add('floating');
                    }, 300);
                }
                
                if (entry.target.classList.contains('project-card')) {
                    setTimeout(() => {
                        entry.target.classList.add('glow');
                    }, 200);
                }
                
                if (entry.target.classList.contains('skill-tag')) {
                    setTimeout(() => {
                        entry.target.classList.add('pulse');
                    }, Math.random() * 500);
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos
    const elementsToObserve = document.querySelectorAll('.about-card, .project-card, .contact-card, .skill-tag, .section-title');
    elementsToObserve.forEach(el => observer.observe(el));
}

// Animar elementos del hero al cargar
function animateHeroElements() {
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroCta = document.querySelector('.hero-cta');
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    // Resetear animaciones
    [heroTitle, heroDescription, heroCta, scrollIndicator].forEach(el => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
        }
    });
    
    // Animar secuencialmente
    setTimeout(() => {
        if (heroTitle) {
            heroTitle.style.transition = 'all 1s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }
    }, 500);
    
    setTimeout(() => {
        if (heroDescription) {
            heroDescription.style.transition = 'all 1s ease';
            heroDescription.style.opacity = '1';
            heroDescription.style.transform = 'translateY(0)';
        }
    }, 1000);
    
    setTimeout(() => {
        if (heroCta) {
            heroCta.style.transition = 'all 1s ease';
            heroCta.style.opacity = '1';
            heroCta.style.transform = 'translateY(0)';
        }
    }, 1500);
    
    setTimeout(() => {
        if (scrollIndicator) {
            scrollIndicator.style.transition = 'all 1s ease';
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.transform = 'translateY(0)';
        }
    }, 2000);
    
    // Iniciar typing animation
    setTimeout(() => {
        if (typeof window.startTyping === 'function') {
            window.startTyping();
        }
    }, 2500);
}

// Efectos adicionales de interacción
document.addEventListener('DOMContentLoaded', function() {
    // Detectar si es dispositivo táctil
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Efecto de parallax suave (solo en desktop)
    if (!isTouchDevice) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    // Efecto de hover en las cards de proyecto
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) scale(1)';
        });
    });
    
    // Efectos en botones CTA
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Optimización de rendimiento
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    // Actualizar animaciones que dependen del scroll aquí
    ticking = false;
}

// Limpiar animaciones al cambiar de página
window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});

// Función para reiniciar animaciones (útil para desarrollo)
window.restartAnimations = function() {
    location.reload();
};

// Panel flotante de redes sociales
function setupFloatingSocialPanel() {
    const socialToggle = document.getElementById('socialToggle');
    const socialLinksPanel = document.getElementById('socialLinksPanel');
    const socialPanel = document.getElementById('socialPanel');
    
    if (!socialToggle || !socialLinksPanel) return;
    
    let isOpen = false;
    
    // Toggle del panel
    socialToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        
        if (isOpen) {
            socialToggle.classList.add('active');
            socialLinksPanel.classList.add('active');
            
            // Animar entrada de cada enlace
            const socialLinks = socialLinksPanel.querySelectorAll('.social-link-item');
            socialLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.style.animation = 'slideInFromRight 0.4s ease forwards';
                }, index * 100);
            });
        } else {
            socialToggle.classList.remove('active');
            socialLinksPanel.classList.remove('active');
            
            // Reset animaciones
            const socialLinks = socialLinksPanel.querySelectorAll('.social-link-item');
            socialLinks.forEach(link => {
                link.style.animation = 'none';
            });
        }
    });
    
    // Cerrar panel al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!socialPanel.contains(e.target) && isOpen) {
            isOpen = false;
            socialToggle.classList.remove('active');
            socialLinksPanel.classList.remove('active');
        }
    });
    
    // Efectos de hover mejorados
    const socialLinks = document.querySelectorAll('.social-link-item');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateX(-8px) scale(1.08)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateX(0) scale(1)';
        });
    });
    
    // Auto-hide en scroll (opcional)
    let hideTimeout;
    window.addEventListener('scroll', () => {
        socialPanel.style.opacity = '0.7';
        
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            socialPanel.style.opacity = '1';
        }, 1000);
    });
    
    // Animación inicial del toggle
    setTimeout(() => {
        socialToggle.style.animation = 'pulse 2s infinite';
    }, 3000);
}

console.log('Portfolio Avanzado: Todos los sistemas de animación inicializados correctamente ✨');

// Parallax sutil para la foto del hero: mueve y rota ligeramente según la posición del ratón.
function setupHeroParallax() {
    const photo = document.querySelector('.hero-photo');
    if (!photo) return;

    // No activar en dispositivos táctiles
    if ('ontouchstart' in window) return;

    // Instead of following the cursor, just add a persistent aura class.
    // This avoids the image moving with the cursor while enabling CSS-based glow.
    photo.classList.add('photo-aura-active');
}