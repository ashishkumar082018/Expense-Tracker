const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const signup = {
    name: e.target.name.value,
    email: e.target.email.value,
    password: e.target.password.value,
  };

  axios
    .post("http://localhost:3000/user/signup", signup)
    .then((result) => {
      window.location.href = "../public/login.html";
    })
    .catch((error) => {
      if (error.response) {
        const errorMessage = error.response.data.message;
        alert(errorMessage);
      } else {
        alert("An error occurred. Please try again later.");
      }
    });
})

