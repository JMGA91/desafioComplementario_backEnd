document.addEventListener("DOMContentLoaded", () => {
  const removeButtons = document.querySelectorAll(".remove-item");
  const clearCartButton = document.querySelector(".clear-cart-btn");
  const checkoutButton = document.querySelector(".checkout-btn");

  removeButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = button.dataset.productId;
      const cartId = button.dataset.cartId;

      if (!productId || !cartId) {
        console.error("Product ID or Cart ID is missing");
        Swal.fire({
          title: "Error!",
          text: "Product ID or Cart ID is missing.",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }

      try {
        const response = await fetch(
          `/api/cart/${cartId}/products/${productId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        Swal.fire({
          title: "Success!",
          text: "Product has been removed from the cart.",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR5-aktgHItDjLDmdPdsxCkN3jQCxA_YEMxg&s",
          confirmButtonText: "Ok",
        });

        location.reload();
      } catch (error) {
        console.error("Error removing item:", error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while removing the product from the cart.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    });
  });

  clearCartButton.addEventListener("click", async () => {
    const cartId = clearCartButton.dataset.cartId;

    try {
      await fetch(`/api/cart/${cartId}`, {
        method: "DELETE",
      });
      location.reload();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  });

  checkoutButton.addEventListener("click", async () => {
    const cartId = checkoutButton.dataset.cartId;

    try {
      const response = await fetch(`/api/cart/${cartId}/purchase`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Redirect to the ticket view after successful purchase
      location.href = `/api/cart/${cartId}/purchase`;
    } catch (error) {
      console.error("Error during checkout:", error);
      Swal.fire({
        title: "Checkout Failed!",
        text: "There was an error processing your purchase.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  });
});