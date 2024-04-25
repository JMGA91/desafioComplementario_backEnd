const socket = io();

function logoutUser(event) {
  event.preventDefault();
  socket.emit("logoutUser");
}

document.getElementById("logout-form").addEventListener("submit", logoutUser);
