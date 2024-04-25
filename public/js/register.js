const socket = io();

function $(selector) {
  return document.querySelector(selector);
}

// Socket event listeners
socket.on("statusError", (data) => {
  console.log(data);
  alert(data);
});

// Function to handle registration form submission
function registerUser(event) {
  event.preventDefault();
  const newUser = {
    firstName: $("#firstName").value,
    lastName: $("#lastName").value,
    email: $("#email").value,
    age: $("#age").value,
    password: $("#password").value,
  };

  // Clean the form fields
  cleanForm();

  // Emit a socket event to register the user
  socket.emit("registerUser", newUser);
}

// Function to clean the form fields after submission
function cleanForm() {
  $("#firstName").value = "";
  $("#lastName").value = "";
  $("#email").value = "";
  $("#age").value = "";
  $("#password").value = "";
}

// Add event listener to the registration form submit button
$("#register-form").addEventListener("submit", registerUser);
