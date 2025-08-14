import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, RotateCcw, MessageCircle, X } from "lucide-react";
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isUserScrolled, setIsUserScrolled] = useState(false);
  const [lastScrollHeight, setLastScrollHeight] = useState(0);
  const [inputHeight, setInputHeight] = useState(44);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Robust scroll to bottom with user intent detection
  const scrollToBottom = useCallback((force = false) => {
    if (!messagesEndRef.current || (!force && isUserScrolled)) return;
    
    messagesEndRef.current.scrollIntoView({ 
      behavior: "smooth", 
      block: "end",
      inline: "nearest"
    });
  }, [isUserScrolled]);

  const scrollToBottomImmediate = useCallback((force = false) => {
    if (!messagesEndRef.current || (!force && isUserScrolled)) return;
    
    messagesEndRef.current.scrollIntoView({ 
      behavior: "auto", 
      block: "end",
      inline: "nearest"
    });
  }, [isUserScrolled]);

  // Enhanced scroll detection with better threshold
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;
    const threshold = 50; // More forgiving threshold
    
    const wasUserScrolled = isUserScrolled;
    const newIsUserScrolled = scrollBottom > threshold;
    
    if (wasUserScrolled !== newIsUserScrolled) {
      setIsUserScrolled(newIsUserScrolled);
    }

    // Clear any pending scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Reset scroll detection after user stops scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      if (scrollBottom <= threshold) {
        setIsUserScrolled(false);
      }
    }, 150);
  }, [isUserScrolled]);

  // Handle input height changes for multiline
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
    
    // Measure input height to prevent layout jumps
    if (inputRef.current) {
      const newHeight = Math.max(44, Math.min(120, inputRef.current.scrollHeight));
      if (newHeight !== inputHeight) {
        setInputHeight(newHeight);
        // Force scroll update after height change
        if (!isUserScrolled) {
          setTimeout(() => scrollToBottomImmediate(true), 50);
        }
      }
    }
  }, [inputHeight, isUserScrolled, scrollToBottomImmediate]);

  // Improved auto-scroll on new messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const currentScrollHeight = container.scrollHeight;
    const heightDiff = currentScrollHeight - lastScrollHeight;
    
    if (heightDiff > 0 && !isUserScrolled) {
      // New content added and user is at bottom
      setTimeout(() => scrollToBottom(true), 50);
    }
    
    setLastScrollHeight(currentScrollHeight);
  }, [messages, isLoading, lastScrollHeight, isUserScrolled, scrollToBottom]);

  useEffect(() => {
    loadInitialData();
  }, [sessionId]);

  // Enhanced viewport handling for mobile
  useEffect(() => {
    if (!isMobile) return;

    let ticking = false;
    
    const handleViewportChange = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Force layout recalculation
          if (messagesContainerRef.current) {
            messagesContainerRef.current.style.height = 'auto';
            messagesContainerRef.current.offsetHeight; // Trigger reflow
          }
          
          // Scroll to bottom if user was at bottom
          if (!isUserScrolled) {
            setTimeout(() => scrollToBottomImmediate(true), 100);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Listen to multiple viewport events
    window.addEventListener('resize', handleViewportChange, { passive: true });
    window.addEventListener('orientationchange', handleViewportChange);
    
    // Visual viewport API for better mobile support
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
    }

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
    };
  }, [isMobile, isUserScrolled, scrollToBottomImmediate]);

  const loadInitialData = async () => {
    try {
      // Load existing conversation
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('conversation_log')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      const conversationLog = (sessionData.conversation_log as unknown as Message[]) || [];
      setMessages(conversationLog);

      // Load questions for this pathway
      const { data: promptData, error: promptError } = await supabase
        .from('prompts')
        .select('questions')
        .eq('stage_label', pathwayStage as any)
        .single();

      if (promptError) throw promptError;

      const pathwayQuestions = (promptData.questions as string[]) || [];
      setQuestions(pathwayQuestions);

      // If no conversation yet, start with welcome message
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

      // Always scroll to bottom after loading data
      setIsUserScrolled(false);
      setTimeout(() => scrollToBottomImmediate(true), 200);

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
    setInputHeight(44); // Reset input height
    setIsUserScrolled(false); // Ensure we scroll to new messages

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
      // Remove the user message that failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputFocus = () => {
    // Ensure we're at bottom when focusing input
    setIsUserScrolled(false);
    setTimeout(() => scrollToBottomImmediate(true), 150);
  };

  return (
    <div 
      className="bg-gradient-hero flex flex-col relative overflow-hidden"
      style={{ 
        height: isMobile ? '100dvh' : 'calc(100vh - 48px)',
        minHeight: isMobile ? '100svh' : 'calc(100vh - 48px)',
        maxHeight: isMobile ? '100dvh' : 'calc(100vh - 48px)'
      }}
    >
      {/* Header - Fixed */}
      <header className="flex-none border-b border-border/50 bg-card/98 backdrop-blur-sm relative z-20">
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

      {/* Messages Container - Scrollable */}
      <main 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden relative"
        onScroll={handleScroll}
        style={{
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-6">
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message, index) => (
              <Card 
                key={index}
                className={`
                  max-w-[85%] sm:max-w-3xl transition-all duration-300 ease-out animate-fade-in transform hover:scale-[1.02]
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

            {/* Scroll anchor */}
            <div ref={messagesEndRef} className="h-1 w-1 opacity-0" />
          </div>
        </div>
      </main>

      {/* Input Bar - Sticky at Bottom with Safe Area */}
      <footer 
        ref={composerRef}
        className="flex-none border-t border-border/50 bg-card/98 backdrop-blur-sm relative z-50"
        style={{
          paddingBottom: isMobile ? 'max(env(safe-area-inset-bottom, 0px), 16px)' : '16px',
          minHeight: inputHeight + 32 // Account for padding
        }}
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex gap-2 items-end">
            <Input
              ref={inputRef}
              value={currentMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              placeholder="Type your message..."
              className="flex-1 text-base border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 bg-background/50 transition-all duration-200 resize-none"
              style={{
                minHeight: '44px',
                height: `${inputHeight}px`,
                maxHeight: '120px',
                overflowY: inputHeight > 44 ? 'auto' : 'hidden'
              }}
              disabled={isLoading}
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