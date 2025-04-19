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
    