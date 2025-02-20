document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementsByClassName('login-form')[0];
    const fileInput = document.getElementById('profile_picture');
    const preview = document.getElementById('preview');

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('email').value;
        const psw = document.getElementById('psw').value;
        const profile_picture = fileInput.files[0];

        const formData = new FormData();
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
        formData.append('email', email);
        formData.append('psw', psw);
        if (profile_picture) {
            formData.append('profile_picture', profile_picture);
        }

        try {
            const response = await fetch('https://nodejs314.dszcbaross.edu.hu/api/register', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (!response.ok) {
                return alert(`Hiba történt! HTTP státusz: ${response.status}`);
            }

            if (result.errors) {
                alert('Hiba történt a regisztráció során.');
            } else {
                alert('Sikeres regisztráció!');
                form.reset();
                preview.style.display = 'none';
                window.location.href = 'index.html';
            }
        } catch (error) {
            alert('Hálózati hiba történt! Próbáld újra.');
        }
    });
});
