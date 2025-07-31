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
    <div className="bg-gradient-hero flex items-center justify-center p-4 py-12">
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
        <div className="flex flex-col gap-3 max-w-3xl mx-auto">
          {pathways.map((pathway, index) => {
            const Icon = pathway.icon;
            const isSelected = selectedPathway === pathway.id;
            const pathNumber = index + 1;
            
            return (
              <Button
                key={pathway.id}
                variant={isSelected ? "default" : "outline"}
                className={`
                  group h-auto p-4 justify-start text-left transition-all duration-300
                  hover:shadow-gold hover:scale-[1.01] w-full
                  ${isSelected ? 'ring-2 ring-primary shadow-gold scale-[1.01]' : ''}
                  animate-fade-in
                `}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleSelect(pathway.id)}
              >
                <div className="flex items-center gap-4 w-full">
                  {/* Path Number */}
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {pathNumber}
                  </div>
                  
                  {/* Icon */}
                  <div className={`
                    p-2 rounded-lg bg-gradient-to-br ${pathway.gradient} 
                    group-hover:shadow-gold transition-all duration-300 flex-shrink-0
                  `}>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                      {pathway.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {pathway.description}
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <ArrowRight className={`
                    h-5 w-5 text-muted-foreground group-hover:text-primary 
                    transition-all duration-300 group-hover:translate-x-1 flex-shrink-0
                    ${isSelected ? 'text-primary translate-x-1' : ''}
                  `} />
                </div>
              </Button>
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