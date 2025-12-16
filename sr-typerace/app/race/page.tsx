'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RaceGame } from './RaceGame';
import { Loader2 } from 'lucide-react';

function RaceContent() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get('mode') || 'practice') as 'practice' | 'challenge' | 'vs-computer' | 'vs-friend';

  return <RaceGame mode={mode} />;
}

export default function RacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
        </div>
      }
    >
      <RaceContent />
    </Suspense>
  );
}
