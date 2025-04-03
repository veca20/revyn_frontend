document.addEventListener('DOMContentLoaded', function () {
    
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    // Hamburger menü működtetése
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('show');
        });
    } else {
        console.error('Hamburger vagy navMenu nem található.');
    }

    // Bejelentkezési gomb működtetése
    const btnLogin = document.getElementById('btnLogin');
   

    if (btnLogin) {
        btnLogin.addEventListener('click', login);
    } else {
        console.error('HIBA: Nem található btnLogin az oldalon!');
    }
});

// Bejelentkezési funkció
async function login(event) {
    event.preventDefault(); // Megakadályozza az űrlap elküldését

    // Ellenőrizzük, hogy az elemek léteznek-e
    const emailInput = document.querySelector('.email');
    const pswInput = document.querySelector('.password');
    console.log(emailInput, pswInput);
    

    if (!emailInput || !pswInput) {
        console.error('ERROR: Email or password field not found in HTML!');
        alert('An error has occurred! Refresh the page and try again.');
        return;
    }

    // Az értékek lekérése
    const email = emailInput.value;
    const psw = pswInput.value;
    console.log(email, psw);

    if (!email || !psw) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, psw }),
            credentials: 'include', // Cookie-k továbbítása
        });

        console.log(res); // A válasz státusza
       

        const data = await res.json();
       console.log(data);
       
        // Ha a válasz nem sikeres
        if (!res.ok) {
            const errorText = await res.text();
            console.error('An error occurred:', errorText);
            alert('Login failed. Please check your details.');
            return;
        }

        console.log('Login successful:', data);
        if (data && data.message) {
            alert(data.message);
            console.log('Cookies after successful login:', document.cookie);

            // Ha admin, irányítsuk az admin felületre
            if (data.is_admin == 1) {
                window.location.href = '../addproduct.html';  // Admin felület
            } else {
                window.location.href = '../index.html';  // Normál felhasználó felület
            }
        } else {
            alert('An unknown error occurred.');
        }
    } catch (error) {
        console.error('Error while logging in:', error);
        alert('Failed to connect to the server. Please try again later.');
    }
}
