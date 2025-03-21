
import React from 'react';
import { ScheduleItem as ScheduleItemType } from '../../models/AIPlanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import ScheduleItem from './ScheduleItem';

interface DailyScheduleProps {
  items: ScheduleItemType[];
}

const DailySchedule = ({ items }: DailyScheduleProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-chameleon-green" />
          Your Personalized Daily Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <ScheduleItem key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySchedule;
