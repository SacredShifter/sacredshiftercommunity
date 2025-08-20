import { UIErrorBoundary, AudioErrorBoundary } from "@/components/ErrorBoundary";
import { AIChatBubble } from "@/components/AIChatBubble";
import BreathOfSource from "@/components/BreathOfSource";
import { SacredSoundscape } from "@/components/SacredSoundscape";

export const ModernToolbar = () => {
  return (
    <div className="fixed top-16 right-4 z-50">
      {/* Toolbar Container */}
      <div className="bg-background/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl">
        <div className="flex items-center gap-3">
          {/* Breath of Source */}
          <AudioErrorBoundary>
            <BreathOfSource />
          </AudioErrorBoundary>
          
          {/* AI Chat Bubble */}
          <UIErrorBoundary>
            <AIChatBubble />
          </UIErrorBoundary>
          
          {/* Sacred Soundscape */}
          <AudioErrorBoundary>
            <SacredSoundscape />
          </AudioErrorBoundary>
        </div>
      </div>
      
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl -z-10 opacity-30" />
    </div>
  );
};