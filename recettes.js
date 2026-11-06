const filtreAppareil = document.getElementById("filtreAppareil");
const rechercheInterne = document.getElementById("rechercheInterne");

if (filtreAppareil) filtreAppareil.addEventListener("change", afficherRecettes);
if (rechercheInterne) rechercheInterne.addEventListener("input", afficherRecettes);

function afficherRecettes() {
  const conteneur = document.getElementById("listeRecettes");
  let recettes = getRecettes();

  const appareilChoisi = filtreAppareil ? filtreAppareil.value : "Tous";
  const texteRecherche = rechercheInterne ? rechercheInterne.value.trim().toLowerCase() : "";

  if (appareilChoisi !== "Tous") {
    recettes = recettes.filter(r => r.appareil === appareilChoisi);
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

    carte.innerHTML = "<a href=\"" + recette.url + "\" target=\"_blank\" class=\"titre-recette\">" + recette.titre + "</a>" +
      "<div class=\"infos-recette\"><span class=\"tag-appareil\">" + recette.appareil + "</span>" +
      "<span class=\"date-recette\">" + recette.dateAjout + "</span></div>" +
      "<div class=\"actions-recette\">" +
      "<label><input type=\"checkbox\" class=\"case-favori\" " + (recette.favori ? "checked" : "") + "> ⭐ Favori</label>" +
      "<label><input type=\"checkbox\" class=\"case-teste\" " + (recette.teste ? "checked" : "") + "> ✅ Testé</label>" +
      "<button class=\"btn-supprimer\">🗑️ Supprimer</button>" +
      "</div>";

    carte.querySelector(".case-favori").addEventListener("change", (e) => {
      mettreAJourRecette(recette.id, { favori: e.target.checked });
    });

    carte.querySelector(".case-teste").addEventListener("change", (e) => {
      mettreAJourRecette(recette.id, { teste: e.target.checked });
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
