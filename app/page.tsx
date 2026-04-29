'use client';

import { useChat } from 'ai/react';
import { useState, useEffect, useRef } from 'react';

export default function DeliOracle() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const [shakedown, setShakedown] = useState<{ partner: string; code: string; offer: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom with smooth behavior for projector
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  // Detect Tool Invocations for the Shakedown Badge
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.toolInvocations) {
      const shakedownTool = lastMessage.toolInvocations.find(
        (t) => t.toolName === 'triggerShakedown' && t.state === 'result'
      );
      
      if (shakedownTool && 'args' in shakedownTool) {
        const { partnerName, shakedownCode, offer } = shakedownTool.args as any;
        setShakedown({ partner: partnerName, code: shakedownCode, offer });
        
        // Keep the badge visible for 15 seconds for the audience
        const timer = setTimeout(() => setShakedown(null), 15000);
        return () => clearTimeout(timer);
      }
    }
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Dev 4: Trigger doorbell chime here!
    handleSubmit(e);
  };

  return (
    <main>
      {/* Background Aesthetic: Neon Cat */}
      <div className="neon-bg-cat">🐈</div>

      <div className="chat-container" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="message assistant">
            Yo. I'm Bernie. I've been in this bodega since the towers fell. What's your deal?
          </div>
        )}
        
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            {m.content}
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant typing-indicator">
            Bernie is judging you...
          </div>
        )}
      </div>

      {shakedown && (
        <div className="affiliate-popup">
          <div className="badge-header">🚨 SHAKEDOWN ALERT 🚨</div>
          <div className="badge-body">
            <span className="partner">{shakedown.partner}</span>
            <span className="offer">{shakedown.offer}</span>
            <span className="code">CODE: {shakedown.code}</span>
          </div>
          <div className="badge-footer">TELL 'EM BERNIE SENT YA!</div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="input-area">
        <input
          value={input}
          placeholder="Ask Bernie for the neighborhood tea..."
          onChange={handleInputChange}
          autoFocus
        />
        <button type="submit" disabled={isLoading}>
          SEND
        </button>
      </form>
    </main>
  );
}
