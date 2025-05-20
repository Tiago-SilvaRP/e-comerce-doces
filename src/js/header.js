const btnHamburguer = document.getElementById("btn-hamburguer");
const navMenu = document.querySelector(".nav");

btnHamburguer.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    btnHamburguer.classList.toggle("show");

    const expanded = btnHamburguer.getAttribute("aria-expanded") === "true";
    btnHamburguer.setAttribute("aria-expanded", !expanded);
})