document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementsByClassName('login-form')[0];

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Az alapértelmezett űrlapküldést meggátoljuk

        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('email').value;
        const psw = document.getElementById('psw').value;

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstname, lastname, email, psw })
            });

            // Konzolba kiírás
            console.log('Server response:', response);
            const result = await response.json();
            console.log('Server response JSON:', result);

            // Ellenőrizd a válasz státuszát
            if (!response.ok) {
                console.log('Error in the answer:', response.status);
                return alert(`An error occurred! HTTP status: ${response.status}`);
            }

            // Ha van hibaüzenet
            if (result.errors) {
                console.error('Server error messages:', result.errors);
                alert('An error occurred during registration.');
            } else {
                console.log('Successful registration:', result);
                alert('Successful registration:');
                form.reset();
                window.location.href = 'index.html'; // Átirányítás siker után
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('A network error has occurred! Please try again.');
        }
    });
});
