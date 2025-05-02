const socket = io();

function sendMessage(){
    const message = document.getElementById("messageInput").value
    socket.emit("message",message )

}
function appendMessage(socketId, message){
    const messageList = document.getElementById("messagesList")
    const newMessage = document.createElement("p")
    newMessage.textContent = `${socketId}: ${message}`
    messageList.appendChild(newMessage)
}
socket.on("messageList", (messages) => {
    const messageList = document.getElementById("messagesList")
    messageList.innerHTML = "" //limpia el mensaje anterior
    messages.forEach((message) => {
        appendMessage(
            message.socketId,
            message.message)
    })
})
socket.on("message", (data) => {
    appendMessage(
        data.socketId,
        data.messages
    )
})
