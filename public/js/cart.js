document.addEventListener("DOMContentLoaded", () => {
  // Remove item from cart
  const removeButtons = document.querySelectorAll(".remove-item");
  
  removeButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.dataset.productId;
      const cartId = button.dataset.cartId;

      try {
        const response = await fetch(
          `/api/cart/${cartId}/products/${productId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          alert("Product removed from cart successfully");
          location.reload(); // Refresh the page to update the cart view
        } else {
          const result = await response.json();
          alert(`Error removing product from cart: ${result.message}`);
        }
      } catch (error) {
        console.error("Error removing product from cart:", error);
        alert("There was an error removing the product from the cart");
      }
    });
  });

  // Clear cart
  const clearCartButton = document.querySelector(".clear-cart-btn");
  clearCartButton.addEventListener("click", async () => {
    const cartId = clearCartButton.dataset.cartId;

    try {
      const response = await fetch(`/api/cart/${cartId}/products`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Cart cleared successfully");
        location.reload(); // Refresh the page to update the cart view
      } else {
        const result = await response.json();
        alert(`Error clearing cart: ${result.message}`);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("There was an error clearing the cart");
    }
  });

  // Checkout
  const checkoutButton = document.querySelector(".checkout-btn");
  checkoutButton.addEventListener("click", () => {
    alert("Checkout functionality pending");
    
  });
});
