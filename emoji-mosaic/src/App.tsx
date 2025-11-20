import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Download, Sparkles, X, RefreshCw, ChevronRight, Palette, Heart, Droplets, Flame, Sprout, Monitor } from 'lucide-react';
import Webcam from 'react-webcam';
import { generateMosaic } from './lib/image-processing';
import { EMOJI_SETS, type EmojiSetKey } from './lib/emoji-data';
import { cn } from './lib/utils';
import { useAudio } from './hooks/use-audio';
import { AnimatedBackground } from './components/AnimatedBackground';

// Map emoji sets to icons and colors for better UI
const THEME_CONFIG: Record<EmojiSetKey, { icon: React.ElementType, color: string, label: string }> = {
  classic: { icon: Sparkles, color: 'from-yellow-400 to-orange-500', label: 'Classic' },
  nature: { icon: Sprout, color: 'from-green-400 to-emerald-600', label: 'Nature' },
  ocean: { icon: Droplets, color: 'from-blue-400 to-cyan-600', label: 'Ocean' },
  fire: { icon: Flame, color: 'from-red-500 to-orange-600', label: 'Fire' },
  matrix: { icon: Monitor, color: 'from-green-500 to-emerald-400', label: 'Matrix' },
  love: { icon: Heart, color: 'from-pink-500 to-rose-600', label: 'Love' },
};

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [mosaic, setMosaic] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emojiSet, setEmojiSet] = useState<EmojiSetKey>('classic');
  const [density, setDensity] = useState(30);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { playClick, playHover, playSuccess } = useAudio();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playClick();
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setMosaic(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      playClick();
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImage(imageSrc);
        setShowCamera(false);
        setMosaic(null);
      }
    }
  }, [playClick]);

  const handleGenerate = async () => {
    if (!image) return;
    
    playClick();
    setIsProcessing(true);
    setMosaic(null);
    
    try {
      const result = await generateMosaic(image, emojiSet, { density });
      
      setMosaic(result);
      playSuccess();
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mosaic) return;
    playClick();
    const link = document.createElement('a');
    link.download = `emoji-mosaic-${Date.now()}.png`;
    link.href = mosaic;
    link.click();
  };

  return (
    <div className="min-h-screen lg:h-screen text-white selection:bg-primary/30 overflow-x-hidden lg:overflow-hidden font-body flex flex-col">
      <AnimatedBackground />
      
      <header className="container mx-auto px-6 py-4 relative z-10 flex-none">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3 group cursor-pointer">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.2 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              onMouseEnter={playHover}
            >
              ✨
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight font-display">
              Emoji<span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary filter drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">Mosaic</span>
            </h1>
          </div>
        </motion.div>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 pb-6 relative z-10 flex flex-col lg:min-h-0">
        <AnimatePresence mode="wait">
          {!image ? (
            <motion.div 
              key="upload-section"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex items-center justify-center w-full py-8 lg:py-0"
            >
              <div className="w-full max-w-4xl relative aspect-auto min-h-[60vh] lg:aspect-video lg:min-h-0 bg-black/30 rounded-3xl lg:rounded-[2.5rem] overflow-hidden backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 flex flex-col transition-all duration-700 hover:border-white/20">
                
                {/* Soothing Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
                </div>
                
                {showCamera ? (
                  <div className="relative w-full h-full z-20 flex flex-col">
                    <div className="flex-1 relative overflow-hidden rounded-4xl m-4 border border-white/10">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center gap-4 pb-8">
                      <button
                        onClick={capturePhoto}
                        onMouseEnter={playHover}
                        className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        Capture
                      </button>
                      <button
                        onClick={() => setShowCamera(false)}
                        className="bg-black/50 text-white px-6 py-3 rounded-full font-medium hover:bg-black/70 backdrop-blur-md border border-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20">
                    <motion.div 
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-3xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-xl backdrop-blur-md relative overflow-hidden transition-shadow"
                    >
                      <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-white/90 relative z-10 drop-shadow-lg shrink-0" />
                    </motion.div>
                    
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 font-display bg-clip-text text-transparent bg-linear-to-b from-white to-white/50 drop-shadow-sm tracking-tight">
                      Create Magic
                    </h2>
                    <p className="text-white/70 mb-12 text-xl max-w-lg leading-relaxed font-light">
                      Transform your photos into stunning emoji art. <br/>
                      <span className="text-primary font-medium">Drag & drop</span> or capture a moment.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        onMouseEnter={playHover}
                        className="group relative px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 border border-white/10 hover:border-white/30 backdrop-blur-md shadow-lg"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Upload className="w-5 h-5" />
                          Upload Image
                        </span>
                        <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowCamera(true);
                          playClick();
                        }}
                        onMouseEnter={playHover}
                        className="group px-8 py-4 bg-transparent hover:bg-white/5 text-white rounded-2xl font-bold text-lg transition-all border border-white/10 hover:border-white/30 flex items-center justify-center gap-2 backdrop-blur-md hover:scale-105"
                      >
                        <Camera className="w-5 h-5 group-hover:text-secondary transition-colors" />
                        Use Camera
                      </button>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="workspace"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full h-auto lg:h-full grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:min-h-0"
            >
              {/* Preview Area */}
              <div className="relative bg-white/5 rounded-4xl border border-white/10 overflow-hidden backdrop-blur-md flex items-center justify-center p-8 shadow-2xl aspect-square lg:aspect-auto lg:h-full group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent)]" />
                <img 
                  src={mosaic || image} 
                  alt="Preview" 
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setMosaic(null);
                  }}
                  className="absolute top-6 right-6 p-3 bg-black/50 rounded-full hover:bg-red-500/20 hover:text-red-400 backdrop-blur-md border border-white/10 transition-all hover:scale-110 hover:rotate-90 z-20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Controls Sidebar - Responsive */}
              <div className="glass-panel rounded-[2rem] p-6 space-y-6 border border-white/10 bg-black/40 backdrop-blur-xl h-auto lg:h-full flex flex-col lg:overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between flex-none">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-primary/20 to-secondary/20 rounded-xl border border-white/5">
                      <Palette className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold font-display tracking-wide">Studio</h2>
                  </div>
                  <button 
                    onClick={() => {
                      setEmojiSet('classic');
                      setDensity(30);
                      playClick();
                    }}
                    className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full hover:bg-white/10 border border-transparent hover:border-white/10"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                </div>

                <div className="space-y-6 lg:flex-1 lg:overflow-y-auto custom-scrollbar lg:min-h-0 lg:pr-2">
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 mb-4 ml-1">
                      Theme Collection
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(Object.keys(EMOJI_SETS) as EmojiSetKey[]).map((set) => {
                        const config = THEME_CONFIG[set];
                        const Icon = config.icon;
                        const isActive = emojiSet === set;
                        
                        return (
                          <motion.button
                            key={set}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setEmojiSet(set);
                              playClick();
                            }}
                            onMouseEnter={playHover}
                            className={cn(
                              "p-3 rounded-2xl text-left transition-all border relative overflow-hidden group flex flex-col gap-2",
                              isActive 
                                ? "bg-white/10 border-primary/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]" 
                                : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors",
                              isActive ? "bg-linear-to-br " + config.color : "bg-white/10 group-hover:bg-white/20"
                            )}>
                              {isActive ? <Icon className="w-4 h-4 text-white" /> : EMOJI_SETS[set][0]}
                            </div>
                            <div className="flex items-center justify-between w-full">
                              <span className="text-sm font-bold">{config.label}</span>
                              {isActive && <motion.div layoutId="check" className="text-primary"><ChevronRight className="w-4 h-4" /></motion.div>}
                            </div>
                            
                            {isActive && (
                              <motion.div
                                layoutId="active-glow"
                                className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent -z-10"
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mosaic Density */}                 <div className="space-y-4 pt-2">
                    <div className="flex justify-between text-sm">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
                        Mosaic Density
                      </label>
                      <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-md text-xs border border-primary/20">{density}%</span>
                    </div>
                    <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 group hover:border-white/10 transition-colors">
                      <motion.div 
                        className="absolute top-0 left-0 h-full bg-linear-to-r from-primary to-secondary"
                        style={{ width: `${((density - 10) / 40) * 100}%` }}
                      />
                      <input
                        type="range"
                        min="10"
                        max="50"
                        value={density}
                        onChange={(e) => setDensity(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3 flex-none border-t border-white/5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    disabled={!image || isProcessing}
                    onMouseEnter={playHover}
                    className="w-full py-4 bg-linear-to-r from-primary to-secondary rounded-2xl font-bold text-lg shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span className="relative z-10">Generate Magic</span>
                      </>
                    )}
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </motion.button>

                  {mosaic && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownload}
                      onMouseEnter={playHover}
                      className="w-full py-4 bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-all backdrop-blur-md"
                    >
                      <Download className="w-5 h-5" />
                      Download HD
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
