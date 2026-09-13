// ===== VARIABLES GLOBALES =====
const cursor = document.createElement('div');
const cursorFollower = document.createElement('div');
let mouseX = 0, mouseY = 0, posX = 0, posY = 0;
let lastScrollPosition = 0;
const navbar = document.querySelector('.navbar');

// ===== INITIALISATION DU CURSEUR =====
function initCustomCursor() {
    cursor.className = 'cursor';
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        posX += (mouseX - posX) / 5;
        posY += (mouseY - posY) / 5;

        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        cursorFollower.style.left = posX + 'px';
        cursorFollower.style.top = posY + 'px';

        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Effets au survol
    document.addEventListener('mouseover', function(e) {
        const hoveredElement = e.target.closest('.cursor-pointer, a, button, .btn, [role="button"], input, textarea');
        if (hoveredElement) {
            cursor.classList.add('hovered');
            cursorFollower.classList.add('hovered');
        } else {
            cursor.classList.remove('hovered');
            cursorFollower.classList.remove('hovered');
        }
    });

    // Cacher le curseur quand la souris quitte la fenêtre
    document.addEventListener('mouseout', (e) => {
        if (e.relatedTarget === null) {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
        }
    });
    document.addEventListener('mouseover', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
    });
}

// ===== GESTION DE LA NAVBAR =====
function initNavbar() {
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        const currentScrollPosition = window.pageYOffset;
        if (currentScrollPosition <= 50) {
            navbar.classList.add('expanded');
        } else if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 50) {
            navbar.classList.remove('expanded');
        }
        lastScrollPosition = currentScrollPosition;
    });

    if (window.pageYOffset <= 50) navbar.classList.add('expanded');

    navbar.addEventListener('mouseenter', () => {
        if (window.pageYOffset > 50) navbar.classList.add('expanded');
    });
    navbar.addEventListener('mouseleave', () => {
        if (window.pageYOffset > 50) navbar.classList.remove('expanded');
    });
}

// ===== MENU MOBILE (HAMBURGER) =====
function initHamburgerMenu() {
    const body = document.body;
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!hamburgerMenu || !hamburgerIcon || !mobileMenu) return;

    const toggleMenu = () => {
        hamburgerIcon.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    };

    const closeMenu = () => {
        hamburgerIcon.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
    };

    hamburgerMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('click', (e) => {
        const isClickInside = mobileMenu.contains(e.target) || hamburgerMenu.contains(e.target);
        if (!isClickInside && mobileMenu.classList.contains('active')) closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) closeMenu();
    });
}

// ===== ANIMATION MACHINE À ÉCRIRE =====
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const texts = ['Développeur Web', 'Créatif & Minimaliste', 'Passionné d\'architecture web'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        let typingSpeed = isDeleting ? 30 : 80;

        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000; // Pause à la fin du mot
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause avant le prochain mot
        }

        setTimeout(type, typingSpeed);
    }
    setTimeout(type, 1000);
}

// ===== UTILITAIRES (Popup & Email Validation) =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function showPopup(message, isSuccess = true) {
    let popup = document.querySelector('.custom-popup');
    if (popup) popup.remove();

    popup = document.createElement('div');
    popup.className = `custom-popup ${isSuccess ? 'success' : 'error'}`;
    popup.innerHTML = `<i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;

    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add('show'), 10);
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }, 5000);
}

// ===== FORMULAIRE DE CONTACT & EMAILJS =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Ajouter les éléments de design (focus border, erreur) pour chaque champ
    const formGroups = contactForm.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');

        const focusBorder = document.createElement('span');
        focusBorder.className = 'focus-border';

        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';

        group.appendChild(focusBorder);
        group.appendChild(errorMessage);

        input.addEventListener('focus', () => {
            label.classList.add('active');
            errorMessage.textContent = '';
            input.style.borderColor = '';
        });

        input.addEventListener('blur', () => {
            if (!input.value.trim()) label.classList.remove('active');
        });
    });

    // Fonction de validation visuelle d'un champ
    function validateField(input) {
        const errorElement = input.closest('.form-group').querySelector('.error-message');

        if (input.hasAttribute('required') && !input.value.trim()) {
            errorElement.textContent = 'Ce champ est requis';
            input.style.borderColor = '#D71921';
            return false;
        }
        if (input.type === 'email' && input.value && !validateEmail(input.value)) {
            errorElement.textContent = 'Adresse email invalide';
            input.style.borderColor = '#D71921';
            return false;
        }
        errorElement.textContent = '';
        input.style.borderColor = '';
        return true;
    }

    // Soumission du formulaire (Vrai appel EmailJS)
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;
        const fieldsToValidate = contactForm.querySelectorAll('input[required], textarea[required]');

        fieldsToValidate.forEach(field => {
            if (!validateField(field)) isValid = false;
        });

        if (!isValid) {
            showPopup('Veuillez vérifier les champs du formulaire.', false);
            return;
        }

        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;

        // État de chargement
        submitBtn.innerHTML = '<span class="btn-text">Envoi en cours...</span> <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // Vrai envoi EmailJS
        emailjs.send(
            'service_m6ai0xn',  // Ton Service ID actuel
            'template_nk59iso', // ID de ton template
            {
                name: contactForm.querySelector('[name="name"]').value,
                email: contactForm.querySelector('[name="email"]').value,
                title: contactForm.querySelector('[name="subject"]').value,
                message: contactForm.querySelector('[name="message"]').value,
                time: new Date().toLocaleDateString()
            }
        )
            .then(function(response) {
                showPopup('Message envoyé avec succès !', true);
                contactForm.reset();
                // Rabaisser les labels
                contactForm.querySelectorAll('label').forEach(label => label.classList.remove('active'));
            })
            .catch(function(error) {
                console.error('Erreur EmailJS:', error.text || error);
                showPopup('Erreur lors de l\'envoi du message.', false);
            })
            .finally(function() {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

// ===== ANIMATIONS AU DÉFILEMENT (INTERSECTION OBSERVER) =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skill-card, .info-item, .project-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== RETOUR EN HAUT =====
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if(!backToTopButton) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== MISE À JOUR DE L'ANNÉE =====
function updateCurrentYear() {
    const yearEl = document.getElementById('currentYear');
    if(yearEl) yearEl.textContent = new Date().getFullYear();
}

// ===== INITIALISATION GLOBALE AU CHARGEMENT =====
document.addEventListener('DOMContentLoaded', function() {
    initCustomCursor();
    initNavbar();
    initHamburgerMenu();
    initTypingEffect();
    initContactForm();
    initScrollAnimations();
    initBackToTop();
    updateCurrentYear();

    // Défilement fluide pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});