const filtreAppareil = document.getElementById("filtreAppareil");
const rechercheInterne = document.getElementById("rechercheInterne");

// ===== Remplit dynamiquement le menu déroulant du filtre =====
function remplirFiltreAppareils() {
  const appareils = getAppareils();
  filtreAppareil.innerHTML = "";

  const optionTous = document.createElement("option");
  optionTous.value = "Tous";
  optionTous.textContent = "Tous les appareils";
  filtreAppareil.appendChild(optionTous);

  appareils.forEach(appareil => {
    const option = document.createElement("option");
    option.value = appareil.id;
    option.textContent = (appareil.photo ? "" : appareil.icone + " ") + appareil.nom;
    filtreAppareil.appendChild(option);
  });
}

if (filtreAppareil) {
  remplirFiltreAppareils();
  filtreAppareil.addEventListener("change", afficherRecettes);
}
if (rechercheInterne) rechercheInterne.addEventListener("input", afficherRecettes);

// ===== Retrouve le nom + icône d'un appareil à partir de son id (gère aussi l'ancien format texte) =====
function getInfosAppareilRecette(recette) {
  if (recette.appareilId) {
    const appareil = getAppareilParId(recette.appareilId);
    if (appareil) {
      return {
        nom: appareil.nom,
        iconeHTML: appareil.photo
          ? `<img src="${appareil.photo}" class="tag-appareil-photo">`
          : appareil.icone
      };
    }
  }
  // Ancien format (texte complet déjà stocké avant la migration)
  return { nom: recette.appareil || "Appareil inconnu", iconeHTML: "" };
}

function afficherRecettes() {
  const conteneur = document.getElementById("listeRecettes");
  let recettes = getRecettes();

  const appareilChoisi = filtreAppareil ? filtreAppareil.value : "Tous";
  const texteRecherche = rechercheInterne ? rechercheInterne.value.trim().toLowerCase() : "";

  if (appareilChoisi !== "Tous") {
    recettes = recettes.filter(r => r.appareilId === appareilChoisi);
  }

  if (texteRecherche !== "") {
    recettes = recettes.filter(r => r.titre.toLowerCase().includes(texteRecherche));
  }

  conteneur.innerHTML = "";

  if (recettes.length === 0) {
    conteneur.innerHTML = "<p id=\"messageVide\">Aucune recette trouvée.</p>";
    return;
  }

  recettes.slice().reverse().forEach(recette => {
    const carte = document.createElement("div");
    carte.className = "carte-recette";

    const infosAppareil = getInfosAppareilRecette(recette);
    const aDesNotes = recette.notes && recette.notes.trim() !== "";

    carte.innerHTML = "<a href=\"" + recette.url + "\" target=\"_blank\" class=\"titre-recette\">" + recette.titre + "</a>" +
      "<div class=\"infos-recette\"><span class=\"tag-appareil\">" + infosAppareil.iconeHTML + " " + infosAppareil.nom + "</span>" +
      "<span class=\"date-recette\">" + recette.dateAjout + "</span></div>" +
      "<div class=\"actions-recette\">" +
      "<label><input type=\"checkbox\" class=\"case-favori\" " + (recette.favori ? "checked" : "") + "> ⭐ Favori</label>" +
      "<label><input type=\"checkbox\" class=\"case-teste\" " + (recette.teste ? "checked" : "") + "> ✅ Testé</label>" +
      "<button class=\"btn-notes" + (aDesNotes ? " btn-notes-rempli" : "") + "\">" + (aDesNotes ? "📝 Notes ✓" : "📝 Notes") + "</button>" +
      "<button class=\"btn-supprimer\">🗑️ Supprimer</button>" +
      "</div>";

    carte.querySelector(".case-favori").addEventListener("change", (e) => {
      mettreAJourRecette(recette.id, { favori: e.target.checked });
    });

    carte.querySelector(".case-teste").addEventListener("change", (e) => {
      mettreAJourRecette(recette.id, { teste: e.target.checked });
    });

    carte.querySelector(".btn-notes").addEventListener("click", () => {
      window.location.href = "notes.html?id=" + recette.id;
    });

    carte.querySelector(".btn-supprimer").addEventListener("click", () => {
      if (confirm("Supprimer cette recette ?")) {
        supprimerRecette(recette.id);
        afficherRecettes();
      }
    });

    conteneur.appendChild(carte);
  });
}

afficherRecettes();

// ===== Export / Import =====
const btnExporter = document.getElementById("btnExporter");
const inputImporter = document.getElementById("inputImporter");
const messageImportExport = document.getElementById("messageImportExport");

if (btnExporter) {
  btnExporter.addEventListener("click", () => {
    exporterRecettes();
    messageImportExport.textContent = "✅ Export lancé, vérifiez vos téléchargements.";
  });
}

if (inputImporter) {
  inputImporter.addEventListener("change", (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;

    importerRecettes(fichier, (succes, message) => {
      messageImportExport.textContent = succes ? "✅ " + message : "❌ " + message;
      if (succes) afficherRecettes();
      inputImporter.value = "";
    });
  });
}