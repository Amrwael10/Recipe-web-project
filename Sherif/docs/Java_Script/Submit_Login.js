function loginUser() {
    const email = document.querySelector('.input1').value.trim();
    const password = document.querySelector('input[type="password"]').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const matchedUser = users.find(user => user.email === email && user.password === password);

    if (!email || !password) {
        alert("Please fill in both fields.");
        return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }

    if (matchedUser) {
        alert(`Welcome back, ${matchedUser.username}!`);
        localStorage.setItem('signed_username', matchedUser.username);
        localStorage.setItem('signed_email', matchedUser.email);
        if (matchedUser.role === 'admin') {
            window.location.href = 'Profile_Page_Admin.html';
        } else {
            window.location.href = 'profile_page_user.html';
        }
    }
    else {
        const isRegistered = users.find(user => user.email === email);
        if (isRegistered) {
            alert("Incorrect password. Please try again.");
        } else {
            if (confirm("No account found with this email. Do you want to sign up?")) {
                window.location.href = 'signup.html'; 
            }
        }
    }
}

