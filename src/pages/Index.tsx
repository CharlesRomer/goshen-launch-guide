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

  if (appState === 'selector') {
    return <PathwaySelector onSelectPathway={handlePathwaySelect} />;
  }

  if (appState === 'registration') {
    return (
      <UserRegistration 
        pathwayStage={selectedPathway}
        onComplete={handleRegistrationComplete}
      />
    );
  }

  if (appState === 'chat') {
    return (
      <CoachingChat 
        sessionId={sessionId}
        pathwayStage={selectedPathway}
        onRestart={handleRestart}
      />
    );
  }

  return null;
};

export default Index;
