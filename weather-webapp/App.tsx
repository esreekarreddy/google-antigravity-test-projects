import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Icons, mapWmoToState, getWeatherDescription } from './constants';
import { fetchWeather, fetchGeocoding } from './services/api';
import { storageService } from './services/storage';
import { WeatherData, WeatherState } from './types';
import WeatherCanvas from './components/WeatherCanvas';
import GlassCard from './components/GlassCard';
import { AIAssistanceCard } from './components/AIAssistanceCard';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [cardRects, setCardRects] = useState<DOMRect[]>([]);
  
  // State Simulation
  const [forcedState, setForcedState] = useState<WeatherState | null>(null);
  
  // Parallax & Scroll State
  const [scrollY, setScrollY] = useState(0);

  // Background Buffering State
  const [currentGradient, setCurrentGradient] = useState('bg-gradient-to-br from-blue-400 to-blue-800');
  const [nextGradient, setNextGradient] = useState('bg-gradient-to-br from-blue-400 to-blue-800');
  const [isCrossFading, setIsCrossFading] = useState(false);

  // Track registered cards for collision
  const rectsRef = useRef<Map<string, DOMRect>>(new Map());

  // Initial Load
  useEffect(() => {
    const loadInitial = async () => {
      const last = storageService.getLastLocation();
      if (last) {
        loadWeather(last.lat, last.lon, last.name);
      } else {
        // Default: Sydney (Beautiful visuals usually)
        loadWeather(-33.8688, 151.2093, "Sydney");
      }
    };
    loadInitial();

    const handleScroll = () => {
        setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const registerCard = (id: string) => (rect: DOMRect) => {
      rectsRef.current.set(id, rect);
      setCardRects(Array.from(rectsRef.current.values()));
  };

  const loadWeather = async (lat: number, lon: number, name: string) => {
    setLoading(true);
    setShowSearch(false);
    try {
      const data = await fetchWeather(lat, lon, name);
      setWeather(data);
      storageService.setLastLocation({ name, lat, lon });
      storageService.addFavorite({ name, lat, lon, lastUsed: Date.now() });
      setForcedState(null); // Reset to live weather on new search
    } catch (err) {
      console.error("Could not load weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    try {
      const results = await fetchGeocoding(searchTerm);
      setSearchResults(results);
    } catch (e) {
      console.error(e);
    }
  };

  const currentState = forcedState || (weather ? mapWmoToState(weather.current.weatherCode, weather.current.isDay) : WeatherState.Sunny);

  // INTELLIGENT TEMPERATURE-AWARE GRADIENT SYSTEM
  const getGradient = (state: WeatherState, temp: number) => {
    // Temperature categories
    const isHot = temp > 30;
    const isWarm = temp > 20 && temp <= 30;
    const isMild = temp > 10 && temp <= 20;
    const isCool = temp > 0 && temp <= 10;
    const isCold = temp <= 0;

    switch (state) {
      case WeatherState.Sunny:
        if (isHot) return 'bg-gradient-to-b from-[#FF6B00] via-[#FF8C00] to-[#FFA500]'; // Hot desert orange
        if (isWarm) return 'bg-gradient-to-b from-[#FFD700] via-[#FFA500] to-[#FF8C00]'; // Warm golden
        if (isMild) return 'bg-gradient-to-b from-[#00A1FF] via-[#0099FF] to-[#66C2FF]'; // Pleasant blue
        if (isCool) return 'bg-gradient-to-b from-[#4A90E2] via-[#5BA3F5] to-[#87CEEB]'; // Cool light blue
        return 'bg-gradient-to-b from-[#6CA6CD] via-[#87CEEB] to-[#B0E0E6]'; // Cold pale blue
      
      case WeatherState.ClearNight:
        if (isWarm) return 'bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]'; // Warm night
        if (isCold) return 'bg-gradient-to-b from-[#000000] via-[#0a1128] to-[#001f3f]'; // Freezing night
        return 'bg-gradient-to-b from-[#020024] via-[#090979] to-[#00d4ff]'; // Normal night
      
      case WeatherState.Cloudy:
        if (isHot) return 'bg-gradient-to-b from-[#8B9DC3] via-[#A8B8D8] to-[#C5D3E8]'; // Hot hazy
        if (isWarm) return 'bg-gradient-to-b from-[#6B7A99] via-[#8896B0] to-[#A5B2C7]'; // Warm overcast
        if (isCold) return 'bg-gradient-to-b from-[#2F4F4F] via-[#3E5A5A] to-[#556B6B]'; // Cold slate
        return 'bg-gradient-to-b from-[#4B5E78] to-[#98A6B8]'; // Normal cloudy
      
      case WeatherState.Rain:
        if (isWarm) return 'bg-gradient-to-b from-[#1F3A5F] via-[#2E4E7E] to-[#3D5A80]'; // Warm rain
        if (isCold) return 'bg-gradient-to-b from-[#0D1B2A] via-[#1B263B] to-[#193448]'; // Freezing rain
        return 'bg-gradient-to-b from-[#141E30] via-[#243B55] to-[#141E30]'; // Normal rain
      
      case WeatherState.Storm:
        if (isHot) return 'bg-gradient-to-b from-[#2C3E50] via-[#34495E] to-[#415B76]'; // Hot storm
        if (isCold) return 'bg-gradient-to-b from-[#000000] via-[#0F1419] to-[#1A1F25]'; // Cold storm
        return 'bg-gradient-to-b from-[#0F2027] via-[#203A43] to-[#2C5364]'; // Normal storm
      
      case WeatherState.Snow:
        if (isMild) return 'bg-gradient-to-b from-[#A8D8EA] via-[#C7E9F0] to-[#E6F9FF]'; // Melting snow
        if (isCold) return 'bg-gradient-to-b from-[#5B9BD5] via-[#7DB9E8] to-[#9FD3F5]'; // Freezing snow
        return 'bg-gradient-to-b from-[#83a4d4] to-[#b6fbff]'; // Normal snow
      
      default:
        return 'bg-gradient-to-b from-[#00A1FF] to-[#66C2FF]';
    }
  };

  // Ambient Glow Color based on state
  const getGlowColor = (state: WeatherState) => {
      switch(state) {
          case WeatherState.Sunny: return 'rgba(255, 200, 0, 0.4)';
          case WeatherState.ClearNight: return 'rgba(100, 100, 200, 0.3)';
          case WeatherState.Cloudy: return 'rgba(150, 150, 150, 0.2)';
          case WeatherState.Rain: return 'rgba(100, 150, 200, 0.3)';
          case WeatherState.Storm: return 'rgba(80, 120, 150, 0.4)';
          case WeatherState.Snow: return 'rgba(180, 220, 255, 0.3)';
          default: return 'rgba(100, 200, 255, 0.3)';
      }
  };

  useEffect(() => {
    const targetGradient = getGradient(currentState, weather?.current.temp || 20);
    if (targetGradient !== currentGradient) {
        setNextGradient(targetGradient);
        setIsCrossFading(true);
        const timer = setTimeout(() => {
            setCurrentGradient(targetGradient);
            setIsCrossFading(false);
        }, 1500); 
        return () => clearTimeout(timer);
    }
  }, [currentState, currentGradient]);

  // Enhanced Celestial Motion
  const celestialPosition = useMemo(() => {
      if (forcedState === WeatherState.Sunny) return { top: '15%', left: '20%', type: 'sun' };
      if (forcedState === WeatherState.ClearNight) return { top: '15%', left: '80%', type: 'moon' };
      if (forcedState) return { top: '-20%', left: '50%', type: 'hidden' }; 

      if (!weather) return { top: '10%', left: '50%', type: 'sun' };
      
      const isDay = weather.current.isDay;
      const hour = new Date().getHours();
      const minutes = new Date().getMinutes();
      const totalMinutes = hour * 60 + minutes;

      let percent = 0;
      if (isDay) {
          const start = 6 * 60; const end = 20 * 60; 
          percent = (totalMinutes - start) / (end - start);
      } else {
          const start = 20 * 60; const end = 30 * 60;
          let effectiveTime = totalMinutes;
          if (effectiveTime < 6 * 60) effectiveTime += 24 * 60;
          percent = (effectiveTime - start) / (end - start);
      }
      
      percent = Math.max(0, Math.min(1, percent));
      const x = percent * 100;
      const y = 15 + 60 * Math.pow(2 * (percent - 0.5), 2);

      return { top: `${y}%`, left: `${x}%`, type: isDay ? 'sun' : 'moon' };
  }, [weather, forcedState]);

  const toggleSimulation = () => {
      const states = [null, WeatherState.Sunny, WeatherState.Rain, WeatherState.Storm, WeatherState.Snow, WeatherState.ClearNight];
      const currentIdx = states.indexOf(forcedState);
      const nextState = states[(currentIdx + 1) % states.length];
      setForcedState(nextState);
  };

  // Helper for 7-day forecast bars
  const getWeeklyExtremes = () => {
      if(!weather) return { min: 0, max: 100, range: 100 };
      const mins = weather.daily.map(d => d.minTemp);
      const maxs = weather.daily.map(d => d.maxTemp);
      const min = Math.min(...mins);
      const max = Math.max(...maxs);
      return { min, max, range: max - min || 1 };
  };

  const { min: weekMin, range: weekRange } = getWeeklyExtremes();

  const ambientGlow = getGlowColor(currentState);

  return (
    <div className="relative min-h-screen w-full text-white selection:bg-white/30">
      
      {/* Background System */}
      <div className={`bg-layer ${currentGradient}`}></div>
      <div className={`bg-layer ${nextGradient} ${isCrossFading ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className="noise-overlay"></div>

      {/* Physics Canvas */}
      <WeatherCanvas weatherState={currentState} cardRects={cardRects} />

      {/* Celestial Body Container */}
      <div 
        className="fixed z-0 pointer-events-none transition-all duration-[2000ms] ease-in-out"
        style={{ 
            top: celestialPosition.top, 
            left: celestialPosition.left,
            opacity: celestialPosition.type === 'hidden' ? 0 : 1,
            transform: `translate(-50%, -50%) translateY(${scrollY * 0.15}px)` // Parallax celestial
        }}
      >
         {celestialPosition.type === 'sun' ? (
             <div className="relative w-64 h-64 flex items-center justify-center">
                 <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-[#FFF7AD] to-[#FFA900] shadow-[0_0_100px_rgba(255,200,0,0.6)] z-10"></div>
                 <div className="absolute w-full h-full spin-slow opacity-30">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
                     <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                 </div>
                 <div className="absolute w-full h-full spin-slow opacity-20 rotate-45">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
                     <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                 </div>
             </div>
         ) : (
            <div className="relative w-40 h-40">
                <div className="w-full h-full rounded-full bg-[#E0E0E0] shadow-[0_0_60px_rgba(255,255,255,0.2)] overflow-hidden relative z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40"></div>
                    <div className="absolute top-[20%] left-[25%] w-[15%] h-[15%] rounded-full bg-black/10 blur-[1px]"></div>
                    <div className="absolute top-[50%] left-[60%] w-[25%] h-[25%] rounded-full bg-black/5 blur-[2px]"></div>
                    <div className="absolute bottom-[20%] left-[30%] w-[10%] h-[10%] rounded-full bg-black/10 blur-[1px]"></div>
                </div>
                <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl scale-125"></div>
            </div>
         )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-2xl flex flex-col gap-8 pb-32">
        
        {/* Navigation Bar */}
        <div className="flex justify-between items-center sticky top-2 z-50">
            <button onClick={() => setShowSearch(true)} className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:bg-white/10 transition active:scale-95 group">
                <Icons.Search className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                <span className="text-sm font-medium opacity-70 group-hover:opacity-100 hidden sm:block">Search</span>
            </button>
            
            <div className={`text-sm font-semibold tracking-widest uppercase opacity-90 drop-shadow-md transition-all duration-500 ${scrollY > 120 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                {weather?.location.name}
            </div>

            <button 
                onClick={toggleSimulation} 
                className={`px-4 py-2 text-xs rounded-full glass-panel transition active:scale-95 font-bold tracking-wider uppercase border-white/20 min-w-[120px] flex justify-center shadow-lg ${forcedState ? 'bg-blue-500/20 border-blue-400/50' : 'hover:bg-white/10'}`}
            >
                {forcedState ? `Demo: ${forcedState}` : 'Live Data'}
            </button>
        </div>

        {/* Hero Section - SMALLER */}
        <div 
            style={{ 
                opacity: Math.max(0, 1 - scrollY / 400), 
                transform: `translateY(${scrollY * 0.4}px) scale(${Math.max(0.9, 1 - scrollY / 1000)})`,
                marginBottom: `${scrollY * 0.1}px`
            }}
            className="will-change-transform origin-top pt-4 perspective-container"
        >
            <GlassCard className="flex flex-col items-center justify-center py-6 px-4 text-center relative overflow-visible max-w-md mx-auto" onRegister={registerCard('hero')}>
                {/* Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-[100px] -z-10 rounded-full transition-colors duration-1000" style={{ backgroundColor: ambientGlow }}></div>

                {loading ? (
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="h-8 w-48 bg-white/10 rounded"></div>
                        <div className="h-32 w-32 bg-white/10 rounded-full blur-xl"></div>
                    </div>
                ) : weather ? (
                    <div className="transform-3d">
                        <div className="text-sm font-medium tracking-widest uppercase drop-shadow-lg mb-1 flex items-center gap-2 justify-center opacity-70">
                             <Icons.MapPin className="w-4 h-4" />
                             {weather.location.name}
                        </div>
                        
                        <div className="relative z-20">
                            <h1 className="text-7xl md:text-8xl leading-none font-thin tracking-tighter text-shadow bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
                                {Math.round(weather.current.temp)}°
                            </h1>
                        </div>
                        
                        <div className="text-xl md:text-2xl font-medium opacity-90 drop-shadow-md tracking-tight mb-1">
                            {getWeatherDescription(weather.current.weatherCode)}
                        </div>
                        
                        <div className="flex gap-4 text-base font-medium opacity-80 mt-1 justify-center">
                            <span className="drop-shadow">H: {Math.round(weather.current.high)}°</span>
                            <span className="drop-shadow">L: {Math.round(weather.current.low)}°</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-xl">Weather Unavailable</div>
                )}
            </GlassCard>
        </div>

        {/* Hourly Strip */}
        {weather && (
            <GlassCard className="p-0 overflow-hidden" onRegister={registerCard('hourly')} noTilt>
                <div className="px-6 py-4 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center gap-2">
                    <Icons.Sun className="w-4 h-4 opacity-60" />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Hourly Forecast</span>
                </div>
                <div className="flex overflow-x-auto gap-0 hide-scrollbar snap-x py-4">
                    {weather.hourly.map((h, i) => (
                        <div key={i} className="flex flex-col items-center min-w-[4.5rem] space-y-4 snap-start p-2 hover:bg-white/5 rounded-xl transition duration-300">
                            <span className="text-sm font-medium opacity-70">
                                {i === 0 ? 'Now' : new Date(h.time).getHours() + (new Date(h.time).getHours() >= 12 ? 'pm' : 'am')}
                            </span>
                            <div className="scale-125 transform transition hover:scale-150 duration-300">
                                {h.weatherCode > 50 ? <Icons.Rain className="w-6 h-6 opacity-90" /> : <Icons.Cloud className="w-6 h-6 opacity-90" />}
                            </div>
                            <span className="text-lg font-bold">{Math.round(h.temp)}°</span>
                        </div>
                    ))}
                </div>
            </GlassCard>
        )}

        {/* Grid Layout */}
        {weather && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 7-Day Forecast (FIXED FLICKERING) */}
                <GlassCard className="h-full p-0 row-span-2" onRegister={registerCard('daily')}>
                    <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
                        <Icons.MapPin className="w-4 h-4 opacity-60" />
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">7-Day Forecast</span>
                    </div>
                    <div className="p-6 space-y-5 transform-3d">
                        {weather.daily.map((d, i) => {
                            // Calculate position based on weekly range
                            const leftPct = ((d.minTemp - weekMin) / weekRange) * 100;
                            const widthPct = ((d.maxTemp - d.minTemp) / weekRange) * 100;
                            
                            return (
                                <div key={i} className="flex justify-between items-center group cursor-default">
                                    <span className="w-12 font-medium text-lg opacity-90">
                                        {i === 0 ? 'Today' : new Date(d.date).toLocaleDateString('en-US', {weekday: 'short'})}
                                    </span>
                                    
                                    <div className="flex-1 flex justify-center opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                                         {d.rainProb > 40 ? <Icons.Rain className="w-6 h-6" /> : (d.maxTemp > 25 ? <Icons.Sun className="w-6 h-6" /> : <Icons.Cloud className="w-6 h-6" />)}
                                    </div>
                                    
                                    <div className="flex items-center space-x-3 w-40">
                                        <span className="opacity-50 text-right w-8 text-sm">{Math.round(d.minTemp)}°</span>
                                        {/* Fixed Gradient Bar */}
                                        <div className="h-1.5 flex-1 bg-black/20 rounded-full overflow-hidden relative">
                                            <div className="absolute inset-y-0 rounded-full bg-gradient-to-r from-blue-300 via-purple-300 to-orange-300 opacity-80 transition-all duration-1000" 
                                                 style={{
                                                    left: `${leftPct}%`,
                                                    width: `${widthPct}%`,
                                                    minWidth: '10%' // ensure visibility
                                                 }}></div>
                                        </div>
                                        <span className="font-bold text-right w-8 text-sm">{Math.round(d.maxTemp)}°</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>

                {/* Details Items - SMALLER */}
                <GlassCard className="flex flex-col justify-between p-4" onRegister={registerCard('uv')}>
                    <div className="flex items-center space-x-2 text-xs opacity-60 uppercase font-bold">
                        <Icons.Sun className="w-4 h-4" /> <span>UV Index</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center py-2">
                        <div className="text-4xl font-bold">{Math.round(weather.current.uvIndex)}</div>
                        <div className="text-sm font-medium opacity-70">{weather.current.uvIndex > 5 ? 'High' : 'Low'}</div>
                    </div>
                    <div className="h-1.5 w-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full">
                        <div className="h-full w-2 bg-white rounded-full shadow-[0_0_10px_black] transform transition-transform duration-1000" style={{ transform: `translateX(${weather.current.uvIndex * 10}px)`}}></div>
                    </div>
                </GlassCard>

                <GlassCard className="flex flex-col justify-between p-4" onRegister={registerCard('wind')}>
                     <div className="flex items-center space-x-2 text-xs opacity-60 uppercase font-bold">
                        <Icons.Wind className="w-4 h-4" /> <span>Wind</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center relative py-2">
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/10 rounded-full flex items-center justify-center">
                            <div className="absolute top-0 text-[9px] font-bold opacity-40">N</div>
                            <div className="absolute right-0 text-[9px] font-bold opacity-40">E</div>
                            <div className="absolute bottom-0 text-[9px] font-bold opacity-40">S</div>
                            <div className="absolute left-0 text-[9px] font-bold opacity-40">W</div>
                            <div className="w-1 h-10 bg-gradient-to-t from-transparent to-red-500 origin-bottom transition-transform duration-700" style={{ transform: `rotate(${weather.current.windDir}deg) translateY(-50%)`}}></div>
                         </div>
                         <div className="text-4xl font-bold flex items-baseline gap-1 relative z-10">
                             {Math.round(weather.current.windSpeed)} <span className="text-lg font-normal opacity-60">km/h</span>
                         </div>
                    </div>
                </GlassCard>

                <GlassCard className="flex flex-col justify-between p-4" onRegister={registerCard('humidity')}>
                    <div className="flex items-center space-x-2 text-xs opacity-60 uppercase font-bold">
                        <Icons.Droplet className="w-4 h-4" /> <span>Humidity</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center py-2">
                        <div className="text-4xl font-bold">{weather.current.humidity}%</div>
                        <div className="text-sm opacity-60 mt-1">Dew point {Math.round(weather.current.temp - (100 - weather.current.humidity)/5)}°</div>
                    </div>
                </GlassCard>

                <GlassCard className="flex flex-col justify-between p-4" onRegister={registerCard('feel')}>
                    <div className="flex items-center space-x-2 text-xs opacity-60 uppercase font-bold">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span>Feels Like</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center py-2">
                        <div className="text-4xl font-bold">{Math.round(weather.current.feelsLike)}°</div>
                        <div className="text-sm opacity-60 mt-1">
                            {weather.current.feelsLike < weather.current.temp ? 'Wind is making it feel cooler.' : 'Humidity is making it feel warmer.'}
                        </div>
                    </div>
                </GlassCard>
            </div>
        )}

        {/* Gemini AI Assistance - AT THE BOTTOM */}
        {weather && <AIAssistanceCard weather={weather} onRegister={registerCard('ai')} />}

      </div>

      {/* Full Screen Search Overlay */}
      {showSearch && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-start justify-center pt-20 p-4 animate-in fade-in duration-300">
              <div className="w-full max-w-lg relative">
                  <button onClick={() => setShowSearch(false)} className="absolute -top-12 right-0 text-white/50 hover:text-white p-2 transition"><Icons.Close className="w-8 h-8"/></button>
                  
                  <h2 className="text-3xl font-bold mb-8 text-center tracking-tight">Weather Search</h2>
                  
                  <form onSubmit={handleSearch} className="mb-8 relative group">
                      <Icons.Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 opacity-40 group-focus-within:opacity-100 transition duration-300 text-blue-400"/>
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="Search city..." 
                        className="w-full bg-white/10 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xl text-white placeholder-white/30 outline-none focus:bg-white/15 focus:border-blue-400/50 transition-all shadow-2xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </form>

                  <div className="flex flex-col space-y-2">
                      {searchResults.map((city) => (
                          <button 
                            key={city.id} 
                            onClick={() => loadWeather(city.latitude, city.longitude, city.name)}
                            className="text-left p-5 rounded-2xl bg-white/5 hover:bg-white/15 transition-all border border-white/5 flex items-center justify-between group animate-in slide-in-from-bottom-4 duration-300 hover:scale-[1.02] hover:shadow-lg"
                          >
                              <div>
                                <div className="text-xl font-bold group-hover:text-blue-300 transition">{city.name}</div>
                                <div className="text-base opacity-50">{city.country} {city.admin1 ? `, ${city.admin1}` : ''}</div>
                              </div>
                              <Icons.MapPin className="w-6 h-6 opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-blue-400" />
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}

export default App;