document.addEventListener("DOMContentLoaded", () => {
  // Add to Cart Button functionality
  document.querySelectorAll(".add-to-cart-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.target.dataset.productId;
      const cartId = event.target.dataset.cartId;
      const quantity = 1; // Adjust quantity as needed

      if (!cartId) {
        console.error("Cart ID is missing");
        return;
      }

      fetch(`/api/cart/${cartId}/products/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(() => {
          Swal.fire({
            title: "Success!",
            text: "Product has been added to your cart.",
            imageUrl:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR5-aktgHItDjLDmdPdsxCkN3jQCxA_YEMxg&s",
            confirmButtonText: "Ok",
          });

          // Update the quantity display
          const itemCountSpan = document.querySelector(
            `.item-count[data-product-id="${productId}"]`
          );
          itemCountSpan.textContent =
            parseInt(itemCountSpan.textContent) + quantity;
        })
        .catch((error) => {
          Swal.fire({
            title: "Error!",
            text: "An error occurred while adding the product to your cart.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        });
    });
  });

  // Delete Button functionality
  document.querySelectorAll(".delete-product-button").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.productId;
      const cartId = event.target.dataset.cartId;

      if (!cartId) {
        console.error("Cart ID is missing");
        return;
      }

      try {
        const response = await fetch(
          `/api/cart/${cartId}/products/${productId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Success: Update UI
          Swal.fire({
            title: "Deleted!",
            text: "Product has been removed from your cart.",
            imageUrl:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR5-aktgHItDjLDmdPdsxCkN3jQCxA_YEMxg&s",
            confirmButtonText: "Ok",
          });

          // Update quantity display to 0 or remove the product card
          const itemCountSpan = document.querySelector(
            `.item-count[data-product-id="${productId}"]`
          );
          itemCountSpan.textContent = 0; // or remove the element if needed
        } else {
          // Error response from backend
          throw new Error("Failed to delete the product from the cart");
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "An error occurred while deleting the product from your cart.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    });
  });
});