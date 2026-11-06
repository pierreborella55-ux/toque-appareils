const boutons = document.querySelectorAll(".zone-clic");
const champRecherche = document.getElementById("recherche");
const selectAppareilSauvegarde = document.getElementById("appareilSauvegarde");

boutons.forEach(bouton => {
  bouton.addEventListener("click", () => {
    const motCle = champRecherche.value.trim();
    const appareilRecherche = bouton.getAttribute("data-mot");

    if (motCle === "") {
      alert("Merci de taper un aliment ou un mot-clé avant de choisir un appareil.");
      return;
    }

    const requete = encodeURIComponent(motCle + " " + appareilRecherche);
    const urlGoogle = "https://www.google.com/search?q=" + requete;
    window.open(urlGoogle, "_blank");

    if (selectAppareilSauvegarde) {
      selectAppareilSauvegarde.value = bouton.getAttribute("data-nom");
    }
  });
});

const formSauvegarde = document.getElementById("formSauvegarde");
if (formSauvegarde) {
  formSauvegarde.addEventListener("submit", (e) => {
    e.preventDefault();

    const titre = document.getElementById("titreRecette").value.trim();
    const url = document.getElementById("urlRecette").value.trim();
    const appareil = selectAppareilSauvegarde.value;
    const motCle = champRecherche.value.trim();

    if (titre === "" || url === "") {
      alert("Merci de renseigner le titre et le lien de la recette.");
      return;
    }

    const nouvelleRecette = {
      id: Date.now(),
      titre: titre,
      url: url,
      appareil: appareil,
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
