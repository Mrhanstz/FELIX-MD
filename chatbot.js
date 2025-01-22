const axios = require("axios");

// Hugging Face API URL for a conversational model
const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

// Function to fetch a chatbot reply
const getChatbotReply = async (messageText) => {
  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: messageText },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data && response.data.generated_text) {
      return response.data.generated_text;
    } else {
      return "Sorry, I didn't understand that. Can you try rephrasing?";
    }
  } catch (error) {
    console.error("Error fetching reply from Hugging Face API:", error.message);
    return "Sorry, the chatbot service is currently unavailable.";
  }
};

// Initialize chatbot and listen for incoming messages
const startChatbot = (zk, conf) => {
  if (conf.CHAT_BOT === "yes") {
    console.log("CHAT_BOT is enabled. Listening for messages...");

    zk.ev.on("messages.upsert", async (event) => {
      try {
        const { messages } = event;

        for (const message of messages) {
          if (!message.key || !message.key.remoteJid || message.key.fromMe) continue;

          const messageText =
            message.message?.conversation || message.message?.extendedTextMessage?.text || "";

          if (messageText) {
            try {
              const replyMessage = await getChatbotReply(messageText);

              if (replyMessage) {
                // Send the reply with the quoted original message
                await zk.sendMessage(message.key.remoteJid, {
                  text: replyMessage,
                  quoted: message, // Quote the original message
                });
                console.log(`Reply sent: ${replyMessage}`);
              } else {
                console.log("No reply generated for the input.");
              }
            } catch (error) {
              console.error(`Error processing message: ${error.message}`);
            }
          }
        }
      } catch (error) {
        console.error("Error in message processing:", error.message);
      }
    });
  }
};

// Export the functions
module.exports = { getChatbotReply, startChatbot };
