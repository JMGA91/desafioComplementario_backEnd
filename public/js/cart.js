// cart.js

// Establish socket connection
const socket = io();

// Function to fetch cart data from the server and render it
const renderCart = async () => {
  try {
    const response = await fetch("/api/carts/:cid"); // Adjust the endpoint if necessary
    if (!response.ok) {
      throw new Error("Failed to fetch cart data");
    }
    const cart = await response.json();

    // Render the cart HTML using the received data
    // Code to dynamically update the cart HTML
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
};

// Function to handle adding items to the cart
const addToCart = async (productId, quantity) => {
  try {
    const response = await fetch(`/api/carts/:cid/products/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      throw new Error("Failed to add item to cart");
    }
    // Refresh the cart after adding item
    renderCart();
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};

// Function to initialize cart functionality
const initCart = () => {
  // Call renderCart() to render cart data initially
  renderCart();

  // Add event listener to handle adding items to cart
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const quantity = 1; // You can adjust this based on user input if needed
      addToCart(productId, quantity);
    });
  });

  // Socket.io event listeners for real-time updates
  socket.on("cart_updated", () => {
    renderCart();
  });
};

// Call initCart() when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initCart);
