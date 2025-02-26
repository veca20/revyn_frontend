const hamburger = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('nav ul');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
        navMenu.classList.toggle('show');
    });
} else {
    console.error('Hamburger vagy navMenu elem nem található');
}




document.addEventListener("DOMContentLoaded", function () {
    // Az alapértelmezett oldal most már index.html
    let defaultPage = "index";

    // Funkció az oldalak betöltésére
    function loadPage(page) {
        let pageToLoad = page ? page : defaultPage; // Ha nincs oldal megadva, akkor index.html-t tölt be
        let filePath = `/revyn_frontend/${pageToLoad}.html`; // home.html helyett index.html

        console.log(`Betöltés: ${filePath}`); // Debug üzenet a konzolba

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Hiba: ${response.status} - Az oldal nem található: ${filePath}`);
                }
                return response.text();
            })
            .then(html => {
                document.getElementById("content").innerHTML = html; // Frissíti az oldal tartalmát
            })
            .catch(error => console.error("Hiba történt:", error));
    }

    // Figyel a navigációs linkekre
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            let page = this.getAttribute("data-page");
            loadPage(page);
        });
    });

    // Az alapértelmezett oldal betöltése az első indításkor
    loadPage();
});
