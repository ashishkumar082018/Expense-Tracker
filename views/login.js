const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const login = {
    email: e.target.email.value,
    password: e.target.password.value,
  };
  axios
    .post("http://localhost:3000/user/login", login)
    .then((result) => {
      alert("Successfully Logged In");
      window.location.href = "index.html";
    })
    .catch((err) => alert(err));
});

const signup = document.getElementById("signup");
signup.addEventListener("click", () => {
  window.location.href = "signup.html";
});
