import { Button, ButtonProps } from "@/components/ui/button";
import { motion } from "framer-motion";
import useSound from "use-sound";
import { forwardRef } from "react";

const clickSound = "/sounds/click.mp3"; 

interface SoftButtonProps extends ButtonProps {
  soundEnabled?: boolean;
}

export const SoftButton = forwardRef<HTMLButtonElement, SoftButtonProps>(
  ({ 
    className, 
    onClick, 
    soundEnabled = true, 
    // Exclude props that conflict with Framer Motion
    onDrag, 
    onDragStart, 
    onDragEnd, 
    onDragEnter, 
    onDragLeave, 
    onDragOver,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    ...props 
  }, ref) => {
    // React hooks MUST be called at top level - cannot be in try-catch
    // useSound will handle missing file gracefully
    const [playClick] = useSound(clickSound, { 
      volume: 0.3,
      // Sprite configuration to prevent errors
      onload: () => console.log('Click sound loaded'),
      onloaderror: () => console.log('Click sound failed to load (file missing)')
    });
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (soundEnabled) {
        try {
          playClick();
        } catch (err) {
          // Silently fail if sound playback fails
        }
      }
      onClick?.(e);
    };

    const MotionButton = motion(Button);

    return (
      <MotionButton
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={className}
        {...props}
      />
    );
  }
);

SoftButton.displayName = "SoftButton";
