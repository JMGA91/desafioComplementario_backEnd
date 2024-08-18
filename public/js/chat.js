const socket = io();
let user;
let chatBox = document.querySelector("#chatBox");
let messagesLogs = document.querySelector("#messagesLogs");
let submitBtn = document.querySelector("#submitBtn");

// Function to handle the user identification
function identifyUser() {
  user = document.querySelector("#usernameInput").value.trim();
  if (!user) {
    alert("You need to identify to continue!");
    return;
  }
  console.log(`Your username is ${user}`);
  socket.emit("userConnect", user);
}

// Function to handle message submission
function sendMessage(message) {
  console.log(`Message: ${message}`);
  socket.emit("message", { user, message });
}

// Event listener for submit button click
submitBtn.addEventListener("click", () => {
  identifyUser();
  let message = chatBox.value.trim();
  if (message.length > 0) {
    sendMessage(message);
    chatBox.value = "";
    Swal.fire({
      title: "Message Sent!",
      text: "Your message has been delivered!.",
      icon: "success",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 1500,
    });
  }
});

// Send message when Enter key is pressed
chatBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    let message = chatBox.value.trim();
    if (message.length > 0) {
      sendMessage(message);
      chatBox.value = "";
    }
  }
});

// Notify when a new user joins
socket.on("newUser", (data) => {
  Swal.fire({
    text: `${data} has joined the chat`,
    toast: true,
    position: "top-right",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR5-aktgHItDjLDmdPdsxCkN3jQCxA_YEMxg&s",
  });
});
