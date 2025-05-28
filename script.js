document.addEventListener('DOMContentLoaded', () => {
    // Gestion des boutons "voir le projet"
    const projectButtons = document.querySelectorAll('.voir-projet');
    projectButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Récupérer l'ID du projet depuis l'attribut data-project
            const projectId = button.dataset.project;
            
            // Trouver le projet correspondant
            const project = document.querySelector(`#${projectId}`);
            
            if (project) {
                // Scroller doucement vers le projet
                project.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Smooth scroll pour les liens de navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});