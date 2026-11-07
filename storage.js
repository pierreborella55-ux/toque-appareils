// ===== RECETTES =====
function getRecettes() {
  const data = localStorage.getItem("recettes");
  return data ? JSON.parse(data) : [];
}

function sauvegarderRecettes(recettes) {
  localStorage.setItem("recettes", JSON.stringify(recettes));
}

function ajouterRecette(recette) {
  const recettes = getRecettes();
  recettes.push(recette);
  sauvegarderRecettes(recettes);
}

function supprimerRecette(id) {
  let recettes = getRecettes();
  recettes = recettes.filter(r => r.id !== id);
  sauvegarderRecettes(recettes);
}

function mettreAJourRecette(id, changements) {
  const recettes = getRecettes();
  const recette = recettes.find(r => r.id === id);
  if (recette) {
    Object.assign(recette, changements);
    sauvegarderRecettes(recettes);
  }
}

// ===== EXPORT / IMPORT =====
function exporterRecettes() {
  const recettes = getRecettes();
  const donnees = JSON.stringify(recettes, null, 2);
  const blob = new Blob([donnees], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const lien = document.createElement("a");
  lien.href = url;
  const date = new Date().toISOString().slice(0, 10);
  lien.download = `toque-appareils-recettes-${date}.json`;
  document.body.appendChild(lien);
  lien.click();
  document.body.removeChild(lien);
  URL.revokeObjectURL(url);
}

function importerRecettes(fichier, callback) {
  const lecteur = new FileReader();

  lecteur.onload = function (event) {
    try {
      const nouvellesRecettes = JSON.parse(event.target.result);

      if (!Array.isArray(nouvellesRecettes)) {
        callback(false, "Le fichier n'est pas valide.");
        return;
      }

      const recettesActuelles = getRecettes();
      const idsExistants = recettesActuelles.map(r => r.id);

      let ajoutees = 0;
      nouvellesRecettes.forEach(r => {
        if (!idsExistants.includes(r.id)) {
          recettesActuelles.push(r);
          ajoutees++;
        }
      });

      sauvegarderRecettes(recettesActuelles);
      callback(true, `${ajoutees} recette(s) importée(s) avec succès.`);
    } catch (e) {
      callback(false, "Erreur lors de la lecture du fichier.");
    }
  };

  lecteur.readAsText(fichier);
}

// ===== GESTION DES APPAREILS =====
const APPAREILS_PAR_DEFAUT = [
  { id: "monsieur_cuisine", nom: "Monsieur Cuisine", icone: "🥘", photo: null, actif: true },
  { id: "cookeo",           nom: "Cookéo",           icone: "⏲️", photo: null, actif: true },
  { id: "air_fryer",        nom: "Air Fryer",        icone: "🌀", photo: null, actif: true },
  { id: "four",             nom: "Four",             icone: "🔥", photo: null, actif: true },
  { id: "casserole",        nom: "Casserole",        icone: "🍲", photo: null, actif: true }
];

const MAPPING_ANCIEN_VERS_ID = {
  "🥘 Monsieur Cuisine": "monsieur_cuisine",
  "⏲️ Cookéo": "cookeo",
  "🌀 Air Fryer": "air_fryer",
  "🔥 Four": "four",
  "🍲 Casserole": "casserole"
};

function getAppareils() {
  const data = localStorage.getItem("appareils");
  if (!data) {
    sauvegarderAppareils(APPAREILS_PAR_DEFAUT);
    return JSON.parse(JSON.stringify(APPAREILS_PAR_DEFAUT));
  }
  return JSON.parse(data);
}

function sauvegarderAppareils(appareils) {
  localStorage.setItem("appareils", JSON.stringify(appareils));
}

function getAppareilParId(id) {
  return getAppareils().find(a => a.id === id);
}

function ajouterAppareil(nom, icone, photo) {
  const appareils = getAppareils();
  const id = "custom_" + Date.now();
  appareils.push({
    id: id,
    nom: nom,
    icone: icone || "🍴",
    photo: photo || null,
    actif: true
  });
  sauvegarderAppareils(appareils);
  return id;
}

function mettreAJourAppareil(id, changements) {
  const appareils = getAppareils();
  const appareil = appareils.find(a => a.id === id);
  if (appareil) {
    Object.assign(appareil, changements);
    sauvegarderAppareils(appareils);
  }
}

function supprimerAppareil(id) {
  let appareils = getAppareils();
  appareils = appareils.filter(a => a.id !== id);
  sauvegarderAppareils(appareils);
}

function getIconeAffichage(appareil) {
  if (appareil.photo) return appareil.photo;
  return appareil.icone;
}

// ===== Mémorisation du dernier appareil utilisé =====
function getDernierAppareilUtilise() {
  return localStorage.getItem("dernierAppareilUtilise");
}

function setDernierAppareilUtilise(id) {
  localStorage.setItem("dernierAppareilUtilise", id);
}

// ===== Migration automatique des anciennes recettes =====
function migrerRecettesVersAppareilId() {
  const recettes = getRecettes();
  let modifie = false;

  recettes.forEach(r => {
    if (!r.appareilId && r.appareil) {
      const idTrouve = MAPPING_ANCIEN_VERS_ID[r.appareil];
      if (idTrouve) {
        r.appareilId = idTrouve;
        modifie = true;
      }
    }
  });

  if (modifie) {
    sauvegarderRecettes(recettes);
  }
}

migrerRecettesVersAppareilId();

// ===== GESTION DE LA LISTE DE COURSES =====
function getListeCourses() {
  const data = localStorage.getItem("listeCourses");
  return data ? JSON.parse(data) : [];
}

function sauvegarderListeCourses(liste) {
  localStorage.setItem("listeCourses", JSON.stringify(liste));
}

function ajouterArticleCourse(texte) {
  const liste = getListeCourses();
  liste.push({
    id: Date.now(),
    texte: texte,
    coche: false
  });
  sauvegarderListeCourses(liste);
}

function toggleArticleCourse(id) {
  const liste = getListeCourses();
  const article = liste.find(a => a.id === id);
  if (article) {
    article.coche = !article.coche;
    sauvegarderListeCourses(liste);
  }
}

function supprimerArticleCourse(id) {
  let liste = getListeCourses();
  liste = liste.filter(a => a.id !== id);
  sauvegarderListeCourses(liste);
}

function nettoyerArticlesCoches() {
  let liste = getListeCourses();
  liste = liste.filter(a => !a.coche);
  sauvegarderListeCourses(liste);
}

function viderListeCourses() {
  sauvegarderListeCourses([]);
}

// ===== AJOUT : GESTION DU THÈME (sombre/clair) =====
function getTheme() {
  return localStorage.getItem("theme") || "sombre";
}

function setTheme(theme) {
  localStorage.setItem("theme", theme);
  appliquerTheme();
}

function appliquerTheme() {
  const theme = getTheme();
  if (theme === "clair") {
    document.body.classList.add("theme-clair");
  } else {
    document.body.classList.remove("theme-clair");
  }
}

// Applique le thème dès le chargement du script, sur toutes les pages
appliquerTheme();
// ===== FIN AJOUT =====