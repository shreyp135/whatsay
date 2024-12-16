

function scrollToBottom(timeout: number = 0) {
    const container = document.getElementById("chatbox");
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, timeout);
    }
  }
  
  export default scrollToBottom;
  