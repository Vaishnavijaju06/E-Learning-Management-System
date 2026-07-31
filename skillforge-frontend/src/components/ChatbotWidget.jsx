import { useEffect, useRef, useState } from "react";

import { chatbotApi } from "../api/skillforgeApi";

const welcome = {
  sender: "bot",
  text: "Hello! I am the SkillForge Tutor. Ask me a learning question.",
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  function newChat() {
    setMessages([welcome]);
    setConversationId(null);
    setInput("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setMessages((current) => [...current, { sender: "user", text: message }]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatbotApi.send({
        message,
        conversationId,
      });

      setMessages((current) => [
        ...current,
        {
          sender: "bot",
          text: response.data.answer,
        },
      ]);

      setConversationId(response.data.conversationId);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          sender: "error",
          text:
            error.response?.data?.message ||
            "The tutor is unavailable. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary chat-launcher shadow"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open SkillForge Tutor"
      >
        <i className="bi bi-chat-dots-fill"></i>
      </button>

      {open && (
        <section className="card border-0 shadow-lg chat-window">
          <header className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <div>
              <strong>SkillForge Tutor</strong>
              <div className="small opacity-75">Learning assistant</div>
            </div>

            <div className="d-flex gap-1">
              <button
                type="button"
                className="btn btn-light btn-sm"
                onClick={newChat}
              >
                New
              </button>
              <button
                type="button"
                className="btn btn-light btn-sm"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </header>

          <div className="card-body chat-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`chat-message ${message.sender}`}
              >
                {message.text}
              </div>
            ))}

            {loading && <div className="chat-message bot">Thinking...</div>}

            <div ref={bottomRef}></div>
          </div>

          <form className="card-footer bg-white" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                className="form-control"
                value={input}
                maxLength={2000}
                placeholder="Ask a question..."
                disabled={loading}
                onChange={(event) => setInput(event.target.value)}
              />
              <button
                className="btn btn-primary"
                disabled={loading || !input.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
}
