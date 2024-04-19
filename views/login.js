const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const login = {
    email: e.target.email.value,
    password: e.target.password.value,
  };

  try {
    const response = await axios.post(
      "http://localhost:3000/user/login",
      login
    );

    // If login is successful, redirect to index file
    if (response.data.message) {
      alert(response.data.message);
    } else {
      window.location.href = "index.html";
    }
  } catch (error) {
    // If an error occurs, display the appropriate error message
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        alert("User not found");
      } else if (status === 401) {
        alert("User not authorized");
      } else {
        alert("An unexpected error occurred");
      }
    } else {
      alert("An unexpected error occurred");
    }
  }
});

const signup = document.getElementById("signup");
signup.addEventListener("click", () => {
  window.location.href = "signup.html";
});
