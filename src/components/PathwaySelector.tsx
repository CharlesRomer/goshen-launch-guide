import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lightbulb, Search, TrendingUp, Rocket } from "lucide-react";

interface PathwaySelectorProps {
  onSelectPathway: (pathway: string) => void;
}

const pathways = [
  {
    id: 'no_idea',
    title: "I don't have an idea — I need one",
    description: "Discover your calling through guided exploration of your gifts and passions",
    icon: Lightbulb,
    gradient: "from-primary/20 to-primary/5",
  },
  {
    id: 'idea_validation',
    title: "I have an idea, but I don't know if it's good",
    description: "Validate your concept using proven frameworks for clarity and market fit",
    icon: Search,
    gradient: "from-accent/20 to-accent/5",
  },
  {
    id: 'improvement',
    title: "I have an idea and it works — I just want to make it better",
    description: "Elevate your working offer with strategic enhancements and positioning",
    icon: TrendingUp,
    gradient: "from-primary/20 to-primary/5",
  },
  {
    id: 'scaling',
    title: "I have an offer — I just need to scale it",
    description: "Implement proven systems for traffic, automation, and revenue growth",
    icon: Rocket,
    gradient: "from-accent/20 to-accent/5",
  },
];

export const PathwaySelector = ({ onSelectPathway }: PathwaySelectorProps) => {
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  const handleSelect = (pathwayId: string) => {
    setSelectedPathway(pathwayId);
    // Small delay for visual feedback
    setTimeout(() => {
      onSelectPathway(pathwayId);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Goshen Digital Launch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your next step toward building a profitable digital product starts here. 
            Choose the path that best describes where you are today.
          </p>
        </div>

        {/* Pathway Cards */}
        <div className="grid gap-6 md:gap-8">
          {pathways.map((pathway, index) => {
            const Icon = pathway.icon;
            const isSelected = selectedPathway === pathway.id;
            
            return (
              <Card 
                key={pathway.id} 
                className={`
                  group cursor-pointer transition-all duration-300 hover:shadow-gold hover:scale-[1.02]
                  border-border/50 hover:border-primary/50
                  ${isSelected ? 'ring-2 ring-primary shadow-gold scale-[1.02]' : ''}
                  animate-fade-in
                `}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleSelect(pathway.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className={`
                      p-3 rounded-lg bg-gradient-to-br ${pathway.gradient} 
                      group-hover:shadow-gold transition-all duration-300
                      ${isSelected ? 'animate-pulse-gold' : ''}
                    `}>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {pathway.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {pathway.description}
                      </CardDescription>
                    </div>
                    <ArrowRight className={`
                      h-5 w-5 text-muted-foreground group-hover:text-primary 
                      transition-all duration-300 group-hover:translate-x-1
                      ${isSelected ? 'text-primary translate-x-1' : ''}
                    `} />
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "600ms" }}>
          <p>Each pathway includes personalized AI coaching tailored to your specific needs.</p>
        </div>
      </div>
    </div>
  );
};