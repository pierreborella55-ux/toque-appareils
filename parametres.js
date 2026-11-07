// ===== Gestion des onglets =====
const boutonsOnglets = document.querySelectorAll(".btn-onglet");
const contenusOnglets = document.querySelectorAll(".contenu-onglet");

boutonsOnglets.forEach(bouton => {
  bouton.addEventListener("click", () => {
    boutonsOnglets.forEach(b => b.classList.remove("actif"));
    contenusOnglets.forEach(c => c.classList.remove("actif"));

    bouton.classList.add("actif");
    document.getElementById(bouton.getAttribute("data-onglet")).classList.add("actif");
  });
});

// ===== Redimensionne une photo avant de la stocker (pour ne pas saturer le localStorage) =====
function redimensionnerImage(fichier, tailleMax, callback) {
  const lecteur = new FileReader();
  lecteur.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      let largeur = img.width;
      let hauteur = img.height;

      if (largeur > hauteur) {
        if (largeur > tailleMax) {
          hauteur = Math.round(hauteur * (tailleMax / largeur));
          largeur = tailleMax;
        }
      } else {
        if (hauteur > tailleMax) {
          largeur = Math.round(largeur * (tailleMax / hauteur));
          hauteur = tailleMax;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = largeur;
      canvas.height = hauteur;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, largeur, hauteur);

      const base64 = canvas.toDataURL("image/jpeg", 0.8);
      callback(base64);
    };
    img.src = event.target.result;
  };
  lecteur.readAsDataURL(fichier);
}

// ===== AJOUT : trouve l'icône d'origine d'un appareil de base =====
function getIconeParDefaut(id) {
  const base = APPAREILS_PAR_DEFAUT.find(a => a.id === id);
  return base ? base.icone : "🍴";
}

// ===== Affichage de la liste des appareils =====
function afficherListeAppareils() {
  const conteneur = document.getElementById("listeAppareils");
  const appareils = getAppareils();
  conteneur.innerHTML = "";

  appareils.forEach(appareil => {
    const carte = document.createElement("div");
    carte.className = "carte-appareil";

    const iconeHTML = appareil.photo
      ? `<img src="${appareil.photo}" class="icone-appareil-photo">`
      : `<span class="icone-appareil-emoji">${appareil.icone}</span>`;

    const estPersonnalise = appareil.id.startsWith("custom_");

    carte.innerHTML = `
      <div class="ligne-appareil">
        <div class="icone-appareil-zone">${iconeHTML}</div>
        <input type="text" class="input-nom-appareil" value="${appareil.nom}">
        <label class="switch-actif">
          <input type="checkbox" class="case-actif-appareil" ${appareil.actif ? "checked" : ""}>
          <span class="slider-actif"></span>
        </label>
      </div>
      <div class="ligne-appareil-actions">
        <label class="btn-photo-mini">
          📷 Photo
          <input type="file" accept="image/*" capture="environment" class="input-photo-camera" style="display:none;">
        </label>
        <label class="btn-photo-mini">
          🖼️ Galerie
          <input type="file" accept="image/*" class="input-photo-galerie" style="display:none;">
        </label>
        ${appareil.photo ? '<button class="btn-reset-icone">🔄 Défaut</button>' : ""}
        ${estPersonnalise ? '<button class="btn-supprimer-appareil">🗑️</button>' : ""}
      </div>
    `;

    carte.querySelector(".input-nom-appareil").addEventListener("change", (e) => {
      mettreAJourAppareil(appareil.id, { nom: e.target.value.trim() || appareil.nom });
    });

    carte.querySelector(".case-actif-appareil").addEventListener("change", (e) => {
      mettreAJourAppareil(appareil.id, { actif: e.target.checked });
    });

    carte.querySelector(".input-photo-camera").addEventListener("change", (e) => {
      const fichier = e.target.files[0];
      if (!fichier) return;
      redimensionnerImage(fichier, 150, (base64) => {
        mettreAJourAppareil(appareil.id, { photo: base64 });
        afficherListeAppareils();
      });
    });

    carte.querySelector(".input-photo-galerie").addEventListener("change", (e) => {
      const fichier = e.target.files[0];
      if (!fichier) return;
      redimensionnerImage(fichier, 150, (base64) => {
        mettreAJourAppareil(appareil.id, { photo: base64 });
        afficherListeAppareils();
      });
    });

    // ===== AJOUT : Réinitialiser l'icône par défaut =====
    const btnReset = carte.querySelector(".btn-reset-icone");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        const iconeDefaut = estPersonnalise ? "🍴" : getIconeParDefaut(appareil.id);
        mettreAJourAppareil(appareil.id, { photo: null, icone: iconeDefaut });
        afficherListeAppareils();
      });
    }
    // ===== FIN AJOUT =====

    const btnSupprimer = carte.querySelector(".btn-supprimer-appareil");
    if (btnSupprimer) {
      btnSupprimer.addEventListener("click", () => {
        if (confirm(`Supprimer l'appareil "${appareil.nom}" ?`)) {
          supprimerAppareil(appareil.id);
          afficherListeAppareils();
        }
      });
    }

    conteneur.appendChild(carte);
  });
}

afficherListeAppareils();

// ===== Ajout d'un nouvel appareil =====
let photoNouvelAppareil = null;

const inputPhotoCameraNouvel = document.getElementById("nouvelAppareilPhotoCamera");
const inputPhotoGalerieNouvel = document.getElementById("nouvelAppareilPhotoGalerie");
const previewNouvel = document.getElementById("previewNouvelAppareil");

if (inputPhotoCameraNouvel) {
  inputPhotoCameraNouvel.addEventListener("change", (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;
    redimensionnerImage(fichier, 150, (base64) => {
      photoNouvelAppareil = base64;
      previewNouvel.innerHTML = `<img src="${base64}" class="preview-photo-appareil">`;
    });
  });
}

if (inputPhotoGalerieNouvel) {
  inputPhotoGalerieNouvel.addEventListener("change", (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;
    redimensionnerImage(fichier, 150, (base64) => {
      photoNouvelAppareil = base64;
      previewNouvel.innerHTML = `<img src="${base64}" class="preview-photo-appareil">`;
    });
  });
}

const btnAjouterAppareil = document.getElementById("btnAjouterAppareil");
if (btnAjouterAppareil) {
  btnAjouterAppareil.addEventListener("click", () => {
    const nomInput = document.getElementById("nouvelAppareilNom");
    const nom = nomInput.value.trim();
    const message = document.getElementById("messageAjoutAppareil");

    if (nom === "") {
      message.textContent = "❌ Merci de donner un nom à l'appareil.";
      return;
    }

    ajouterAppareil(nom, "🍴", photoNouvelAppareil);

    nomInput.value = "";
    photoNouvelAppareil = null;
    previewNouvel.innerHTML = "";
    inputPhotoCameraNouvel.value = "";
    inputPhotoGalerieNouvel.value = "";

    message.textContent = "✅ Appareil ajouté !";
    setTimeout(() => { message.textContent = ""; }, 2000);

    afficherListeAppareils();
  });
}

// ===== Liste de courses =====
function afficherListeCourses() {
  const conteneur = document.getElementById("listeCourses");
  const liste = getListeCourses();
  conteneur.innerHTML = "";

  if (liste.length === 0) {
    conteneur.innerHTML = "<p class=\"message-courses-vide\">Votre liste est vide.</p>";
    return;
  }

  liste.forEach(article => {
    const ligne = document.createElement("div");
    ligne.className = "ligne-article-course" + (article.coche ? " article-coche" : "");

    ligne.innerHTML = `
      <label class="label-article-course">
        <input type="checkbox" class="case-article-course" ${article.coche ? "checked" : ""}>
        <span>${article.texte}</span>
      </label>
      <button class="btn-supprimer-article">🗑️</button>
    `;

    ligne.querySelector(".case-article-course").addEventListener("change", () => {
      toggleArticleCourse(article.id);
      afficherListeCourses();
    });

    ligne.querySelector(".btn-supprimer-article").addEventListener("click", () => {
      supprimerArticleCourse(article.id);
      afficherListeCourses();
    });

    conteneur.appendChild(ligne);
  });
}

afficherListeCourses();

const champNouvelArticle = document.getElementById("nouvelArticleCourse");
const btnAjouterArticleCourse = document.getElementById("btnAjouterArticleCourse");

function ajouterArticleDepuisChamp() {
  const texte = champNouvelArticle.value.trim();
  if (texte === "") return;
  ajouterArticleCourse(texte);
  champNouvelArticle.value = "";
  afficherListeCourses();
}

if (btnAjouterArticleCourse) {
  btnAjouterArticleCourse.addEventListener("click", ajouterArticleDepuisChamp);
}

if (champNouvelArticle) {
  champNouvelArticle.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ajouterArticleDepuisChamp();
    }
  });
}

const btnNettoyerCourses = document.getElementById("btnNettoyerCourses");
if (btnNettoyerCourses) {
  btnNettoyerCourses.addEventListener("click", () => {
    nettoyerArticlesCoches();
    afficherListeCourses();
  });
}

const btnViderCourses = document.getElementById("btnViderCourses");
if (btnViderCourses) {
  btnViderCourses.addEventListener("click", () => {
    if (confirm("Vider complètement la liste de courses ?")) {
      viderListeCourses();
      afficherListeCourses();
    }
  });
}

// ===== Choix du thème =====
function afficherChoixTheme() {
  const theme = getTheme();
  const btnSombre = document.getElementById("btnThemeSombre");
  const btnClair = document.getElementById("btnThemeClair");

  btnSombre.classList.toggle("theme-actif", theme === "sombre");
  btnClair.classList.toggle("theme-actif", theme === "clair");
}

afficherChoixTheme();

const btnThemeSombre = document.getElementById("btnThemeSombre");
const btnThemeClair = document.getElementById("btnThemeClair");

if (btnThemeSombre) {
  btnThemeSombre.addEventListener("click", () => {
    setTheme("sombre");
    afficherChoixTheme();
  });
}

if (btnThemeClair) {
  btnThemeClair.addEventListener("click", () => {
    setTheme("clair");
    afficherChoixTheme();
  });
}