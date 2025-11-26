/**
 * Gemini AI service for weather-based insights
 * Protected with access key to prevent unauthorized use
 */

const GEMINI_API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;
const ACCESS_KEY = (import.meta as any).env.VITE_ACCESS_KEY; // Secret key for protection
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

type InsightType = 'summary' | 'clothes' | 'activities';

export async function getWeatherInsights(weather: any, type: InsightType = 'summary', userAccessKey?: string): Promise<string> {
  // Access key check - ONLY if both Gemini key AND access key are configured
  // This means local dev (no ACCESS_KEY set) works freely
  // But deployed version (both keys set) requires password
  if (GEMINI_API_KEY && ACCESS_KEY && userAccessKey !== ACCESS_KEY) {
    return "🔒 AI insights require an access key. Contact the site owner for access.";
  }

  if (!GEMINI_API_KEY) {
    return "🔑 Enable AI insights by adding your Gemini API key to .env.local (see README for instructions)";
  }

  // CRITICAL: Get LOCATION'S local time, not device time!
  // e.g., If you're in Australia checking Dubai weather, use Dubai's time!
  const locationTime = new Date(new Date().toLocaleString('en-US', { 
    timeZone: weather.location.timezone 
  }));
  const currentHour = locationTime.getHours();
  
  const isNight = currentHour < 6 || currentHour >= 20;
  const isMorning = currentHour >= 6 && currentHour < 12;
  const isAfternoon = currentHour >= 12 && currentHour < 17;
  const isEvening = currentHour >= 17 && currentHour < 20;
  
  const timeOfDay = isNight ? 'night' : isMorning ? 'morning' : isAfternoon ? 'afternoon' : 'evening';

  const prompts = {
    summary: `Current weather at ${currentHour}:00 (${timeOfDay}): ${weather.current.temp}°C (feels like ${weather.current.feelsLike}°C), ${getWeatherDesc(weather.current.weatherCode)}, humidity ${weather.current.humidity}%, wind ${weather.current.windSpeed}km/h, UV ${weather.current.uvIndex}.

Give a 3-4 sentence summary that mentions the time: "${timeOfDay}" and uses appropriate language for this time.`,

    clothes: `It's ${currentHour}:00 ${timeOfDay}. Temperature: ${weather.current.temp}°C, feels like ${weather.current.feelsLike}°C, ${getWeatherDesc(weather.current.weatherCode)}.

Recommend an outfit for ${timeOfDay} activities in 3-4 sentences. ${isNight ? 'Focus on evening/night wear with warmth.' : isMorning ? 'Focus on morning commute or breakfast wear.' : isAfternoon ? 'Consider sun protection for afternoon sun.' : 'Focus on evening dinner or social wear.'}`,

    activities: `CURRENT TIME: ${currentHour}:00 (${timeOfDay})
Weather: ${weather.current.temp}°C, ${getWeatherDesc(weather.current.weatherCode)}

**CRITICAL: IT IS ${timeOfDay.toUpperCase()}**

${isNight ? 
  '🌙 NIGHT MODE: Only suggest indoor evening/night activities like: cozy restaurants, movie theaters, night bars/cafés, stargazing if clear, indoor games. NO outdoor sports or daytime activities!' : 
  isMorning ? 
  '☀️ MORNING: Suggest breakfast spots, coffee shops, morning walks, early gym, sunrise activities.' :
  isAfternoon ?
  '🌤️ AFTERNOON: Suggest lunch spots, parks, outdoor sports if weather permits, shopping.' :
  '🌆 EVENING: Suggest dinner restaurants, sunset viewing, evening strolls, happy hour spots.'
}

Give 3 specific activities perfect for THIS TIME (${timeOfDay}) in 3-4 sentences.`
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompts[type] }]
        }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 300,
          topP: 0.95,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from AI');
    }
    
    return text.trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // TIME-AWARE FALLBACK RESPONSES
    const temp = weather.current.temp;
    const fallbacks = {
      summary: `${getWeatherEmoji(temp)} It's ${currentHour}:00 ${timeOfDay} with ${temp}°C and ${getWeatherDesc(weather.current.weatherCode).toLowerCase()}. ${
        isNight ? "Perfect evening to stay cozy indoors or enjoy the nightlife! 🌙" :
        isMorning ? "Great start to the day! Morning freshness in the air. ☀️" :
        isAfternoon ? "Afternoon vibes - enjoy the rest of your day! 🌤️" :
        "Beautiful evening ahead! Time to unwind. 🌆"
      } ${temp > 25 ? "Stay hydrated!" : temp < 10 ? "Bundle up warm!" : "Enjoy!"}`,
      
      clothes: `${getClothingEmoji(temp)} For ${temp}°C ${timeOfDay}: ${
        isNight ? 
          (temp > 20 ? "Light evening wear - casual tee and jeans. Sneakers work! 🌙" :
           temp > 10 ? "Evening layers - sweater over shirt, jeans, jacket handy. 🧥" :
           "Warm evening outfit - thick sweater, coat, scarf, warm boots! 🧤") :
        isMorning ?
          (temp > 20 ? "Morning fresh - t-shirt, shorts, comfortable shoes for the commute. ☕" :
           temp > 10 ? "Morning layers - long sleeves, jeans, light jacket. Perfect for breakfast! 👕" :
           "Warm morning bundle - coat, scarf, gloves, boots. Grab that hot coffee! 🧤") :
        isAfternoon ?
          (temp > 25 ? "Light breathable - tank/tee, shorts, sandals, sunglasses essential! 😎" :
           temp > 15 ? "Afternoon casual - t-shirt, jeans, sneakers. Jacket optional. 👕" :
           "Layered afternoon - sweater, jeans, comfortable shoes, coat ready. 🧥") :
        // Evening
          (temp > 20 ? "Evening casual - nice tee, jeans, clean sneakers for dinner. 🌆" :
           temp > 10 ? "Evening smart casual - sweater, jeans, jacket, good shoes. 👔" :
           "Warm evening - thick layers, coat, scarf, boots for night out! 🧥")
      }`,
      
      activities: `${getActivityEmoji(temp)} ${timeOfDay.toUpperCase()} (${currentHour}:00): ${
        isNight ?
          (temp > 15 ? "🌙 Cozy restaurant dinner, evening movie theater, night café with friends, or stargazing if skies are clear!" :
           "🌙 Warm indoor restaurant, movie night, board game café, or hot chocolate at a cozy spot!") :
        isMorning ?
          (temp > 20 ? "☀️ Morning run or walk, outdoor breakfast café, farmers market, or early yoga in the park!" :
           temp > 10 ? "☀️ Coffee shop breakfast, morning walk, gym session, or fresh bakery visit!" :
           "☀️ Warm café breakfast, indoor gym, morning museum visit, or hot beverage spot!") :
        isAfternoon ?
          (temp > 25 ? "🌤️ Beach or pool time, outdoor lunch spot, park picnic, or shaded café!" :
           temp > 15 ? "🌤️ Park stroll, outdoor lunch, bike ride, or afternoon shopping!" :
           "🌤️ Indoor lunch spot, shopping mall, museum, or cozy afternoon tea!") :
        // Evening  
          (temp > 20 ? "🌆 Dinner restaurant, sunset viewing, evening stroll, or rooftop bar!" :
           temp > 10 ? "🌆 Cozy dinner spot, early evening walk, wine bar, or casual pub!" :
           "🌆 Warm restaurant, indoor bar, theater show, or hot meal at favorite spot!")
      }`
    };
    
    return fallbacks[type];
  }
}

// Helper functions for fallbacks
function getWeatherDesc(code: number): string {
  if (code === 0) return 'Clear skies';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy conditions';
  if (code <= 67) return 'Rainy weather';
  if (code <= 77) return 'Snowy conditions';
  if (code <= 86) return 'Rain showers';
  return 'Stormy weather';
}

function getWeatherEmoji(temp: number): string {
  if (temp > 30) return '🔥';
  if (temp > 20) return '☀️';
  if (temp > 10) return '🌤️';
  if (temp > 0) return '❄️';
  return '🥶';
}

function getClothingEmoji(temp: number): string {
  if (temp > 25) return '👕';
  if (temp > 15) return '🧥';
  return '🧤';
}

function getActivityEmoji(temp: number): string {
  if (temp > 20) return '🏃';
  if (temp > 10) return '🚶';
  return '🏠';
}
