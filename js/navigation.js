document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".nav-link");
    const contentContainer = document.getElementById("content");

    if (!contentContainer) {
        console.error("Nincs content tároló a DOM-ban.");
        return;
    }

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = this.getAttribute("data-page");

            
            loadPage(page);
        });
    });

    function loadPage(page) {
        fetch(`html/${page}.html`)
            .then(response => response.text())
            .then(html => {
                contentContainer.innerHTML = html;

                // Töröljük az előző oldal scriptjeit
                removeOldScripts();

                // Megnézzük, hogy van-e hozzá tartozó JS fájl, és ha igen, betöltjük
                let scriptPath = `js/${page}.js`;
                loadScript(scriptPath);
            })
            .catch(error => {
                contentContainer.innerHTML = "<p>Hiba történt az oldal betöltésekor.</p>";
                console.error("Betöltési hiba:", error);
            });
    }

    function loadScript(scriptPath) {
        fetch(scriptPath, { method: "HEAD" }) // Ellenőrizzük, hogy létezik-e a fájl
            .then(response => {
                if (response.ok) {
                    let script = document.createElement("script");
                    script.src = scriptPath;
                    script.classList.add("dynamic-script"); // Megjelöljük, hogy törölhető legyen
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
});
