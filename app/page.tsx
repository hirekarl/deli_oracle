'use client';

import { useChat } from 'ai/react';
import { useState, useEffect, useRef } from 'react';

export default function DeliOracle() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const [shakedown, setShakedown] = useState<{ partner: string; code: string; offer: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
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
        
        const timer = setTimeout(() => setShakedown(null), 15000);
        return () => clearTimeout(timer);
      }
    }
  }, [messages]);

  const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');

  return (
    <main className="bodega-shell">
      {/* HEADER / IDLE STATE */}
      <div className="neon-sign">
        Deli<br />Oracle
      </div>

      {/* CONVERSATION AREA */}
      <div className={`chat-display ${isLoading ? 'thinking' : ''}`} ref={scrollRef}>
        {lastUserMessage && (
          <div className="user-text">
            "{lastUserMessage.content}"
          </div>
        )}

        <div className="bubble">
          <div className="bernie-text">
            {isLoading ? "Bernie is judging you..." : (lastAssistantMessage?.content || "Yo. I'm Bernie. I've been in this bodega since the towers fell. What's your deal?")}
          </div>

          {shakedown && (
            <div className="affiliate-badge">
              {shakedown.partner} | {shakedown.offer} | CODE: {shakedown.code}
            </div>
          )}
        </div>
      </div>

      {/* KIOSK INPUT */}
      <form onSubmit={handleSubmit} className="input-zone">
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
