const formulaireDeConnection = document.querySelector(".form-connexion");
const emplacementMessage = document.querySelector(".m-error");
const message = document.createElement("em");

formulaireDeConnection.addEventListener("submit", async (event) => {
  event.preventDefault();

  let user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  });
  let result = await response.json();
  const userId = result.userId;
  const token = result.token;
  message.innerHTML = "";
  if (response.status == 200) {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    document.location.href = "index.html";
  } else if (response.status == 401) {
    const message401 = "Votre mot de passe est mauvais";
    message.innerText = message401;
    emplacementMessage.appendChild(message).classList.add("pw-null");
  } else if (response.status == 404) {
    const messsage404 = "Identifiant introuvable";
    message.innerText = messsage404;
    emplacementMessage.appendChild(message).classList.add("pw-null");
  }
});
