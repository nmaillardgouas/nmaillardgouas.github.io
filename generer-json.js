import fs from 'fs';
import path from 'path';

const projetsDir = path.join(process.cwd(), 'content/projets');
const outputFile = path.join(process.cwd(), 'projets.json');

function genererJson() {
  if (!fs.existsSync(projetsDir)) {
    console.log("Le dossier content/projets n'existe pas.");
    return;
  }

  const dossiers = fs.readdirSync(projetsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const projets = [];

  for (const dossier of dossiers) {
    const dossierPath = path.join(projetsDir, dossier);
    
    const titrePath = path.join(dossierPath, 'titre.txt');
    const descPath = path.join(dossierPath, 'description.txt');
    const technoPath = path.join(dossierPath, 'technologie.txt');
    const objectifPath = path.join(dossierPath, 'objectif.txt');
    const resultatPath = path.join(dossierPath, 'resultat.txt');

    const titre = fs.existsSync(titrePath) ? fs.readFileSync(titrePath, 'utf8').trim() : dossier;
    const description = fs.existsSync(descPath) ? fs.readFileSync(descPath, 'utf8').trim() : '';
    
    // 1. Texte brut complet pour la page de détail (contient tout sans exception)
    const technologie = fs.existsSync(technoPath) ? fs.readFileSync(technoPath, 'utf8').trim() : '';

    // 2. Filtrage intelligent pour les badges des cartes (Uniquement Python, JS, Java, HTML5, CSS3)
    const techBrutes = technologie ? technologie.split(',').map(t => t.trim().toLowerCase()) : [];
    const badges = [];

    techBrutes.forEach(t => {
      if (t.includes('python') && !badges.includes('Python')) {
        badges.push('Python');
      }
      if ((t.includes('javascript') || t === 'js') && !badges.includes('JS')) {
        badges.push('JS');
      }
      if ((t.includes('java') && !t.includes('script')) && !badges.includes('Java')) {
        badges.push('Java');
      }
      if (t.includes('html') && !badges.includes('HTML5')) {
        badges.push('HTML5');
      }
      if (t.includes('css') && !badges.includes('CSS3')) {
        badges.push('CSS3');
      }
      if (t.includes('bash') && !badges.includes('Bash')) {
        badges.push('Bash');
      }
    });

    const objectif = fs.existsSync(objectifPath) ? fs.readFileSync(objectifPath, 'utf8').trim() : '';
    const resultat = fs.existsSync(resultatPath) ? fs.readFileSync(resultatPath, 'utf8').trim() : '';

    const fichiers = fs.readdirSync(dossierPath);
    const imageFile = fichiers.find(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
    const image = imageFile ? `./content/projets/${dossier}/${imageFile}` : '';

    projets.push({
      id: dossier,
      titre,
      description,
      technologie, // Texte complet pour detail.html
      badges,      // Liste restreinte pour les badges des cartes
      objectif,
      resultat,
      image
    });
  }

  fs.writeFileSync(outputFile, JSON.stringify(projets, null, 2), 'utf8');
  console.log(`✅ Fichier projets.json généré avec succès (${projets.length} projets trouvés) !`);
}

genererJson();