$(document).ready(function () {
  $(".add-to-cart-button").click(function () {
    // Get the product ID and cart ID from the data attributes
    const productId = $(this).data("product-id");
    const cartId = $(this).data("cart-id");

    // Send a POST request to add the product to the cart
    $.ajax({
      type: "POST",
      url: `/api/carts/${cartId}/products/${productId}`,
      contentType: "application/json",
      success: function (response) {
        // Handle success response
        console.log("Product added to cart successfully:", response);
        // Optionally update UI to reflect added product
      },
      error: function (xhr, status, error) {
        // Handle error response
        console.error("Error adding product to cart:", error);
        // Optionally show an error message or handle the error
      },
    });
  });
});