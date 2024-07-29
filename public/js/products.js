const socket = io(); // Initialize socket.io

$(document).ready(function () {
  $(".add-to-cart-button").click(function () {
    const productId = $(this).data("product-id");
    const cartId = $(this).data("cart-id");

    $.ajax({
      type: "POST",
      url: `/api/carts/${cartId}/products/${productId}`,
      contentType: "application/json",
      success: function (response) {
        console.log("Product added to cart successfully:", response);
        // Optionally, you could redirect to the cart page or update the UI
        window.location.href = `/cart?cid=${cartId}`; // Redirect to cart page
      },
      error: function (xhr, status, error) {
        console.error("Error adding product to cart:", error);
      },
    });
  });
});