'use client';

import { useChat } from 'ai/react';
import { useState, useEffect, useRef } from 'react';

export default function DeliOracle() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const [showAffiliate, setShowAffiliate] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Detect Shakedown Codes in the latest assistant message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      const match = lastMessage.content.match(/CAT-[A-Z]+-\d+/);
      if (match) {
        setShowAffiliate(match[0]);
        // Auto-hide after 10 seconds
        const timer = setTimeout(() => setShowAffiliate(null), 10000);
        return () => clearTimeout(timer);
      }
    }
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Play doorbell sound (simulated for now)
    console.log("Ding dong! Customer in the shop.");
    handleSubmit(e);
  };

  return (
    <main>
      {/* Background Cat Image Placeholder */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.1,
        fontSize: '20vw',
        zIndex: -1,
        userSelect: 'none'
      }}>
        🐈
      </div>

      <div className="chat-container" ref={scrollRef}>
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            {m.content}
          </div>
        ))}
        {isLoading && (
          <div className="message assistant" style={{ fontStyle: 'italic', opacity: 0.7 }}>
            Bernie is judging your order...
          </div>
        )}
      </div>

      {showAffiliate && (
        <div className="affiliate-popup">
          🚨 SHAKEDOWN ALERT: {showAffiliate} 🚨
          <br />
          TELL 'EM BERNIE SENT YA!
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="input-area">
        <input
          value={input}
          placeholder="Ask Bernie for advice..."
          onChange={handleInputChange}
          autoFocus
        />
        <button type="submit" disabled={isLoading}>
          TALK
        </button>
      </form>
    </main>
  );
}
