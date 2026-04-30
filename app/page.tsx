'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';

export default function DeliOracle() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat();
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
        
        const timer = setTimeout(() => setShakedown(null), 15000);
        return () => clearTimeout(timer);
      }
    }
  }, [messages]);

  const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');

  const getMessageText = (m: any) => {
    if (m.content) return m.content;
    
    const text = m.parts
      ? m.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('')
      : '';
    
    return text;
  };

  return (
    <main className="bodega-shell">
      {/* Background Aesthetic: Neon Cat */}
      <div className="neon-bg-cat">🐈</div>

      {/* HEADER / IDLE STATE */}
      <div className="neon-sign">
        Deli<br />Oracle
      </div>

      <div className="content-area">
        {/* CONVERSATION AREA */}
        <div className={`chat-display ${isLoading ? 'thinking' : ''}`}>
          {lastUserMessage && (
            <div className="user-text">
              &quot;{lastUserMessage.content}&quot;
            </div>
          )}

          <div className="bubble" ref={scrollRef}>
            <div className="bernie-text">
              {isLoading ? "Bernie is judging you..." : (lastAssistantMessage ? getMessageText(lastAssistantMessage) : "Yo. I'm Bernie. I've been in this bodega since the towers fell. What's your deal?")}
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

        {/* BERNIE VISUAL */}
        <div className="bernie-visual">
          <div className="cat-frame">
            <img 
              src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=1000" 
              alt="Grumpy Bodega Cat" 
              className="cat-image"
            />
          </div>
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
