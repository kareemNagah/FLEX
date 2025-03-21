
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface WeeklyFocusProps {
  focusAreas: string[];
}

const WeeklyFocus = ({ focusAreas }: WeeklyFocusProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-chameleon-yellow" />
          Weekly Focus Areas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {focusAreas.map((focus, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="h-6 w-6 rounded-full bg-chameleon-yellow-light flex items-center justify-center flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <span>{focus}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default WeeklyFocus;
