document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('resetPasswordForm');
    const feedbackMessage = document.getElementById('feedbackMessage');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        if (!password || !confirmPassword) {
            feedbackMessage.textContent = 'Please fill in both password fields.';
            return;
        }

        if (password !== confirmPassword) {
            feedbackMessage.textContent = 'Passwords do not match. Please try again.';
            return;
        }

        try {
            const token = window.location.pathname.split('/').pop();
            const url = `/forgotpassword/${token}`;
            console.log('Reset URL:', url); // Debugging line

            const response = await axios.post(url, { password });

            if (response.status === 200) {
                feedbackMessage.textContent = 'Password reset successful.';
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                throw new Error('Password reset failed.');
            }
        } catch (err) {
            console.error(err);
            feedbackMessage.textContent = 'Password reset failed. Please try again later.';
        }
    });
});
