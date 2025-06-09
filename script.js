document.addEventListener('DOMContentLoaded', () => {
    // Test si le script est chargé
    console.log('Script chargé');
    
    // Gestion du menu mobile
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    console.log('menuToggle:', menuToggle);
    console.log('mobileMenu:', mobileMenu);

    // Initialisation du menu fermé
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        body.classList.remove('no-scroll');
    }

    // Gestion du bouton hamburger
    if (menuToggle && mobileMenu) {
        console.log('Écouteur ajouté au bouton');
        menuToggle.addEventListener('click', () => {
            console.log('Bouton cliqué');
            mobileMenu.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });
    } else {
        console.log('Impossible d\'ajouter l\'écouteur - menuToggle ou mobileMenu manquant');
    }

    // Fermer le menu quand on clique sur un lien
    const asideAnchors = document.querySelectorAll('.aside-anchor');
    console.log('Nombre de liens aside-anchor:', asideAnchors.length);
    asideAnchors.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                body.classList.remove('no-scroll');
            }
            
            // Scroller vers la section
            const targetId = e.currentTarget.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});