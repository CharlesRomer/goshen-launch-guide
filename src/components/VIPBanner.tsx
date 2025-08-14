import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
const VIPBanner = () => {
  return <div className="w-full bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-3 text-sm">
        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-foreground/90 font-medium">Upgrade Your Event Ticket to VIP – Join Exclusive Calls
      </span>
        <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-primary/30 hover:bg-primary/10 hover:border-primary/50" asChild>
          <a href="https://go.goshenites.com/ZWw7KR" target="_blank" rel="noopener noreferrer">
            Upgrade to VIP
          </a>
        </Button>
      </div>
    </div>;
};
export default VIPBanner;