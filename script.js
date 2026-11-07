const champRecherche = document.getElementById("recherche");
const zoneIcones = document.getElementById("zoneIcones");
const selectAppareilSauvegarde = document.getElementById("appareilSauvegarde");

// ===== Génère dynamiquement les icônes des appareils actifs =====
function afficherIconesAppareils() {
  const appareils = getAppareils().filter(a => a.actif);
  zoneIcones.innerHTML = "";

  appareils.forEach(appareil => {
    const carte = document.createElement("button");
    carte.className = "carte-icone-appareil";
    carte.type = "button";

    const iconeHTML = appareil.photo
      ? `<img src="${appareil.photo}" class="icone-appareil-img">`
      : `<span class="icone-appareil-emoji-accueil">${appareil.icone}</span>`;

    carte.innerHTML = `
      <div class="icone-appareil-cercle">${iconeHTML}</div>
      <span class="nom-appareil-accueil">${appareil.nom}</span>
    `;

    carte.addEventListener("click", () => {
      const motCle = champRecherche.value.trim();

      if (motCle === "") {
        alert("Merci de taper un aliment ou un mot-clé avant de choisir un appareil.");
        return;
      }

      const requete = encodeURIComponent(motCle + " recette " + appareil.nom);
      const urlGoogle = "https://www.google.com/search?q=" + requete;
      window.open(urlGoogle, "_blank");

      if (selectAppareilSauvegarde) {
        selectAppareilSauvegarde.value = appareil.id;
      }

      setDernierAppareilUtilise(appareil.id);
    });

    zoneIcones.appendChild(carte);
  });
}

// ===== Remplit dynamiquement le menu déroulant de sauvegarde =====
function remplirSelectAppareilSauvegarde() {
  const appareils = getAppareils().filter(a => a.actif);
  selectAppareilSauvegarde.innerHTML = "";

  appareils.forEach(appareil => {
    const option = document.createElement("option");
    option.value = appareil.id;
    option.textContent = (appareil.photo ? "" : appareil.icone + " ") + appareil.nom;
    selectAppareilSauvegarde.appendChild(option);
  });

  const dernier = getDernierAppareilUtilise();
  if (dernier && appareils.some(a => a.id === dernier)) {
    selectAppareilSauvegarde.value = dernier;
  }
}

afficherIconesAppareils();
remplirSelectAppareilSauvegarde();

// ===== AJOUT : Récupération automatique d'un partage (Web Share Target) =====
function extraireUrlDepuisTexte(texte) {
  if (!texte) return "";
  const match = texte.match(/(https?:\/\/[^\s]+)/);
  return match ? match[0] : "";
}

function traiterPartageEntrant() {
  const params = new URLSearchParams(window.location.search);
  const titrePartage = params.get("titre_partage") || "";
  const textePartage = params.get("texte_partage") || "";
  const urlPartage = params.get("url_partage") || "";

  // L'URL peut être dans "url_partage", ou cachée dans "texte_partage"
  const urlFinale = urlPartage || extraireUrlDepuisTexte(textePartage) || extraireUrlDepuisTexte(titrePartage);

  if (!urlFinale && !titrePartage) {
    return; // pas de partage reçu, comportement normal
  }

  const champTitre = document.getElementById("titreRecette");
  const champUrl = document.getElementById("urlRecette");

  if (champTitre && titrePartage) {
    champTitre.value = titrePartage;
  }
  if (champUrl && urlFinale) {
    champUrl.value = urlFinale;
  }

  // Pré-sélectionne le dernier appareil utilisé
  const dernier = getDernierAppareilUtilise();
  if (dernier && selectAppareilSauvegarde) {
    const existe = Array.from(selectAppareilSauvegarde.options).some(o => o.value === dernier);
    if (existe) selectAppareilSauvegarde.value = dernier;
  }

  // Nettoie l'URL affichée dans le navigateur (plus propre)
  window.history.replaceState({}, document.title, window.location.pathname);

  // Fait défiler jusqu'au formulaire de sauvegarde pour que ce soit visible
  const blocSauvegarde = document.querySelector(".bloc-sauvegarde");
  if (blocSauvegarde) {
    blocSauvegarde.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

traiterPartageEntrant();
// ===== FIN AJOUT =====

// ===== Formulaire de sauvegarde =====
const formSauvegarde = document.getElementById("formSauvegarde");
if (formSauvegarde) {
  formSauvegarde.addEventListener("submit", (e) => {
    e.preventDefault();

    const titre = document.getElementById("titreRecette").value.trim();
    const url = document.getElementById("urlRecette").value.trim();
    const appareilId = selectAppareilSauvegarde.value;
    const motCle = champRecherche.value.trim();

    if (titre === "" || url === "") {
      alert("Merci de renseigner le titre et le lien de la recette.");
      return;
    }

    const nouvelleRecette = {
      id: Date.now(),
      titre: titre,
      url: url,
      appareilId: appareilId,
      motCle: motCle,
      dateAjout: new Date().toLocaleDateString("fr-FR"),
      favori: false,
      teste: false
    };

    ajouterRecette(nouvelleRecette);

    document.getElementById("titreRecette").value = "";
    document.getElementById("urlRecette").value = "";

    const message = document.getElementById("messageSauvegarde");
    message.textContent = "✅ Recette enregistrée !";
    setTimeout(() => { message.textContent = ""; }, 2500);
  });
}

const lienMesRecettes = document.querySelector(".lien-mes-recettes");
if (lienMesRecettes) {
  lienMesRecettes.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "recettes.html";
  });
}