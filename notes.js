const params = new URLSearchParams(window.location.search);
const recetteId = Number(params.get("id"));

const titreRecetteNotes = document.getElementById("titreRecetteNotes");
const texteNotes = document.getElementById("texteNotes");
const btnEnregistrerNotes = document.getElementById("btnEnregistrerNotes");
const btnEffacerNotes = document.getElementById("btnEffacerNotes");
const messageNotes = document.getElementById("messageNotes");

function chargerNotes() {
  const recettes = getRecettes();
  const recette = recettes.find(r => r.id === recetteId);

  if (!recette) {
    titreRecetteNotes.textContent = "Recette introuvable";
    texteNotes.disabled = true;
    btnEnregistrerNotes.disabled = true;
    btnEffacerNotes.disabled = true;
    return;
  }

  titreRecetteNotes.textContent = recette.titre;
  texteNotes.value = recette.notes || "";
}

chargerNotes();

if (btnEnregistrerNotes) {
  btnEnregistrerNotes.addEventListener("click", () => {
    mettreAJourRecette(recetteId, { notes: texteNotes.value });
    messageNotes.textContent = "✅ Notes enregistrées !";
    setTimeout(() => { messageNotes.textContent = ""; }, 2000);
  });
}

if (btnEffacerNotes) {
  btnEffacerNotes.addEventListener("click", () => {
    if (confirm("Effacer toutes les notes de cette recette ?")) {
      texteNotes.value = "";
      mettreAJourRecette(recetteId, { notes: "" });
      messageNotes.textContent = "🗑️ Notes effacées.";
      setTimeout(() => { messageNotes.textContent = ""; }, 2000);
    }
  });
}