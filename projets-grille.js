// projets-grille.js

function obtenirCouleurTechno(techno) {
  const t = techno.toLowerCase();
  if (t.includes('html')) return '#E34F26';
  if (t.includes('css')) return '#1572B6';
  if (t.includes('javascript') || t === 'js') return '#F7DF1E';
  if (t.includes('python')) return '#3776AB';
  if (t.includes('java')) return '#007396';
  if (t.includes('bash')) return '#4EAA25';
  return '#6366F1'; // Couleur par défaut
}

async function chargerGrille() {
  const container = document.querySelector('#grid-projets');
  const searchInput = document.querySelector('#search-input');
  if (!container) return;

  try {
    const reponse = await fetch('./projets.json');
    if (!reponse.ok) throw new Error("Impossible de charger projets.json");
    
    const projets = await reponse.json();

    // Fonction pour afficher les projets
    function afficherProjets(projetsAffiches) {
      container.innerHTML = '';
      
      if (projetsAffiches.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); grid-column: 1 / -1;">Aucun projet ne correspond à votre recherche.</p>`;
        return;
      }

      projetsAffiches.forEach(projet => {
        const card = document.createElement('div');
        card.className = 'carte';
        card.style.cursor = 'pointer';
        card.onclick = () => {
          window.location.href = `detail.html?id=${projet.id}`;
        };

        let badgesHtml = '';
        if (projet.badges && projet.badges.length > 0) {
          badgesHtml = `
            <div class="card-tags">
              ${projet.badges.map(tech => {
                const couleur = obtenirCouleurTechno(tech);
                return `
                  <span class="tech-badge">
                    <span class="tech-dot" style="background-color: ${couleur};"></span>
                    ${tech}
                  </span>
                `;
              }).join('')}
            </div>
          `;
        }

        card.innerHTML = `
          ${projet.image ? `<img src="${projet.image}" alt="${projet.titre}">` : ''}
          <div class="card-content">
            <h3>${projet.titre}</h3>
            <p>${projet.description}</p>
            ${badgesHtml}
          </div>
        `;

        container.appendChild(card);
      });
    }

    // Affichage initial de tous les projets
    afficherProjets(projets);

    // Écouteur d'événement sur la barre de recherche
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const valeurRecherche = e.target.value.toLowerCase().trim();

        // 1. Filtrage des projets
        const projetsFiltres = projets.filter(projet => {
          const matchTitre = projet.titre && projet.titre.toLowerCase().includes(valeurRecherche);
          const matchDesc = projet.description && projet.description.toLowerCase().includes(valeurRecherche);
          const matchBadge = projet.badges && projet.badges.some(b => b.toLowerCase().includes(valeurRecherche));
          const matchTechTexte = projet.technologie && projet.technologie.toLowerCase().includes(valeurRecherche);

          return matchTitre || matchDesc || matchBadge || matchTechTexte;
        });

        // 2. Tri spécifique si l'utilisateur tape "java" pour remonter Java avant JavaScript
        if (valeurRecherche === "java") {
          projetsFiltres.sort((a, b) => {
            const estExactJava = (projet) => {
              const badges = projet.badges || [];
              const tech = projet.technologie || "";
              const badgeExact = badges.some(b => b.toLowerCase() === "java");
              const techExact = tech.toLowerCase() === "java";
              return badgeExact || techExact;
            };

            const aEstJava = estExactJava(a);
            const bEstJava = estExactJava(b);

            if (aEstJava && !bEstJava) return -1;
            if (!aEstJava && bEstJava) return 1;
            return 0;
          });
        }

        afficherProjets(projetsFiltres);
      });
    }

  } catch (error) {
    console.error(error);
    container.innerHTML = `<p>Erreur lors du chargement.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', chargerGrille);