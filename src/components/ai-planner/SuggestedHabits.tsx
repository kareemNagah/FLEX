
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface SuggestedHabitsProps {
  habits: string[];
}

const SuggestedHabits = ({ habits }: SuggestedHabitsProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-chameleon-orange" />
          Suggested Habits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {habits.map((habit, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-chameleon-orange" />
              <span>{habit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SuggestedHabits;
