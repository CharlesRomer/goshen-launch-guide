import { useState, useEffect, useRef } from "react";
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
  'improvement': "Offer Enhancement Coach",
  'scaling': "Scaling Strategy Coach"
};

export const CoachingChat = ({ sessionId, pathwayStage, onRestart }: CoachingChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadInitialData();
  }, [sessionId]);

  useEffect(() => {
    // Auto-hide welcome banner after 3 seconds
    if (showWelcomeBanner) {
      const timer = setTimeout(() => {
        setShowWelcomeBanner(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWelcomeBanner]);

  useEffect(() => {
    // Handle mobile keyboard behavior
    if (isMobile) {
      const handleResize = () => {
        // Small delay to ensure DOM has updated
        setTimeout(scrollToBottom, 100);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isMobile]);

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


  return (
    <div className="h-screen bg-gradient-hero flex flex-col overflow-hidden relative">
      {/* Welcome Banner */}
      {showWelcomeBanner && (
        <div className="relative bg-gradient-primary text-primary-foreground py-3 px-4 shadow-lg animate-in slide-in-from-top-2 duration-500">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-white/20">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Welcome to Goshen Digital Launch</h2>
                <p className="text-sm opacity-90">Your AI business coach is ready to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWelcomeBanner(false)}
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold">
                  {pathwayTitles[pathwayStage as keyof typeof pathwayTitles]}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Your personal business strategy session
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onRestart}
              className="hover:shadow-gold transition-all duration-300 text-xs sm:text-sm px-2 sm:px-4"
            >
              <RotateCcw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">New Pathway</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Container with proper mobile spacing */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: isMobile ? '80px' : '0' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <div className="space-y-4 sm:space-y-6">
            {messages.map((message, index) => (
              <Card 
                key={index}
                className={`
                  max-w-3xl transition-all duration-300 animate-fade-in
                  ${message.role === 'assistant' 
                    ? 'mr-auto bg-card border-border/50' 
                    : 'ml-auto bg-primary/10 border-primary/20'
                  }
                `}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className={`
                      w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0
                      ${message.role === 'assistant' 
                        ? 'bg-gradient-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                      }
                    `}>
                      {message.role === 'assistant' ? 'AI' : 'You'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="prose prose-sm max-w-none text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-3">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-sm sm:text-base font-semibold text-primary mb-1 sm:mb-2 mt-3 sm:mt-4">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-semibold text-primary mb-1 sm:mb-2 mt-2 sm:mt-3">{children}</h3>,
                            hr: () => <hr className="border-border my-3 sm:my-4" />,
                            p: ({ children }) => <p className="mb-1 sm:mb-2 last:mb-0 text-sm sm:text-base">{children}</p>,
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
              <Card className="max-w-3xl mr-auto bg-card border-border/50">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs sm:text-sm font-medium text-primary-foreground flex-shrink-0">
                      AI
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Fixed Input at Bottom for Mobile */}
      <div 
        className={`
          border-t border-border/50 bg-card/95 backdrop-blur-sm
          ${isMobile ? 'fixed bottom-0 left-0 right-0 safe-area-pb' : ''}
        `}
        style={{
          paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : undefined
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-2 sm:gap-3">
            <Input
              ref={inputRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 transition-all duration-300 focus:ring-primary/50 text-sm sm:text-base"
              disabled={isLoading}
            />
            <Button 
              onClick={() => sendMessage()}
              disabled={!currentMessage.trim() || isLoading}
              className="bg-gradient-primary hover:shadow-gold transition-all duration-300 px-3 sm:px-4"
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              ) : (
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};