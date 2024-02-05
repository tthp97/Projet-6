const sectionGalerie = document.querySelector(".gallery");
//stockage token connexion
let token = localStorage.getItem("token");
let userId = localStorage.getItem("userId");
console.log(token);
console.log(userId);
//Variables création modale
let modal = document.querySelector(".modale");
let body = document.querySelector(".i-body");
let iconeOpenModale = document.querySelector(".projet-connect");
let iconeCloseModale = document.querySelector(".fa-x");
let filterBar = document.querySelector(".filter-bar");
const redirectionButtonAjoutPhoto = document.querySelector(".modal-button");
const formAjoutPhoto = document.querySelector(".form-envoi-projet");
const galerieModale = document.querySelector(".choix-projet-modale");
const flècheRetourModale = document.querySelector(".fa-arrow-left");
const modalContainer = document.getElementById("modale-container");
//génération des projets
async function gestionProjet() {
  const reponse1 = await fetch(`http://localhost:5678/api/works`);
  const projet1 = await reponse1.json();
  sectionGalerie.innerHTML = "";
  creationProjet(projet1);
}
function creationProjet(projet) {
  for (let i = 0; i < projet.length; i++) {
    const travaux = projet[i];
    //creation de l'emplacement des projets
    const figureProjet = document.createElement("figure");
    figureProjet.setAttribute("class", `${travaux.category.name}`);
    //création des balises pour chaque fiche projet
    const imageProjet = document.createElement("img");
    imageProjet.src = travaux.imageUrl;
    const titreProjet = document.createElement("figurecpation");
    titreProjet.innerText = travaux.title;
    sectionGalerie.appendChild(figureProjet);
    figureProjet.appendChild(imageProjet);
    figureProjet.appendChild(titreProjet);
  }
}
//assignation des différents boutons
const bt = document.querySelector(".bt");
const bo = document.querySelector(".bo");
const ba = document.querySelector(".ba");
const bhr = document.querySelector(".bhr");
const allBtn = document.querySelectorAll(".btn");
function addClickedClass() {
  allBtn.forEach((btn) => {
    btn.classList.remove("button-clicked");
  });
}
//filtre pour afficher tous les projets
bt.addEventListener("click", () => {
  addClickedClass();
  bt.classList.add("button-filter");
  bt.classList.add("button-clicked");
  document.querySelector(".gallery").innerHTML = "";
  gestionProjet();
});

//filtre pour afficher la categorie objet
bo.addEventListener("click", async function () {
  addClickedClass();
  bo.classList.add("button-clicked");
  const fetchWorks = await fetch(`http://localhost:5678/api/works`);
  const response = await fetchWorks.json();
  const objetProjet = response.filter(
    (projet) => projet.category.name == "Objets"
  );
  document.querySelector(".gallery").innerHTML = "";
  creationProjet(objetProjet);
});

//filtre pour afficher la catégorie appartement
ba.addEventListener("click", async function () {
  addClickedClass();
  const fetchWorks = await fetch(`http://localhost:5678/api/works`);
  const response = await fetchWorks.json();
  ba.classList.add("button-clicked");
  const appartementsProjet = response.filter(
    (projet) => projet.category.name == "Appartements"
  );
  document.querySelector(".gallery").innerHTML = "";
  creationProjet(appartementsProjet);
});

//filtre pour afficher la catégorie hotel et restaurant
bhr.addEventListener("click", async function () {
  addClickedClass();
  const fetchWorks = await fetch(`http://localhost:5678/api/works`);
  const response = await fetchWorks.json();
  bhr.classList.add("button-clicked");
  const hrProjet = response.filter(
    (projet) => projet.category.name == "Hotels & restaurants"
  );
  document.querySelector(".gallery").innerHTML = "";
  creationProjet(hrProjet);
});

//Generation des projets de la modale
async function genererProjetModale() {
  let reponseModale = await fetch(`http://localhost:5678/api/works`);
  let projetModale = await reponseModale.json();
  const sectionGalerieModale = document.querySelector(
    ".insertion-projet-modale"
  );
  sectionGalerieModale.innerHTML = "";
  for (let i = 0; i < projetModale.length; i++) {
    if (token) {
      let travaux = projetModale[i];
      //creation de l'emplacement des projets
      const figureProjet = document.createElement("figure");
      //création des balises pour chaque fiche projet
      const imageProjet = document.createElement("img");
      const btnSuppressionProjet = document.createElement("i");
      btnSuppressionProjet.classList.add("fa-solid");
      btnSuppressionProjet.classList.add("fa-trash-can");
      imageProjet.src = travaux.imageUrl;
      figureProjet.appendChild(imageProjet);
      figureProjet.appendChild(btnSuppressionProjet);
      sectionGalerieModale.appendChild(figureProjet);
      // Fonction de suppression des projets
      btnSuppressionProjet.addEventListener("click", (event) => {
        event.preventDefault();
        const id = projetModale[i].id;
        fetch(`http://localhost:5678/api/works/${id}`, {
          method: "DELETE",
          headers: {
            accept: "*/*",
            Authorization: "Bearer " + token,
          },
          body: id,
        }).then(async (reponse) => {
          console.log(reponse.status);
          if (reponse.status === 204) {
            genererProjetModale();
            gestionProjet();
          } else {
            alert("Le projet a sans doute déja été supprimé...");
          }
        });
      });
    }
  }
}

//initialisation des projets à chaque endroit
gestionProjet();
genererProjetModale();

//affichage barre d'éditon lors de la connexion
function affichageEditBar() {
  //Selection editBar
  const editBar = document.querySelector(".bandeau-edition");
  editBar.classList.remove("d-none");
  editBar.removeAttribute("aria-hidden");
  const projetConnect = document.querySelector(".projet-connect");
  projetConnect.classList.remove("d-none");
  const navBar = document.querySelector(".filter-bar");
  navBar.classList.add("d-none");
  //gestion du click sur le mode edition pour ouvrir la modale
  iconeOpenModale.addEventListener("click", openModale);
}
//Fonction ouverture de la modale
function openModale() {
  modal.classList.remove("d-none");
  modalContainer.classList.remove("d-none");
  modal.setAttribute("id", "modal");
  body.classList.add("change-body");
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", true);
  redirectionButtonAjoutPhoto.addEventListener("click", () => {
    affichageFormulaireAjoutPhoto();
  });
  flècheRetourModale.addEventListener("click", () => {
    retourGalerieModal();
  });
  iconeCloseModale.addEventListener("click", () => {
    closeModale();
  });
}
//Fonction de fermeture de la modale
function closeModale() {
  modal.classList.add("d-none");
  modalContainer.classList.add("d-none");
  body.classList.remove("change-body");
  modal.setAttribute("aria-hidden", true);
  modal.removeAttribute("aria-modal");
}

modalContainer.addEventListener("click", function (event) {
  if (event.target == modalContainer) {
    closeModale();
  }
});
//ajout formulaire ajoutPhoto

function affichageFormulaireAjoutPhoto() {
  flècheRetourModale.classList.remove("d-none");
  galerieModale.setAttribute("id", "choix-projet-modale-hidden");
  formAjoutPhoto.classList.remove("d-none");
  formAjoutPhoto.classList.add("d-flex");
}

//inialisation bouton de retour vers galerie Modal

function retourGalerieModal() {
  galerieModale.removeAttribute("id", "choix-projet-modale-hidden");
  flècheRetourModale.classList.add("d-none");
  formAjoutPhoto.classList.add("d-none");
  formAjoutPhoto.classList.remove("d-flex");
}

//fonction affichant l'image à envoyer à l'api
const fileInput = document.getElementById("image");

function previewImage() {
  const file = fileInput.files[0];
  const maxSize = 4 * 1024 * 1024;
  const fausseImage = document.getElementById("image-container");
  const imagePreviewContainer = document.querySelector(".ajout-image");
  if (file.size > maxSize) {
    file.value = "";
  } else if (file.type.match("image/*")) {
    const reader = new FileReader();
    reader.addEventListener("load", function (event) {
      const imageUrl = event.target.result;
      const image = new Image();
      image.addEventListener("load", function () {
        imagePreviewContainer.insertAdjacentElement("afterBegin", image);
        fausseImage.remove();
      });
      image.src = imageUrl;
      image.style.width = "76px";
      image.style.height = "auto";
      image.setAttribute("id", "no-opacity");
    });

    reader.readAsDataURL(file);
  }
}
const messageErreurEnvoiProjet = document.querySelector(
  ".message-erreur-ajout"
);
const formulaire = document.querySelector("#btn-envoi");
const donneesFormulaire = document.querySelector("#ajout-projet");
fileInput.addEventListener("change", previewImage);
formulaire.addEventListener("click", (event) => {
  event.preventDefault();
  const formData = new FormData(donneesFormulaire);
  const formImage = document.getElementById("image");
  const formTitle = document.getElementById("titre-image");
  const formCategory = document.getElementById("categorie-image");
  formData.append("image", formImage.value);
  formData.append("title", formTitle.value);
  formData.append("category", formCategory.value);
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: formData,
  }).then(async (reponse) => {
    formImage.value = "";
    formTitle.value = "";
    formCategory.value = "";
    console.log(reponse.status);
    if (reponse.status === 201) {
      genererProjetModale();
      gestionProjet();
    } else if (reponse.status === 500) {
      messageErreurEnvoiProjet.innerHTML = `<em class="pw-null">Vous avez sans doutes mal rempli le formulaire, réessayez.</em>`;
    }
  });
});

if (token) {
  affichageEditBar();
  //remplacement du lien login par le lien logout
  const emplacementLogout = document.querySelector(".logout");
  emplacementLogout.parentElement.setAttribute("href", "index.html");
  emplacementLogout.innerHTML = "";
  const logout = document.createElement("li");
  logout.innerText = "logout";
  //token est remis à 0 et l'utililisateur est déconnecté
  emplacementLogout.appendChild(logout);
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    token = null;
    userId = null;
  });
}
