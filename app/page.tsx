'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';

export default function DeliOracle() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append } = useChat();
  const [shakedown, setShakedown] = useState<{ partner: string; code: string; offer: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom with smooth behavior for projector
  useEffect(() => {
    console.log('[DEBUG] Messages updated:', messages);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  // Detect tool invocations for the Shakedown Badge
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.parts) return;

    const shakedownPart = lastMessage.parts.find(
      (p) => p.type === 'tool-invocation' && p.toolInvocation.toolName === 'triggerShakedown' && p.toolInvocation.state === 'result'
    ) as any;

    if (shakedownPart && shakedownPart.type === 'tool-invocation' && 'toolInvocation' in shakedownPart) {
      const { toolInvocation } = shakedownPart;
      if (toolInvocation.state === 'result') {
        const { partnerName, shakedownCode, offer } = toolInvocation.args as {
          partnerName: string;
          shakedownCode: string;
          offer: string;
        };
        setShakedown({ partner: partnerName, code: shakedownCode, offer });

        // Keep the badge visible for 15 seconds for the audience
        const timer = setTimeout(() => setShakedown(null), 15000);
        return () => clearTimeout(timer);
      }
    }
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    console.log('[DEBUG] Form submitted with input:', input);
    // Dev 4: Trigger doorbell chime here!
    handleSubmit(e);
  };

  const getMessageText = (m: (typeof messages)[number]) => {
    if (m.content) return m.content;
    
    const text = m.parts
      ? m.parts
          .filter((p) => p.type === 'text')
          .map((p) => p.text)
          .join('')
      : '';
    
    if (!text && m.parts?.some(p => p.type === 'tool-invocation')) {
      return 'Bernie is making a call...';
    }
    return text;
  };

  return (
    <main>
      {/* Background Aesthetic: Neon Cat */}
      <div className="neon-bg-cat">🐈</div>

      <div className="chat-container" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="message assistant">
            Yo. I&apos;m Bernie. I&apos;ve been in this bodega since the towers fell. What&apos;s your deal?
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            {getMessageText(m)}
          </div>
        ))}

        {isLoading && (
          <div className="message assistant typing-indicator">
            Bernie is judging you...
          </div>
        )}

        {error && (
          <div className="message assistant" style={{ color: '#ff4444', background: 'rgba(255,0,0,0.1)', borderLeft: '0.5vw solid #ff4444' }}>
            Bernie: "I&apos;m bricked right now. Try again later, son." ({error.message})
          </div>
        )}
      </div>

      {shakedown && (
        <>
          <div className="affiliate-backdrop" onClick={() => setShakedown(null)} />
          <div className="affiliate-popup">
            <button className="close-btn" onClick={() => setShakedown(null)}>✕</button>
            <div className="badge-header">🚨 SHAKEDOWN ALERT 🚨</div>
            <div className="badge-body">
              <span className="partner">{shakedown.partner}</span>
              <span className="offer">{shakedown.offer}</span>
              <span className="code">CODE: {shakedown.code}</span>
            </div>
            <div className="badge-footer">TELL &apos;EM BERNIE SENT YA!</div>
          </div>
        </>
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
