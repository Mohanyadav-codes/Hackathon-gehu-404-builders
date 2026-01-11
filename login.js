const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("https://fastapi-for-first-hackathon-su9r.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // 🔐 Store JWT token
    localStorage.setItem("cred_token", data.token);

    // 🚀 Redirect after login
    window.location.href = "/dashboard.html";

  } catch (error) {
    errorMsg.textContent = error.message;
  }
});
