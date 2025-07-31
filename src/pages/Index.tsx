import { useState } from "react";
import { PathwaySelector } from "@/components/PathwaySelector";
import { UserRegistration } from "@/components/UserRegistration";
import { CoachingChat } from "@/components/CoachingChat";

type AppState = 'selector' | 'registration' | 'chat';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('selector');
  const [selectedPathway, setSelectedPathway] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [profileId, setProfileId] = useState<string>('');

  const handlePathwaySelect = (pathway: string) => {
    setSelectedPathway(pathway);
    setAppState('registration');
  };

  const handleRegistrationComplete = (newProfileId: string, newSessionId: string) => {
    setProfileId(newProfileId);
    setSessionId(newSessionId);
    setAppState('chat');
  };

  const handleRestart = () => {
    setAppState('selector');
    setSelectedPathway('');
    setSessionId('');
    setProfileId('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {appState === 'selector' && (
          <PathwaySelector onSelectPathway={handlePathwaySelect} />
        )}

        {appState === 'registration' && (
          <UserRegistration 
            pathwayStage={selectedPathway}
            onComplete={handleRegistrationComplete}
          />
        )}

        {appState === 'chat' && (
          <CoachingChat 
            sessionId={sessionId}
            pathwayStage={selectedPathway}
            onRestart={handleRestart}
          />
        )}
      </div>
      
      {/* Fine Print Disclaimer */}
      <footer className="py-4 px-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <p className="text-xs text-muted-foreground text-center">
          Your chats are saved for training purposes to improve our AI coaching services. 
          By using this service, you consent to this data usage.
        </p>
      </footer>
    </div>
  );
};

export default Index;
