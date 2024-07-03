const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = document.querySelector('input[name="token"]').value;
  const newPassword = document.querySelector('input[name="newPassword"]').value;

  try {
    const response = await fetch("/changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const result = await response.json();

    if (result.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.error,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: result.success,
      }).then(() => {
        window.location.href = "/login";
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An unexpected error occurred",
    });
  }
});