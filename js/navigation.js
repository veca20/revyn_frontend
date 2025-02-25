document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".nav-link");
    const contentContainer = document.getElementById("content");
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    // 📌 Hamburger menü működése
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('show');
        });
    } else {
        console.error('Hamburger vagy navMenu elem nem található');
    }

    if (!contentContainer) {
        console.error("Nincs content tároló a DOM-ban.");
        return;
    }

    // 📌 Dinamikus oldalbetöltés az összes linkhez
    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = this.getAttribute("data-page"); // Melyik oldal?
            loadPage(page);
        });
    });

    function loadPage(page) {
        history.pushState({ page }, "", `${page}.html`); // 📌 Frissíti az URL-t

        fetch(`html/${page}.html`) // 📌 HTML fájl betöltése
            .then(response => {
                if (!response.ok) {
                    throw new Error("Oldal nem található!");
                }
                return response.text();
            })
            .then(html => {
                contentContainer.innerHTML = html;
                removeOldScripts();

                // 📌 Ha van hozzá JS fájl, betöltjük
                let scriptPath = `js/${page}.js`;
                loadScript(scriptPath);
            })
            .catch(error => {
                contentContainer.innerHTML = "<p>Hiba történt az oldal betöltésekor.</p>";
                console.error("Betöltési hiba:", error);
            });
    }

    function loadScript(scriptPath) {
        fetch(scriptPath, { method: "HEAD" }) // 📌 Ellenőrizzük, hogy létezik-e a JS fájl
            .then(response => {
                if (response.ok) {
                    let script = document.createElement("script");
                    script.src = scriptPath;
                    script.classList.add("dynamic-script");
                    document.body.appendChild(script);
                }
            })
            .catch(error => {
                console.warn(`A(z) ${scriptPath} nem található, így nem töltjük be.`);
            });
    }

    function removeOldScripts() {
        document.querySelectorAll(".dynamic-script").forEach(script => {
            script.remove();
        });
    }

    // 📌 Ha az oldal újratöltődik, betöltjük az URL szerinti oldalt
    window.addEventListener("popstate", function (event) {
        if (event.state && event.state.page) {
            loadPage(event.state.page);
        }
    });

    // 📌 Alapértelmezett oldal betöltése (pl. home)
    loadPage("home");
});
