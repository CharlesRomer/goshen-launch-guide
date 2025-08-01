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
    title: "I don't have an idea yet — help me find one",
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
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl w-full space-y-8 lg:space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 lg:space-y-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-glow">
            Goshen Digital Launch
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Your next step toward building a profitable digital product starts here. 
            Choose the path that best describes where you are today.
          </p>
        </div>

        {/* Pathway Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {pathways.map((pathway, index) => {
            const Icon = pathway.icon;
            const isSelected = selectedPathway === pathway.id;
            const pathNumber = index + 1;
            
            return (
              <div
                key={pathway.id}
                className={`
                  group relative overflow-hidden rounded-2xl bg-gradient-card 
                  border border-border/50 backdrop-blur-sm
                  transition-all duration-500 ease-bounce
                  hover:shadow-premium hover:scale-[1.02] hover:border-primary/30
                  ${isSelected ? 'ring-2 ring-primary shadow-gold scale-[1.02] border-primary/50' : ''}
                  animate-fade-in cursor-pointer
                `}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => handleSelect(pathway.id)}
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-border opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                
                {/* Content */}
                <div className="relative p-6 lg:p-8 space-y-4">
                  {/* Header with Number and Icon */}
                  <div className="flex items-center gap-4">
                    {/* Path Number */}
                    <div className="relative">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-lg lg:text-xl font-bold shadow-premium">
                        {pathNumber}
                      </div>
                      <div className="absolute inset-0 bg-primary rounded-2xl animate-pulse-gold opacity-50" />
                    </div>
                    
                    {/* Icon */}
                    <div className={`
                      p-3 lg:p-4 rounded-xl bg-gradient-to-br ${pathway.gradient} 
                      group-hover:shadow-premium transition-all duration-500 animate-float
                      border border-primary/20
                    `}
                    style={{ animationDelay: `${index * 200}ms` }}>
                      <Icon className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg lg:text-xl text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                      {pathway.title}
                    </h3>
                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                      {pathway.description}
                    </p>
                  </div>
                  
                  {/* CTA */}
                  <div className="pt-2">
                    <div className={`
                      inline-flex items-center gap-2 text-sm lg:text-base font-medium
                      transition-all duration-300 group-hover:text-primary
                      ${isSelected ? 'text-primary' : 'text-muted-foreground'}
                    `}>
                      <span>Choose This Path</span>
                      <ArrowRight className={`
                        h-4 w-4 transition-all duration-300 
                        group-hover:translate-x-1 group-hover:text-primary
                        ${isSelected ? 'text-primary translate-x-1' : ''}
                      `} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-sm lg:text-base text-muted-foreground animate-fade-in space-y-2" style={{ animationDelay: "800ms" }}>
          <p className="max-w-2xl mx-auto">Each pathway includes personalized AI coaching tailored to your specific needs.</p>
          <div className="w-24 h-0.5 bg-gradient-primary mx-auto rounded-full opacity-50" />
        </div>
      </div>
    </div>
  );
};