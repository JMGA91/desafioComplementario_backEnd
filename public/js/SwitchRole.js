const form = document.getElementById("role-switch-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = document.getElementById("role").dataset.userId;
  const newRole = document.getElementById("role").value;
  try {
    const response = await fetch(`/api/users/premium/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (response.ok) {
      Swal.fire({
        title: "Role updated successfully",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Error updating role",
        text: "Please try again",
        icon: "error",
      });
    }
  } catch (error) {
    console.error(error);
  }
});