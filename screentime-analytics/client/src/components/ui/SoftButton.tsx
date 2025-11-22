import { Button, ButtonProps } from "@/components/ui/button";
import { motion } from "framer-motion";
import useSound from "use-sound";
import { forwardRef } from "react";

// Note: You would need actual sound files in your public/sounds directory
// For now we'll simulate the structure but the sounds won't play without files
// const clickSound = "/sounds/click.mp3"; 

interface SoftButtonProps extends ButtonProps {
  soundEnabled?: boolean;
}

export const SoftButton = forwardRef<HTMLButtonElement, SoftButtonProps>(
  ({ className, onClick, soundEnabled = true, ...props }, ref) => {
    // const [playClick] = useSound(clickSound, { volume: 0.5 });
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (soundEnabled) {
        // playClick();
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
