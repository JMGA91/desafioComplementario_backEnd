document
  .getElementById("recoverForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;

    try {
      const response = await fetch("/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      alert(result.success || result.error);
    } catch (error) {
      console.error("Error:", error);
    }
  });