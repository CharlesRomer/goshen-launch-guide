import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, RotateCcw, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface CoachingChatProps {
  sessionId: string;
  pathwayStage: string;
  onRestart: () => void;
}

const pathwayTitles = {
  'no_idea': "Idea Discovery Coach",
  'idea_validation': "Idea Validation Coach",
  'scaling': "Scaling Strategy Coach"
};

export const CoachingChat = ({ sessionId, pathwayStage, onRestart }: CoachingChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const observerRef = useRef<IntersectionObserver>();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  /** Scroll to bottom helper */
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "nearest"
      });
    }
  }, []);

  /** Detect when bottom is visible */
  useEffect(() => {
    if (!messagesEndRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    observerRef.current.observe(messagesEndRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  /** Auto-scroll on new messages if at bottom */
  useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      requestAnimationFrame(() => scrollToBottom(true));
    }
  }, [messages, isLoading, isAtBottom, scrollToBottom]);

  /** Adjust textarea height */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [currentMessage]);

  /** Load initial data */
  useEffect(() => {
    loadInitialData();
  }, [sessionId]);

  /** Mobile: Listen for keyboard & viewport changes */
  useEffect(() => {
    if (!isMobile || !window.visualViewport) return;

    const handleResize = () => {
      const heightDiff = window.innerHeight - window.visualViewport!.height;
      const keyboardIsOpen = heightDiff > 150; // threshold
      setIsKeyboardOpen(keyboardIsOpen);

      if (inputContainerRef.current) {
        if (keyboardIsOpen) {
          // Fix to bottom of visual viewport
          inputContainerRef.current.style.position = "fixed";
          inputContainerRef.current.style.bottom = "0px";
          inputContainerRef.current.style.left = "0";
          inputContainerRef.current.style.right = "0";
          inputContainerRef.current.style.paddingBottom = `max(env(safe-area-inset-bottom), 8px)`;
        } else {
          // Restore sticky for normal scroll
          inputContainerRef.current.style.position = "sticky";
          inputContainerRef.current.style.bottom = "0";
          inputContainerRef.current.style.paddingBottom = `max(env(safe-area-inset-bottom), 16px)`;
        }
      }

      // Auto-scroll when keyboard opens
      if (keyboardIsOpen && isAtBottom) {
        requestAnimationFrame(() => scrollToBottom(true));
      }
    };

    window.visualViewport.addEventListener("resize", handleResize);
    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, [isMobile, isAtBottom, scrollToBottom]);

  const loadInitialData = async () => {
    try {
      const { data: sessionData } = await supabase
        .from("sessions")
        .select("conversation_log")
        .eq("id", sessionId)
        .single();

      const conversationLog = (sessionData?.conversation_log as unknown as Message[]) || [];
      setMessages(conversationLog);

      const { data: promptData } = await supabase
        .from("prompts")
        .select("questions")
        .eq("stage_label", pathwayStage as any)
        .single();

      setQuestions((promptData?.questions as string[]) || []);

      if (conversationLog.length === 0) {
        setMessages([{
          role: "assistant",
          content: `Welcome! I'm your ${pathwayTitles[pathwayStage as keyof typeof pathwayTitles]}.`,
          timestamp: new Date().toISOString()
        }]);
      }

      setTimeout(() => scrollToBottom(false), 100);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load session", variant: "destructive" });
    }
  };

  const sendMessage = async () => {
    const text = currentMessage.trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    setCurrentMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setMessages(prev => [...prev, { role: "user", content: text, timestamp: new Date().toISOString() }]);

    try {
      const response = await supabase.functions.invoke("ai-coaching", {
        body: { message: text, sessionId, pathwayStage }
      });

      setMessages(prev => [...prev, {
        role: "assistant",
        content: response.data.response,
        timestamp: new Date().toISOString()
      }]);
    } catch {
      toast({ title: "Message Failed", description: "Please try again", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    height: isMobile ? "100dvh" : "calc(100vh - 48px)",
    maxHeight: isMobile ? "100dvh" : "calc(100vh - 48px)",
    background: "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)",
    overflow: "hidden"
  };

  const inputContainerStyle: React.CSSProperties = {
    position: "sticky",
    bottom: 0,
    zIndex: 50,
    borderTop: "1px solid hsl(var(--border) / 0.5)",
    background: "hsl(var(--card) / 0.98)",
    backdropFilter: "blur(8px)",
    paddingBottom: `max(env(safe-area-inset-bottom), 16px)`
  };

  return (
    <div style={containerStyle} className="chat-layout">
      <header className="sticky top-0 z-20 border-b border-border/50 bg-card/98 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold">
                {pathwayTitles[pathwayStage as keyof typeof pathwayTitles]}
              </h1>
              <p className="text-xs text-muted-foreground">Your AI business coach</p>
            </div>
          </div>
          <Button variant="outline" onClick={onRestart} size="sm" className="text-xs px-3 min-h-[44px]">
            <RotateCcw className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">New Session</span>
          </Button>
        </div>
      </header>

      <main ref={messagesContainerRef} className="overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-6 flex flex-col gap-3">
          {messages.map((message, i) => (
            <Card key={i} className={message.role === "assistant" ? "mr-auto" : "ml-auto"}>
              <CardContent className="p-3">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </CardContent>
            </Card>
          ))}
          {isLoading && <Loader2 className="mx-auto animate-spin" />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer ref={inputContainerRef} style={inputContainerStyle}>
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={currentMessage}
            onChange={e => setCurrentMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 resize-none min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <Button onClick={sendMessage} disabled={!currentMessage.trim() || isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </footer>
    </div>
  );
};