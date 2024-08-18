const form = document.getElementById("role-switch-form");
const roleSelect = document.getElementById("role");
const uploadButton = document.getElementById("document-upload-button");

const rolesRequiringDocuments = ["premium"];

roleSelect.addEventListener("change", (e) => {
  const selectedRole = e.target.value;
  if (rolesRequiringDocuments.includes(selectedRole)) {
    uploadButton.style.display = "block";
  } else {
    uploadButton.style.display = "none";
  }
});

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
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR5-aktgHItDjLDmdPdsxCkN3jQCxA_YEMxg&s",
      });
      if (rolesRequiringDocuments.includes(newRole)) {
        uploadButton.style.display = "block";
      } else {
        uploadButton.style.display = "none";
      }
    } else {
      const errorResponse = await response.json();
      Swal.fire({
        title: "Error updating role",
        text:
          errorResponse.error || "An error occurred while updating the role.",
        icon: "error",
      });
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Error updating role",
      text: "An error occurred while updating the role. Please try again.",
      icon: "error",
    });
  }
});

uploadButton.addEventListener("click", () => {
  const userId = document.getElementById("role").dataset.userId;
  window.location.href = `/api/users/${userId}/documents`;
});