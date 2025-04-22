function signUpUser() {
    const inputFields = document.querySelectorAll(".input1");
    const password = document.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = document.querySelectorAll('input[type="password"]')[1].value;
    const roleSelect = document.getElementById("role");
    const username = inputFields[0].value.trim();
    const email = inputFields[1].value.trim();
    const role = roleSelect.value;

    if (!username || !email || !password || !confirmPassword || !role) {
        alert("Please fill out all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    const user = { username, email, password, role };
    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.email === email)) {
        alert("Email already registered!");
        return;
    }

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    alert(`Welcome, ${username}! You have signed up as ${role}.`);
    localStorage.setItem('signed_username', user.username);
    localStorage.setItem('signed_email', user.email);

    // Redirect based on role
    if (role === 'admin') {
        window.location.href = 'Profile_Page_Admin.html';
    } else if (role === 'user') {
        window.location.href = 'profile_page_user.html';
    } else {
        alert('Please, enter all your credentials right and select a role.');
        return;
    }
}













/*
function submitForm() {
    const role = document.getElementById('role').value;
    if (role === 'user') {
        window.location.href = 'profile_page_user.html';
    } else if (role === 'admin') {
        window.location.href = 'Profile_Page_Admin.html';
    } else {
        alert('Please select a role.');
        return;
    }
    alert('The form has been submitted successfully.');
}
*/