
document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");
    const sendButton = document.getElementById("sendButton");
    // Auto resize the text area
    userInput.addEventListener("input", () => {
        userInput.style.height = "auto";
        userInput.style.height = userInput.scrollHeight + "px";
    });
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;
        //todo: Add user message to chat
        addMessage(message, true);  
        // Clear input
        userInput.value = "";
        userInput.style.height = "auto";
        sendButton.disabled = true;
        //todo: Show Typing indicator
        const typingIndicator = showTypingIndicator();
        try {
            // todo: Generate request function
            const response = await generateRequest(message);
            typingIndicator.remove();
            // Add AI response to chat
            addMessage(response, false);
        } catch (error){
            typingIndicator.remove();
            addErrorMessage(error.message);
        } finally {
            sendButton.disabled = false;
        }
    });

    // Add user message to chat
    function addMessage (text, isUser){
        const message = document.createElement("div");
        message.className = `message ${isUser ? "user-message" : "bot-message"}`;
        message.innerHTML = `
        <div class= "avatar ${isUser ? "user-avatar" : "bot-avatar"}">
        ${isUser ? "U" : "AI"}
        </div>
        <div class="message-content">
        ${text}
        </div>
        `;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    // Show typing indicator
    function showTypingIndicator(){
        const indicator = document.createElement("div");
        indicator.className = "message bot-message typing-indicator";
        indicator.innerHTML = `
        <div class="avatar">AI</div>
        <div class="typing-indicator">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        </div>
        `
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return indicator;
    }

    // Error Message Function
    function addErrorMessage(error){
        const message = document.createElement("div");
        message.className = "message bot-message";
        message.innerHTML = `
        <div class="avatar bot-avatar">AI</div>
        <div class="message-content" style="color: red;">
        Error: ${error}
        </div>
        `;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

// Generate Request function
async function generateRequest(prompt){
  const response = await fetch (`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyB7E546ouM5KW2InVnnYMlTayQ2QDjch_w`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt,
                }],
            }],
        }),
    });
    if (!response.ok){
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
};
