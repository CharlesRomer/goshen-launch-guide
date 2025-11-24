import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
const VIPBanner = () => {
  return <div className="w-full bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-3 text-sm">
        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-foreground/90 font-medium">Schedule a strategy call to launch with our team!</span>
        <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-primary/30 hover:bg-primary/10 hover:border-primary/50" asChild>
          <a target="_blank" rel="noopener noreferrer" href="https://lp.goshenites.com/calendar-5098-1699-or">Launch with our help!</a>
        </Button>
      </div>
    </div>;
};
export default VIPBanner;