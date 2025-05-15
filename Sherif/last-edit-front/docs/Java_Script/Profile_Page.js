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

document.addEventListener('DOMContentLoaded', function () {
    const logoutLink = document.querySelector('a[href="login.html"]');

    if (logoutLink) {
        logoutLink.addEventListener('click', function (event) {
            // Clear the signed in values
            localStorage.removeItem('signed_username');
            localStorage.removeItem('signed_email');
        });
    }
});

