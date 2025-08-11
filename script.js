// Variables globales
let contactForm;
const cursor = document.createElement('div');
const cursorFollower = document.createElement('div');
let mouseX = 0;
let mouseY = 0;
let posX = 0;
let posY = 0;

// Fonction pour valider l'email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Fonction pour afficher une popup
function showPopup(message, isSuccess) {
    // Supprimer les anciennes popups
    const oldPopup = document.querySelector('.custom-popup');
    if (oldPopup) {
        oldPopup.remove();
    }
    
    // Créer la popup
    const popup = document.createElement('div');
    popup.className = `custom-popup ${isSuccess ? 'success' : 'error'}`;
    popup.innerHTML = `
        <div class="popup-content">
            <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    
    // Ajouter la popup au document
    document.body.appendChild(popup);
    
    // Supprimer la popup après 5 secondes
    setTimeout(() => {
        popup.classList.add('fade-out');
        setTimeout(() => {
            popup.remove();
        }, 300);
    }, 5000);
}

// Fonction d'initialisation du formulaire de contact
function initContactForm() {
    contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.error('Le formulaire de contact n\'a pas été trouvé dans le DOM');
        return;
    }
    
    // Gestion de la soumission du formulaire
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Réinitialiser les erreurs
        const allInputs = contactForm.querySelectorAll('input, textarea');
        allInputs.forEach(input => {
            input.style.borderColor = '';
        });
        
        // Valider les champs
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        const emailField = contactForm.querySelector('input[type="email"]');
        
        // Validation des champs requis
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#ff4444';
            } else {
                field.style.borderColor = '';
            }
        });
        
        // Validation spécifique de l'email
        if (emailField && emailField.value.trim() && !validateEmail(emailField.value.trim())) {
            isValid = false;
            emailField.style.borderColor = '#ff4444';
            showPopup('Veuillez entrer une adresse email valide', false);
            return false;
        }
        
        if (!isValid) {
            showPopup('Veuillez remplir tous les champs obligatoires', false);
            return false;
        }
        
        // Si tout est valide, simuler l'envoi
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simulation d'envoi
        setTimeout(() => {
            showPopup('Message envoyé avec succès !', true);
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
        
        return false;
    });
}

// Initialisation au chargement du document
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le formulaire de contact
    initContactForm();
    
    // Initialiser le curseur personnalisé
    initCustomCursor();
});

// Création des éléments du curseur
function initCustomCursor() {
    cursor.className = 'cursor';
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);
    
    // Mise à jour de la position du curseur
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animation fluide du curseur
    function animateCursor() {
        // Délai pour l'effet de traînée
        const delay = 0.1;
        posX += (mouseX - posX) * delay;
        posY += (mouseY - posY) * delay;
        
        cursor.style.left = `${posX}px`;
        cursor.style.top = `${posY}px`;
        
        // Délai plus long pour l'effet de traînée du follower
        const followerX = mouseX;
        const followerY = mouseY;
        
        cursorFollower.style.left = `${followerX}px`;
        cursorFollower.style.top = `${followerY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    // Gestion des effets de survol
    const hoverElements = ['a', 'button', '.btn', 'input', 'textarea', 'select', 'label[for]'];
    hoverElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                cursorFollower.classList.add('hovered');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                cursorFollower.classList.remove('hovered');
            });
        });
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
    
    // Démarrer l'animation
    animateCursor();
}

// Fonction pour initialiser le menu hamburger
function initHamburgerMenu() {
    // Éléments du DOM
    const body = document.body;
    const menuToggle = document.querySelector('.menu-toggle');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    
    // Vérifier que tous les éléments nécessaires existent
    if (!menuToggle || !hamburger || !navLinks) return;
    
    // Fonction pour basculer le menu
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.classList.toggle('menu-open');
    };
    
    // Fonction pour fermer le menu
    const closeMenu = () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
    };
    
    // Gestion du clic sur le bouton hamburger
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Fermer le menu quand on clique sur un lien
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });
    
    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (e) => {
        const isClickInside = navLinks.contains(e.target) || menuToggle.contains(e.target);
        if (!isClickInside && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Fermer le menu quand on redimensionne la fenêtre au-dessus de 768px
    const handleResize = () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Nettoyage des écouteurs d'événements si nécessaire
    return () => {
        window.removeEventListener('resize', handleResize);
        menuToggle.removeEventListener('click', toggleMenu);
        navLinksItems.forEach(link => {
            link.removeEventListener('click', closeMenu);
        });
    };
}

// Initialisation au chargement du document
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le curseur personnalisé
    initCustomCursor();
    
    // Initialiser le menu hamburger
    initHamburgerMenu();
    
    // Initialiser les autres fonctionnalités
    initTypingEffect();
    initScrollAnimations();
    initContactForm();
    
    // Éléments du DOM
    const body = document.body;
    const themeSwitch = document.getElementById('theme-switch');
    
    // Effet de survol sur les éléments cliquables
    const hoverElements = ['a', 'button', '.btn', 'input', 'textarea', 'select', 'label[for]'];
    hoverElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                cursorFollower.classList.add('hovered');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                cursorFollower.classList.remove('hovered');
            });
        });
    });
    
    // Gestion du menu mobile
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('no-scroll');
            
            // Animation du bouton hamburger
            const spans = menuToggle.querySelectorAll('span');
            if (menuToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'rotate(0) translate(0, 0)';
                spans[1].style.transform = 'rotate(0) translate(0, 0)';
            }
        });
        
        // Fermer le menu au clic sur un lien
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    body.classList.remove('no-scroll');
                    
                    // Réinitialiser l'animation du bouton hamburger
                    const spans = menuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'rotate(0) translate(0, 0)';
                    spans[1].style.transform = 'rotate(0) translate(0, 0)';
                }
            });
        });
    }
    

    
    // Gestion du changement de thème
    if (themeSwitch) {
        // Vérifier le thème stocké ou la préférence système
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Appliquer le thème sauvegardé
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            themeSwitch.checked = true;
        }
        
        // Gérer le changement de thème
        themeSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Animation de la saisie du texte
    function initTypingEffect() {
        const typingText = document.querySelector('.typing-text');
        if (!typingText) return;
        
        const words = ['Développeur Web', 'Designer UI/UX', 'Freelance', 'Passionné'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isWaiting = false;
        let typingSpeed = 100; // Vitesse de frappe de base (ms)
        const deleteSpeed = 30; // Vitesse d'effacement (plus rapide)
        const waitTime = 2000; // Temps d'attente entre les mots (ms)
        
        // Styles initiaux
        typingText.style.display = 'inline-block';
        typingText.style.minWidth = '300px'; // Largeur minimale pour éviter les sauts
        typingText.textContent = '';
        typingText.classList.add('typing'); // Ajout d'une classe pour le style du curseur
        
        function type() {
            if (isWaiting) return;
            
            const currentWord = words[wordIndex];
            
            // Mise à jour du texte affiché avec le curseur
            typingText.textContent = currentWord.substring(0, charIndex);
            typingText.classList.add('typing'); // S'assurer que la classe est présente
            
            if (!isDeleting) {
                // Mode écriture
                charIndex++;
                
                if (charIndex > currentWord.length) {
                    // Fin du mot, pause avant effacement
                    isWaiting = true;
                    setTimeout(() => {
                        isWaiting = false;
                        isDeleting = true;
                        type();
                    }, waitTime);
                    return;
                }
            } else {
                // Mode effacement
                charIndex--;
                
                if (charIndex === 0) {
                    // Fin de l'effacement, passer au mot suivant
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    // Pause avant de commencer le mot suivant
                    isWaiting = true;
                    setTimeout(() => {
                        isWaiting = false;
                        type();
                    }, 500);
                    return;
                }
            }
            
            // Déterminer la vitesse pour le prochain caractère
            const speed = isDeleting ? deleteSpeed : typingSpeed + (Math.random() * 50 - 25); // Légère variation aléatoire
            
            // Planifier le prochain caractère
            setTimeout(type, speed);
        }
        
        // Démarrer l'animation après un court délai
        setTimeout(type, 1000);
        
        // Démarrer l'animation après le délai initial
        setTimeout(type, delay);
        
        // Ajout de l'animation de clignotement du curseur
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Animation au défilement
    function initScrollAnimations() {
        const animateOnScroll = (elements, className) => {
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    element.classList.add(className);
                }
            });
        };
        
        // Observer les éléments à animer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });
        
        // Ajouter les éléments à observer
        document.querySelectorAll('.skill-card, .info-item, .section-title, .section-subtitle').forEach(el => {
            observer.observe(el);
        });
        
        // Animation au chargement initial
        window.addEventListener('load', () => {
            animateOnScroll(document.querySelectorAll('.skill-card'), 'animate');
            animateOnScroll(document.querySelectorAll('.info-item'), 'animate');
        });
        
        // Animation au défilement
        window.addEventListener('scroll', () => {
            animateOnScroll(document.querySelectorAll('.skill-card'), 'animate');
            animateOnScroll(document.querySelectorAll('.info-item'), 'animate');
        });
    }
    
    // Initialisation des fonctionnalités
    initTypingEffect();
    initScrollAnimations();
    initContactForm();
    initMap();
    
    // Gestion du défilement fluide
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
    
    // Animation de la barre de navigation au défilement
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Animation de frappe du texte
    function typeWriter() {
        const textElement = document.querySelector('.typing-text');
        if (!textElement) return;
        
        const texts = [
            'Développeur Web',
            'Designer UI/UX',
            'Passionné par le code',
            'Créatif'
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        let pauseEnd = 0;
        
        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                // Effacer le texte
                textElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                // Écrire le texte
                textElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                // Pause à la fin du mot
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Passer au mot suivant
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500;
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Démarrer l'animation après un court délai
        setTimeout(type, 1000);
    }

    // Fonction pour valider l'email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Fonction pour afficher une popup
    function showPopup(message, isSuccess = true) {
        // Créer l'élément popup s'il n'existe pas
        let popup = document.querySelector('.custom-popup');
        
        if (!popup) {
            popup = document.createElement('div');
            popup.className = 'custom-popup';
            document.body.appendChild(popup);
            
            // Ajouter les styles CSS
            const style = document.createElement('style');
            style.textContent = `
                .custom-popup {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 20px 30px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 9999;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 300px;
                    max-width: 90%;
                    text-align: center;
                    opacity: 0;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                .custom-popup.show {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                .custom-popup.success {
                    background-color: #4CAF50;
                }
                .custom-popup.error {
                    background-color: #f44336;
                }
                .custom-popup i {
                    margin-right: 10px;
                    font-size: 1.2em;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Mettre à jour le contenu et le style
        popup.className = `custom-popup ${isSuccess ? 'success' : 'error'}`;
        popup.innerHTML = `<i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
        
        // Afficher la popup
        setTimeout(() => popup.classList.add('show'), 10);
        
        // Cacher la popup après 5 secondes
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        }, 5000);
    }

    // Gestion du formulaire de contact
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) {
            console.error('Formulaire de contact non trouvé');
            return;
        }
        
        // Fonction pour afficher une erreur sous un champ
        function showFieldError(input, message) {
            const formGroup = input.closest('.form-group');
            if (!formGroup) return;
            
            let errorElement = formGroup.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                formGroup.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            input.style.borderColor = '#f44336';
        }
        
        // Fonction pour effacer les erreurs d'un champ
        function clearFieldError(input) {
            const formGroup = input.closest('.form-group');
            if (!formGroup) return;
            
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            
            input.style.borderColor = '';
        }

        // Animation des champs du formulaire
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            const focusBorder = document.createElement('span');
            const errorMessage = document.createElement('div');
            
            focusBorder.className = 'focus-border';
            errorMessage.className = 'error-message';
            
            group.appendChild(focusBorder);
            group.appendChild(errorMessage);

            // Gestion du focus
            input.addEventListener('focus', () => {
                label.style.top = '-1.2rem';
                label.style.fontSize = '0.8rem';
                label.style.color = 'var(--primary-color)';
                focusBorder.style.width = '100%';
                errorMessage.textContent = '';
                input.style.borderColor = '';
            });

            // Gestion du blur avec validation
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.style.top = '1rem';
                    label.style.fontSize = '1rem';
                    label.style.color = '#999';
                }
                focusBorder.style.width = '0%';
                
                // Validation au blur
                validateField(input, errorMessage);
            });
        });
        
        // Fonction de validation d'un champ
        function validateField(input, errorElement) {
            if (input.hasAttribute('required') && !input.value.trim()) {
                errorElement.textContent = 'Ce champ est requis';
                input.style.borderColor = '#f44336';
                return false;
            }
            
            if (input.type === 'email' && input.value && !validateEmail(input.value)) {
                errorElement.textContent = 'Veuillez entrer une adresse email valide';
                input.style.borderColor = '#f44336';
                return false;
            }
            
            errorElement.textContent = '';
            input.style.borderColor = '';
            return true;
        }

        // Soumission du formulaire
        contactForm.addEventListener('submit', function(e) {
            console.log('Début de la soumission du formulaire');
            
            // Empêcher le comportement par défaut du formulaire
            e.preventDefault();
            console.log('Comportement par défaut empêché');
            
            // Valider tous les champs
            let isValid = true;
            const fieldsToValidate = contactForm.querySelectorAll('input[required], textarea[required]');
            console.log('Champs à valider:', fieldsToValidate.length);
            
            fieldsToValidate.forEach(field => {
                console.log('Validation du champ:', field.name, 'valeur:', field.value);
                const errorElement = field.closest('.form-group').querySelector('.error-message');
                if (!validateField(field, errorElement)) {
                    console.log('Champ invalide:', field.name);
                    isValid = false;
                } else {
                    console.log('Champ valide:', field.name);
                }
            });
            
            if (!isValid) {
                console.log('Formulaire invalide, affichage du message d\'erreur');
                showPopup('Veuillez corriger les erreurs dans le formulaire', false);
                return false;
            }
            
            console.log('Tous les champs sont valides, préparation de l\'envoi');
            
            // Récupération des données du formulaire
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            console.log('Formulaire soumis avec les données :', formData);
            console.log('Bouton de soumission :', submitBtn);
            
            // Désactiver le bouton pendant l'envoi
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            // Simulation d'envoi (à remplacer par un vrai appel API)
            setTimeout(() => {
                // Simulation de succès ou d'échec aléatoire pour la démo
                const isSuccess = Math.random() > 0.3;
                
                if (isSuccess) {
                    // Succès
                    showPopup('Message envoyé avec succès ! Nous vous recontacterons bientôt.', true);
                    contactForm.reset();
                } else {
                    // Échec
                    showPopup('Une erreur est survenue. Veuillez réessayer plus tard.', false);
                }
                
                // Réactiver le bouton
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 1500);
            
            // Empêcher la soumission réelle du formulaire
            return false;
        });
    }
    
    // Initialisation de la carte (simulée avec Google Maps)
    function initMap() {
        const mapContainer = document.querySelector('.map-container');
        if (!mapContainer) return;
        
        // Simulation de chargement de la carte
        mapContainer.innerHTML = `
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.9472260568!2d2.277019991223993!3d48.8588377395587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis!5e0!3m2!1sfr!2sfr!4v1620000000000!5m2!1sfr!2sfr" 
                width="100%" 
                height="450" 
                style="border:0; border-radius: 8px;" 
                allowfullscreen="" 
                loading="lazy">
            </iframe>
        `;
    }

    // Observer pour déclencher les animations au défilement
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('about-section')) {
                    animateSkills();
                }
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observer les sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Démarrer l'animation de frappe
    typeWriter();
});

// Fonction pour mettre à jour l'année actuelle
function updateCurrentYear() {
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
}

// Mettre à jour l'année au chargement et au redimensionnement
updateCurrentYear();
window.addEventListener('resize', updateCurrentYear);
