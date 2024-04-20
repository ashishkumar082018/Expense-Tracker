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
      window.location.href = index.html;
    })
    .catch((err) => console.log(err));
});
