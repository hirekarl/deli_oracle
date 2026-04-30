'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';

export default function DeliOracle() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');
  const [shakedown, setShakedown] = useState<{ partner: string; code: string; offer: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';

  // Auto-scroll to bottom with smooth behavior for projector
  useEffect(() => {
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
      (p) => p.type === 'tool-triggerShakedown' && p.state === 'output-available'
    );

    if (shakedownPart && 'input' in shakedownPart) {
      const { partnerName, shakedownCode, offer } = shakedownPart.input as {
        partnerName: string;
        shakedownCode: string;
        offer: string;
      };
      setShakedown({ partner: partnerName, code: shakedownCode, offer });

      // Keep the badge visible for 15 seconds for the audience
      const timer = setTimeout(() => setShakedown(null), 15000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    // Dev 4: Trigger doorbell chime here!
    sendMessage({ text: input });
    setInput('');
  };

  const getMessageText = (m: (typeof messages)[number]) =>
    m.parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text)
      .join('');

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
      </div>

      {shakedown && (
        <>
          <div className="affiliate-backdrop" />
          <div className="affiliate-popup">
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
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit" disabled={isLoading}>
          SEND
        </button>
      </form>
    </main>
  );
}
