
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, CheckCircle } from 'lucide-react';

interface PlanActionsProps {
  onModify: () => void;
  onSave: () => void;
}

const PlanActions = ({ onModify, onSave }: PlanActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button
        variant="outline"
        className="gap-2"
        onClick={onModify}
      >
        <Edit className="h-4 w-4" />
        Modify Plan
      </Button>
      
      <Button 
        onClick={onSave} 
        className="gap-2 bg-chameleon-gradient hover:opacity-90"
      >
        <CheckCircle className="h-4 w-4" />
        Accept & Save
      </Button>
    </div>
  );
};

export default PlanActions;
