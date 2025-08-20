import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Waves, 
  Wind, 
  Sparkles, 
  Settings, 
  Zap,
  Volume2,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModernToolbarProps {
  onToolToggle: (tool: string, isActive: boolean) => void;
  activeTool: string | null;
}

export const ModernToolbar = ({ onToolToggle, activeTool }: ModernToolbarProps) => {
  const tools = [
    {
      id: 'ai',
      name: 'AI Assistant',
      icon: Brain,
      color: 'from-blue-500 to-purple-600',
      glowColor: 'rgba(59, 130, 246, 0.5)'
    },
    {
      id: 'breath',
      name: 'Breath of Source',
      icon: Wind,
      color: 'from-emerald-500 to-teal-600', 
      glowColor: 'rgba(16, 185, 129, 0.5)'
    },
    {
      id: 'frequency',
      name: 'Sacred Frequencies',
      icon: Waves,
      color: 'from-purple-500 to-pink-600',
      glowColor: 'rgba(147, 51, 234, 0.5)'
    }
  ];

  const handleToolClick = (toolId: string) => {
    const isCurrentlyActive = activeTool === toolId;
    onToolToggle(toolId, !isCurrentlyActive);
  };

  return (
    <div className="fixed top-16 right-4 z-50">
      {/* Main Toolbar Container */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Toolbar Background */}
        <div className="bg-background/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl">
          <div className="flex items-center gap-2">
            {/* Main Tools */}
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              const isActive = activeTool === tool.id;
              
              return (
                <motion.div
                  key={tool.id}
                  className="relative"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    onClick={() => handleToolClick(tool.id)}
                    variant="ghost"
                    size="sm"
                    className={`
                      relative w-12 h-12 rounded-xl transition-all duration-300 border
                      ${isActive 
                        ? 'bg-primary/20 border-primary/50 shadow-lg scale-110' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105'
                      }
                    `}
                    style={{
                      boxShadow: isActive ? `0 0 20px ${tool.glowColor}` : undefined
                    }}
                  >
                    {/* Tool Icon */}
                    <IconComponent 
                      className={`h-5 w-5 transition-all duration-300 ${
                        isActive ? 'text-primary' : 'text-white/80'
                      }`} 
                    />
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-primary/30"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    
                    {/* Glow Effect */}
                    {isActive && (
                      <motion.div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tool.color} opacity-20 blur-sm`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 0.3 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Button>

                  {/* Tooltip */}
                  <motion.div
                    className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 
                               bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap
                               pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
                    initial={{ opacity: 0, y: -5 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    {tool.name}
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Separator */}
            <div className="h-8 w-px bg-white/20 mx-1" />

            {/* Settings Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <Settings className="h-4 w-4 text-white/60" />
              </Button>
            </motion.div>
          </div>
        </div>


        {/* Background Glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl -z-10"
          animate={{
            scale: activeTool ? 1.1 : 1,
            opacity: activeTool ? 0.8 : 0.3
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </div>
  );
};