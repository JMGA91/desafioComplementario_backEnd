$(document).ready(function () {
  $(".add-to-cart-button").click(function () {
    // Get the product ID and user ID from the data attributes
    const productId = $(this).data("product-id");
    const userId = $(this).data("user-id");

    // Send a POST request to add the product to the cart
    $.ajax({
      type: "POST",
      url: `/cart/${userId}/products/${productId}`,
      success: function (response) {
        // Handle success response
        console.log("Product added to cart successfully:", response);
      },
      error: function (xhr, status, error) {
        // Handle error response
        console.error("Error adding product to cart:", error);
      },
    });
  });
});
