// projet-detail.js

async function chargerDetailProjet() {
  const params = new URLSearchParams(window.location.search);
  const projetId = params.get('id');

  const container = document.querySelector('#detail-container');
  if (!container) return;

  if (!projetId) {
    container.innerHTML = `<p>Aucun projet spécifié.</p>`;
    return;
  }

  try {
    const reponse = await fetch('./projets.json');
    if (!reponse.ok) throw new Error("Impossible de charger projets.json");
    
    const projets = await reponse.json();
    const projet = projets.find(p => p.id === projetId);

    if (!projet) {
      container.innerHTML = `<p>Projet introuvable.</p>`;
      return;
    }

    container.innerHTML = `
      <h1>${projet.titre}</h1>
      ${projet.image ? `<img src="${projet.image}" alt="${projet.titre}">` : ''}
      
      <section>
        <h2>Description</h2>
        <p>${projet.description}</p>
      </section>

      ${projet.technologie ? `
        <section>
          <h2>Technologies & Outils</h2>
          <p>${projet.technologie}</p>
        </section>
      ` : ''}

      ${projet.objectif ? `
        <section>
          <h2>Objectif</h2>
          <p>${projet.objectif}</p>
        </section>
      ` : ''}

      ${projet.resultat ? `
        <section>
          <h2>Résultat</h2>
          <p>${projet.resultat}</p>
        </section>
      ` : ''}
    `;

  } catch (error) {
    console.error(error);
    container.innerHTML = `<p>Erreur lors du chargement.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', chargerDetailProjet);