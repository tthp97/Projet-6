const reponse = await fetch(`http://localhost:5678/api/works`);
const projet = await reponse.json();
const sectionGalerie = document.querySelector(".gallery");
//stockage token connexion
let token = localStorage.getItem("token");
let userId = localStorage.getItem("userId");
console.log(token);
console.log(userId);
//Variables création modale
let modal = document.querySelector(".modale");
let body = document.querySelector(".i-body");
let iconeOpenModale = document.querySelector(".fa-pen-to-square");
let iconeCloseModale = document.querySelector(".fa-x");
let filterBar = document.querySelector(".filter-bar");
const redirectionButtonAjoutPhoto = document.querySelector(".modal-button");
const formAjoutPhoto = document.querySelector(".form-envoi-projet");
const galerieModale = document.querySelector(".choix-projet-modale");
const flècheRetourModale = document.querySelector(".fa-arrow-left");
//génération des projets
//recup section des projets

function genererProjet(projet) {
  for (let i = 0; i < projet.length; i++) {
    const travaux = projet[i];
    //creation de l'emplacement des projets
    const figureProjet = document.createElement("figure");
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
genererProjet(projet);

function genererProjetModale() {
  for (let i = 0; i < projet.length; i++) {
    if (token) {
      let travaux = projet[i];
      //recup section des projets
      const sectionGalerie = document.querySelector(".insertion-projet-modale");
      //creation de l'emplacement des projets
      const figureProjet = document.createElement("figure");
      //création des balises pour chaque fiche projet
      const imageProjet = document.createElement("img");
      const btnSuppressionProjet = document.createElement("i");
      btnSuppressionProjet.classList.add("fa-solid");
      btnSuppressionProjet.classList.add("fa-trash-can");
      imageProjet.src = travaux.imageUrl;
      sectionGalerie.appendChild(figureProjet);
      figureProjet.appendChild(imageProjet);
      figureProjet.appendChild(btnSuppressionProjet);
      btnSuppressionProjet.addEventListener("click", (e) => {
        e.preventDefault();
        const projetId = projet[i].id;
        fetch(`http://localhost:5678/api/works/${projetId}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: `${projetId}`,
        }).then(async (reponse) => {
          if (reponse.ok) {
            projetId[i].splice(i, 1);
          }
        });
      });
    }
  }
}

// Fonction de suppression des projets

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
  genererProjet(projet);
});

//filtre pour afficher la categorie objet
bo.addEventListener("click", function () {
  addClickedClass();
  bo.classList.add("button-clicked");
  const objetProjet = projet.filter(
    (projet) => projet.category.name == "Objets"
  );
  document.querySelector(".gallery").innerHTML = "";
  genererProjet(objetProjet);
});

//filtre pour afficher la catégorie appartement
ba.addEventListener("click", function () {
  addClickedClass();
  ba.classList.add("button-clicked");
  const appartementsProjet = projet.filter(
    (projet) => projet.category.name == "Appartements"
  );
  document.querySelector(".gallery").innerHTML = "";
  genererProjet(appartementsProjet);
});

//filtre pour afficher la catégorie hotel et restaurant
bhr.addEventListener("click", function () {
  addClickedClass();
  bhr.classList.add("button-clicked");
  const hrProjet = projet.filter(
    (projet) => projet.category.name == "Hotels & restaurants"
  );
  document.querySelector(".gallery").innerHTML = "";
  genererProjet(hrProjet);
});

//affichage barre d'éditon lors de la connexion
function affichageEditBar() {
  //Selection editBar
  const editBar = document.querySelector(".bandeau-edition");
  editBar.classList.remove("d-none");
  editBar.removeAttribute("aria-hidden");
  genererProjetModale(projet);
  iconeOpenModale.addEventListener("click", openModale);
  //gestion du click sur le mode edition pour ouvrir la modale
}

function openModale() {
  modal.classList.remove("d-none");
  modal.setAttribute("id", "modal");
  body.classList.add("change-body");
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", true);
  iconeCloseModale.addEventListener("click", () => {
    closeModale();
  });
}

function closeModale() {
  modal.classList.add("d-none");
  body.classList.remove("change-body");
  modal.setAttribute("aria-hidden", true);
  modal.removeAttribute("aria-modal");
}

//ajout formulaire ajoutPhoto

function affichageFormulaireAjoutPhoto() {
  flècheRetourModale.classList.remove("d-none");
  galerieModale.setAttribute("id", "choix-projet-modale-hidden");
  formAjoutPhoto.classList.remove("d-none");
  formAjoutPhoto.classList.add("d-flex");
}
redirectionButtonAjoutPhoto.addEventListener(
  "click",
  affichageFormulaireAjoutPhoto()
);

//inialisation bouton de retour vers galerie Modal

function retourGalerieModal() {
  galerieModale.removeAttribute("id", "choix-projet-modale-hidden");
  flècheRetourModale.classList.add("d-none");
  formAjoutPhoto.classList.add("d-none");
  formAjoutPhoto.classList.remove("d-flex");
}

flècheRetourModale.addEventListener("click", retourGalerieModal);

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
        imagePreviewContainer.removeChild(fausseImage);
      });
      image.src = imageUrl;
      image.style.width = "76px";
      image.style.height = "auto";
      image.setAttribute("id", "no-opacity");
    });

    reader.readAsDataURL(file);
  }
}
const formulaire = document.querySelector("#submit");

fileInput.addEventListener("change", previewImage);
formulaire.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(formulaire);
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
  });
  console.log(reponse);
  console.log(formData.value);
  // console.log(responseAjoutPhoto);
});
//   if (responseAjoutProjet.status == 201) {
//     galerieModale.innerHTML = "";
//     genererProjetModale(projet);
//     sectionGalerie.innerHTML = "";
//     genererProjet(projet);
//   } else if (responseAjoutProjet.status == 401) {
//     const emplacementMessageErreur = document.querySelector(
//       ".message-erreur-ajout"
//     );
//     emplacementMessageErreur.classList.add("m-error");
//     const message401 = document.createElement("em");
//     message401.classList.add("pw-null");
//     message401.innerText = "formulaire rempli non-correctement";
//     emplacementMessageErreur.appendChild(message401);
//   }
// });
if (token) {
  affichageEditBar();

  //remplacement du lien login par le lien logout
  const emplacementLogout = document.querySelector(".logout");
  emplacementLogout.parentElement.setAttribute("href", "index.html");
  emplacementLogout.innerHTML = "";
  const logout = document.createElement("li");
  logout.innerText = "logout";
  //au clic sur le bouton, le token est remis à 0 et l'utililisateur est déconnecté
  emplacementLogout.appendChild(logout);
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    token = null;
    userId = null;
  });
}

//Exemple :

// function filtreParAge (donnees, ageMinimum) {
// return donnees.filter()
// }
// filtrepararge();
// function filtrepararge() {
//   let donnees = [
//     { nom: "Alice", age: 25, ville: "Paris" },
//     { nom: "Bob", age: 30, ville: "Lyon" },
//     { nom: "Clara", age: 28, ville: "Marseille" },
//   ];
//   let resultat = donnees.filter((personne) => personne.age > 26);
//   console.log(resultat);
// }
