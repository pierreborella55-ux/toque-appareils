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
