document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('resetPasswordForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        if (!password || !confirmPassword) {
            alert('Please fill in both password fields.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }
        try {
            // Update the URL to point to the correct endpoint
            const url = '/password/forgotpassword/' + window.location.pathname.split('/').pop();
            const response = await axios.post(url, { password });
            if (response.status === 200) {
                alert('Password reset successful.');
                window.location.reload();
            } else {
                throw new Error('Password reset failed.');
            }
        } catch (err) {
            console.error(err);
            alert('Password reset failed. Please try again later.');
        }
    });
});
