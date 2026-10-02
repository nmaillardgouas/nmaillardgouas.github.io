// accueil.js

function obtenirCouleurTechno(techno) {
  const t = techno.toLowerCase();
  if (t.includes('html')) return '#E34F26';
  if (t.includes('css')) return '#1572B6';
  if (t.includes('javascript') || t === 'js') return '#F7DF1E';
  if (t.includes('python')) return '#3776AB';
  if (t.includes('java')) return '#007396';
  if (t.includes('bash')) return '#4EAA25';
  return '#6366F1';
}

async function chargerProjetsAccueil() {
  const container = document.querySelector('#grid-projets-accueil');
  if (!container) return;

  try {
    const reponse = await fetch('./projets.json');
    if (!reponse.ok) throw new Error("Impossible de charger projets.json");
    
    const projets = await reponse.json();
    
    // On sélectionne précisément les projets 1, 2 et 7 (correspondant à "projet1", "projet2", "projet7")
    const idsSouhaites = ["projet7", "projet2", "projet9"];
    const projetsAffiches = projets.filter(p => idsSouhaites.includes(p.id));

    container.innerHTML = '';

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

  } catch (error) {
    console.error(error);
    container.innerHTML = `<p style="color: var(--text-muted);">Erreur lors du chargement des projets.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', chargerProjetsAccueil);