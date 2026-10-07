const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join room (user-specific)
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
    });

    // Send message
    socket.on("sendMessage", async (data) => {
      const { userId, sender, text } = data;

      // Save to DB
      const newMessage = new Message({ userId, sender, text });
      await newMessage.save();

      // Emit to same room
      io.to(userId).emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};