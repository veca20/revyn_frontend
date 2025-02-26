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
    let defaultPage = "index";
    
    function loadPage(page) {
        let pageToLoad = page ? page : defaultPage;
        let filePath = `/revyn_frontend/${pageToLoad}.html`;

        // Ha az aktuális oldal már betöltődött, ne töltsük be újra!
        let currentContent = document.getElementById("content").getAttribute("data-loaded-page");
        if (currentContent === pageToLoad) {
            console.log(`Az oldal már betöltődött: ${pageToLoad}`);
            return;
        }

        console.log(`Betöltés: ${filePath}`);

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Hiba: ${response.status} - Az oldal nem található: ${filePath}`);
                }
                return response.text();
            })
            .then(html => {
                let contentDiv = document.getElementById("content");
                contentDiv.innerHTML = html;
                contentDiv.setAttribute("data-loaded-page", pageToLoad); // Frissítjük az aktuális oldalt
            })
            .catch(error => console.error("Hiba történt:", error));
    }

    // Navigációs linkek kezelése
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            let page = this.getAttribute("data-page");
            loadPage(page);
        });
    });

    // **Csak akkor töltsük be az alapértelmezett oldalt, ha még nincs betöltve**
    if (!document.getElementById("content").hasAttribute("data-loaded-page")) {
        loadPage();
    }
});
