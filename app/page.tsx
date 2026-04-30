'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';

export default function DeliOracle() {
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState('');
  const [shakedown, setShakedown] = useState<{ partner: string; code: string; offer: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  // Detect tool invocations for the Shakedown Badge
  // In ai v6, tool parts use type 'tool-{toolName}' and state 'output-available'
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.parts) return;

    const shakedownPart = lastMessage.parts.find(
      (p: any) => p.type === 'tool-triggerShakedown' && p.state === 'output-available'
    ) as any;

    if (shakedownPart) {
      const { partnerName, shakedownCode, offer } = shakedownPart.input as {
        partnerName: string;
        shakedownCode: string;
        offer: string;
      };
      setShakedown({ partner: partnerName, code: shakedownCode, offer });
      const timer = setTimeout(() => setShakedown(null), 15000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');

  const getMessageText = (m: any) => {
    if (!m?.parts) return '';
    return m.parts
      .filter((p: any) => p.type === 'text')
      .map((p: any) => p.text)
      .join('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <main className="bodega-shell">
      <div className="neon-bg-cat">🐈</div>

      <div className="neon-sign">
        Deli<br />Oracle
      </div>

      <div className="content-area">
        <div className={`chat-display ${isLoading ? 'thinking' : ''}`}>
          {lastUserMessage && (
            <div className="user-text">
              &quot;{getMessageText(lastUserMessage)}&quot;
            </div>
          )}

          <div className="bubble" ref={scrollRef}>
            <div className="bernie-text">
              {isLoading
                ? "Bernie is judging you..."
                : lastAssistantMessage
                  ? getMessageText(lastAssistantMessage)
                  : "Yo. I'm Bernie. I've been in this bodega since the towers fell. What's your deal?"}
            </div>

            {shakedown && (
              <div className="affiliate-badge">
                {shakedown.partner} | {shakedown.offer} | CODE: {shakedown.code}
              </div>
            )}

            {error && (
              <div className="error-text">
                Bernie: &quot;I&apos;m bricked right now. Try again later, son.&quot; ({error.message})
              </div>
            )}
          </div>
        </div>

        <div className="bernie-visual">
          <div className="cat-frame">
            <img
              src="/bernie.png"
              alt="The Deli Oracle"
              className="cat-image"
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="input-zone">
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
