
import React from 'react';
import { AIGeneratedPlan } from '../../models/AIPlanner';
import DailySchedule from './DailySchedule';
import WeeklyFocus from './WeeklyFocus';
import SuggestedHabits from './SuggestedHabits';
import PlanActions from './PlanActions';

interface GeneratedPlanProps {
  plan: AIGeneratedPlan;
  onModify: () => void;
  onSave: () => void;
}

const GeneratedPlan = ({ plan, onModify, onSave }: GeneratedPlanProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <DailySchedule items={plan.dailySchedule} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeeklyFocus focusAreas={plan.weeklyFocus} />
        <SuggestedHabits habits={plan.suggestedHabits} />
      </div>

      <PlanActions onModify={onModify} onSave={onSave} />
    </div>
  );
};

export default GeneratedPlan;
