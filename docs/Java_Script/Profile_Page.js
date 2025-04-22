const username = localStorage.getItem('signed_username');
        const email = localStorage.getItem('signed_email');

        // Select the h2 and p inside the .details div
        const profileName = document.querySelector('.details h2');
        const profileEmail = document.querySelector('.details p');

        // Set the content
        if (username && email) {
            profileName.textContent = username;
            profileEmail.textContent = email;
        }