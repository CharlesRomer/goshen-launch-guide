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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();
  
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Smooth scroll to bottom using IntersectionObserver
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? "smooth" : "auto",
        block: "nearest"
      });
    }
  }, []);

  // Setup intersection observer for bottom detection
  useEffect(() => {
    if (!messagesEndRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry.isIntersecting);
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px' // Trigger before actually reaching bottom
      }
    );

    observerRef.current.observe(messagesEndRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Auto-scroll on new messages only if user is at bottom
  useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      // Use RAF for smooth performance
      requestAnimationFrame(() => {
        scrollToBottom(true);
      });
    }
  }, [messages, isLoading, isAtBottom, scrollToBottom]);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // Max 4-5 lines
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [currentMessage, adjustTextareaHeight]);

  useEffect(() => {
    loadInitialData();
  }, [sessionId]);

  // Mobile-specific optimizations
  useEffect(() => {
    if (!isMobile) return;

    // Prevent zoom on input focus
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      const originalContent = viewport.getAttribute('content');
      
      const handleFocus = () => {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      };
      
      const handleBlur = () => {
        if (originalContent) {
          viewport.setAttribute('content', originalContent);
        }
      };

      document.addEventListener('focusin', handleFocus);
      document.addEventListener('focusout', handleBlur);

      return () => {
        document.removeEventListener('focusin', handleFocus);
        document.removeEventListener('focusout', handleBlur);
        if (originalContent) {
          viewport.setAttribute('content', originalContent);
        }
      };
    }
  }, [isMobile]);

  const loadInitialData = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('conversation_log')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      const conversationLog = (sessionData.conversation_log as unknown as Message[]) || [];
      setMessages(conversationLog);

      const { data: promptData, error: promptError } = await supabase
        .from('prompts')
        .select('questions')
        .eq('stage_label', pathwayStage as any)
        .single();

      if (promptError) throw promptError;

      const pathwayQuestions = (promptData.questions as string[]) || [];
      setQuestions(pathwayQuestions);

      if (conversationLog.length === 0) {
        const welcomeMessage: Message = {
          role: 'assistant',
          content: `Welcome! I'm your ${pathwayTitles[pathwayStage as keyof typeof pathwayTitles]}. I'm here to help you gain clarity and confidence in your next steps. Let's start with a few questions to understand your situation better.

---

**Ready to begin?** 

Type "Yes" to get started with your personalized coaching session.`,
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      }

      // Ensure we scroll to bottom after loading
      setTimeout(() => scrollToBottom(false), 100);

    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load your session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || currentMessage.trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    setCurrentMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await supabase.functions.invoke('ai-coaching', {
        body: {
          message: text,
          sessionId: sessionId,
          pathwayStage: pathwayStage
        }
      });

      if (response.error) {
        throw response.error;
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
  };

  // Dynamic styles based on mobile state
  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    height: isMobile ? '100dvh' : 'calc(100vh - 48px)',
    maxHeight: isMobile ? '100dvh' : 'calc(100vh - 48px)',
    background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
    overflow: 'hidden',
    position: 'relative'
  };

  const inputContainerStyle: React.CSSProperties = {
    position: 'sticky',
    bottom: 0,
    zIndex: 50,
    borderTop: '1px solid hsl(var(--border) / 0.5)',
    background: 'hsl(var(--card) / 0.98)',
    backdropFilter: 'blur(8px)',
    paddingBottom: isMobile ? 'max(env(safe-area-inset-bottom), 16px)' : '16px'
  };

  return (
    <div style={containerStyle} className="chat-layout">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/50 bg-card/98 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-semibold leading-tight">
                  {pathwayTitles[pathwayStage as keyof typeof pathwayTitles]}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Your AI business coach
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onRestart}
              size="sm"
              className="hover:shadow-gold transition-all duration-300 text-xs px-3 min-h-[44px]"
            >
              <RotateCcw className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">New Session</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main 
        ref={messagesContainerRef}
        className="overflow-y-auto overflow-x-hidden overscroll-contain"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {messages.map((message, index) => (
              <Card 
                key={index}
                className={`
                  max-w-[85%] sm:max-w-3xl transition-all duration-300 ease-out animate-fade-in
                  ${message.role === 'assistant' 
                    ? 'mr-auto bg-card/95 border-border/30 hover:bg-card' 
                    : 'ml-auto bg-primary/15 border-primary/30 hover:bg-primary/20'
                  }
                `}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <div className={`
                      w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0
                      ${message.role === 'assistant' 
                        ? 'bg-gradient-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                      }
                    `}>
                      {message.role === 'assistant' ? 'AI' : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="prose prose-sm max-w-none text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className="text-sm sm:text-base font-bold text-primary mb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-sm font-semibold text-primary mb-1 mt-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-semibold text-primary mb-1 mt-2">{children}</h3>,
                            hr: () => <hr className="border-border my-2" />,
                            p: ({ children }) => <p className="mb-1 last:mb-0 text-sm leading-relaxed">{children}</p>,
                            strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                            em: ({ children }) => <em className="italic text-muted-foreground">{children}</em>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {isLoading && (
              <Card className="max-w-[85%] sm:max-w-3xl mr-auto bg-card/95 border-border/30">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-medium text-primary-foreground flex-shrink-0">
                      AI
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div ref={messagesEndRef} className="h-1 w-1 opacity-0" />
          </div>
        </div>
      </main>

      {/* Input Bar */}
      <footer style={inputContainerStyle}>
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={currentMessage}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 resize-none min-h-[44px] max-h-[120px] text-base border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 bg-background/50 transition-all duration-200"
              disabled={isLoading}
              rows={1}
              style={{
                fontSize: '16px', // Prevent zoom on iOS
                lineHeight: '1.4'
              }}
            />
            <Button 
              onClick={() => sendMessage()}
              disabled={!currentMessage.trim() || isLoading}
              size="sm"
              className="bg-gradient-primary hover:shadow-gold transition-all duration-300 px-3 min-h-[44px] min-w-[44px] flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};