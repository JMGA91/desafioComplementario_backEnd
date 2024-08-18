console.log("uploader.js loaded");

const form = document.getElementById("uploadForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const userIdElement = document.getElementById("userId");

  if (!userIdElement) {
    console.error("userId element not found");
    Swal.fire({
      title: "Error uploading documents",
      text: "User ID not found",
      icon: "error",
    });
    return;
  }

  const userId = userIdElement.value;
  console.log("User ID:", userId);
  if (!userId) {
    console.error("userId not found");
    Swal.fire({
      title: "Error uploading documents",
      text: "User ID not provided",
      icon: "error",
    });
    return;
  }

  // Log the form data to check if it's correctly populated
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {
    const response = await fetch(`/api/users/${userId}/documents`, {
      method: "POST",
      body: formData,
    });
    console.log("Response status:", response.status);
    if (response.ok) {
      Swal.fire({
        title: "Documents uploaded successfully, now you can update role",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR5-aktgHItDjLDmdPdsxCkN3jQCxA_YEMxg&s",
      });
    } else {
      const errorResponse = await response.text();
      console.error("Error response text:", errorResponse);
      Swal.fire({
        title: "Error uploading documents",
        text: errorResponse || "Please try again",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
    Swal.fire({
      title: "Error uploading documents",
      text: "Please try again",
      icon: "error",
    });
  }
});