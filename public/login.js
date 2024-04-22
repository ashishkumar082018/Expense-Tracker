const form = document.querySelector(".form");
const forgetForm = document.querySelector(".forget-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const login = {
    email: e.target.email.value,
    password: e.target.password.value,
  };

  axios
    .post("http://localhost:3000/user/login", login) 
    .then((result) => {
      alert(result.data.message);
      localStorage.setItem("token", result.data.token);
      // console.log(result.data.token);
      window.location.href = "../public/index.html";
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

forgetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  try {
    const result = await axios.post("http://localhost:3000/password/forgotpassword", { email: email });
    console.log(result.data);
    alert(result.data);
  } catch (err) {
    console.error(err);
    alert("An error occurred while sending the email. Please try again later.");
  }
});

const signup = document.getElementById("signup");
signup.addEventListener("click", () => {
  window.location.href = "signup.html";
});
