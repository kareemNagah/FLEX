
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AIPlannerController } from '../controllers/AIPlannerController';
import { UserPreferences, AIGeneratedPlan, AIGeneratedPlanResponse } from '../models/AIPlanner';
import { toast } from '@/components/ui/use-toast';
import Navbar from '../components/Navbar';
import PlannerHeader from '../components/ai-planner/PlannerHeader';
import PreferencesForm from '../components/ai-planner/PreferencesForm';
import GeneratedPlan from '../components/ai-planner/GeneratedPlan';

const AIPlanner = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [preferences, setPreferences] = useState<UserPreferences>(
    AIPlannerController.getSamplePreferences()
  );
  const [generatedPlan, setGeneratedPlan] = useState<AIGeneratedPlan | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const generatePlanMutation = useMutation({
    mutationFn: (preferences: UserPreferences) => AIPlannerController.generatePlan(preferences),
    onMutate: () => {
      setIsGenerating(true);
    },
    onSuccess: (response: AIGeneratedPlan) => {
      setGeneratedPlan(response);
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['dailyPlan'] });
      toast({
        title: "Plan Generated!",
        description: "Your personalized schedule is ready to review.",
      });
    },
    onError: (error) => {
      console.error("Error generating plan:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your plan. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });

  const handleGeneratePlan = () => {
    generatePlanMutation.mutate(preferences);
  };

  const savePlan = () => {
    toast({
      title: "Plan Saved!",
      description: "Your personalized schedule has been saved to your dashboard.",
    });
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      <Navbar />
      <div className="container mx-auto py-28 px-4">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <PlannerHeader />

          <PreferencesForm
            preferences={preferences}
            isEditing={isEditing}
            isGenerating={isGenerating}
            onInputChange={handleInputChange}
            onNumberChange={handleNumberChange}
            onGeneratePlan={handleGeneratePlan}
            hasGeneratedPlan={!!generatedPlan}
          />

          {generatedPlan && (
            <GeneratedPlan
              plan={generatedPlan}
              onModify={() => setIsEditing(true)}
              onSave={savePlan}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPlanner;
