import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lightbulb, Search, TrendingUp, Rocket } from "lucide-react";
import goshenLogo from "@/assets/goshen-logo.png";

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
    <div className="h-screen bg-gradient-hero flex flex-col justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div className="max-w-6xl w-full mx-auto flex flex-col h-full justify-center space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 lg:space-y-3">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <img src="/lovable-uploads/134b4b6c-5e9d-47a6-ac2c-0fe90ce02fbf.png" alt="Goshen Digital Launch" className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40" />
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your next step toward building a profitable digital product starts here. 
            Choose the path that best describes where you are today.
          </p>
        </div>

        {/* Pathway Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 max-w-4xl mx-auto flex-1 items-center">
          {pathways.map((pathway, index) => {
            const Icon = pathway.icon;
            const isSelected = selectedPathway === pathway.id;
            const pathNumber = index + 1;
            
            return (
              <div
                key={pathway.id}
                className={`
                  group relative overflow-hidden rounded-xl bg-gradient-card 
                  border border-border/50 backdrop-blur-sm
                  transition-all duration-200 ease-out
                  hover:shadow-premium hover:scale-[1.005] hover:border-primary/30
                  ${isSelected ? 'ring-2 ring-primary shadow-gold scale-[1.005] border-primary/50' : ''}
                  cursor-pointer
                `}
                onClick={() => handleSelect(pathway.id)}
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
                
                {/* Content */}
                <div className="relative p-4 lg:p-5 space-y-2 lg:space-y-3">
                  {/* Header with Number and Icon */}
                  <div className="flex items-center gap-3">
                    {/* Path Number */}
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center text-sm lg:text-base font-bold shadow-premium">
                      {pathNumber}
                    </div>
                    
                    {/* Icon */}
                    <div className={`
                      p-2 rounded-lg bg-gradient-to-br ${pathway.gradient} 
                      group-hover:shadow-premium transition-all duration-200
                      border border-primary/20
                    `}>
                      <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-1 lg:space-y-2">
                    <h3 className="font-bold text-sm lg:text-base text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
                      {pathway.title}
                    </h3>
                    <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
                      {pathway.description}
                    </p>
                  </div>
                  
                  {/* CTA */}
                  <div className="pt-1">
                    <div className={`
                      inline-flex items-center gap-2 text-xs lg:text-sm font-medium
                      transition-all duration-200 group-hover:text-primary
                      ${isSelected ? 'text-primary' : 'text-muted-foreground'}
                    `}>
                      <span>Choose This Path</span>
                      <ArrowRight className={`
                        h-3 w-3 lg:h-4 lg:w-4 transition-all duration-200 
                        group-hover:translate-x-0.5 group-hover:text-primary
                        ${isSelected ? 'text-primary translate-x-0.5' : ''}
                      `} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-xs lg:text-sm text-muted-foreground space-y-1">
          <p className="max-w-xl mx-auto">Each pathway includes personalized AI coaching tailored to your specific needs.</p>
          <div className="w-16 h-0.5 bg-gradient-primary mx-auto rounded-full opacity-50" />
        </div>
      </div>
    </div>
  );
};