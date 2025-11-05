import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import goshenLogo from "@/assets/goshen-logo.png";

const AccessPage = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAccess = () => {
    if (isValidEmail(email)) {
      window.location.href = "https://launchyourproductin7days-nlk2lt8.gamma.site/";
    } else {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidEmail(email)) {
      handleAccess();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src={goshenLogo} 
            alt="Goshen Logo" 
            className="h-16 sm:h-20 mx-auto mb-8 object-contain"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Enter your email to access
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-12 text-base bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
          />
          
          <Button
            onClick={handleAccess}
            disabled={!isValidEmail(email)}
            className="w-full h-12 bg-gradient-primary hover:shadow-gold transition-all duration-300 text-base font-medium"
          >
            Access
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessPage;
