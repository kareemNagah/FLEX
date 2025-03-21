
import React from 'react';
import { ScheduleItem as ScheduleItemType } from '../../models/AIPlanner';

interface ScheduleItemProps {
  item: ScheduleItemType;
}

const ScheduleItem = ({ item }: ScheduleItemProps) => {
  return (
    <div 
      className={`p-3 rounded-md border-l-4 flex items-center justify-between ${
        item.priority === 'high' 
          ? 'border-l-chameleon-orange bg-orange-50' 
          : item.priority === 'medium'
          ? 'border-l-chameleon-yellow bg-yellow-50'
          : 'border-l-chameleon-green-light bg-green-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="text-sm font-medium min-w-20">{item.time}</div>
        <div>
          <div className="font-medium">{item.activity}</div>
          <div className="text-xs text-muted-foreground">
            Duration: {item.duration} minutes
          </div>
        </div>
      </div>
      <div className="text-xs px-2 py-1 rounded-full bg-white">
        {item.priority} priority
      </div>
    </div>
  );
};

export default ScheduleItem;
