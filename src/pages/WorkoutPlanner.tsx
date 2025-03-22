import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AIPlannerController } from '../controllers/AIPlannerController';
import { WorkoutPlanRequest, WorkoutPlan } from '../models/AIPlanner';
import { toast } from '@/components/ui/use-toast';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dumbbell, Loader2 } from 'lucide-react';

const WorkoutPlanner = () => {
  const navigate = useNavigate();
  const [planRequest, setPlanRequest] = useState<WorkoutPlanRequest>(
    AIPlannerController.getSampleWorkoutPlanRequest()
  );
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  const handleInputChange = (field: keyof WorkoutPlanRequest, value: any) => {
    setPlanRequest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: keyof WorkoutPlanRequest, value: string) => {
    // Split by commas and trim whitespace
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setPlanRequest(prev => ({
      ...prev,
      [field]: arrayValue
    }));
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    
    try {
      const plan = await AIPlannerController.generateWorkoutPlan(planRequest);
      setGeneratedPlan(plan);
      setIsEditing(false);
      
      toast({
        title: "Workout Plan Generated!",
        description: "Your personalized workout plan is ready to review.",
      });
    } catch (error) {
      console.error("Error generating workout plan:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "There was an error generating your workout plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const savePlan = () => {
    toast({
      title: "Plan Saved!",
      description: "Your personalized workout plan has been saved to your dashboard.",
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
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Workout Planner</h1>
            <p className="text-lg text-gray-600">
              Generate a personalized workout plan powered by Google's Gemini AI
            </p>
          </div>

          {/* Preferences Form */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-chameleon-green" />
                Your Workout Preferences
              </CardTitle>
              <CardDescription>
                Tell us about your fitness goals and preferences to generate a personalized workout plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`space-y-4 ${!isEditing ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fitness Level */}
                  <div className="space-y-2">
                    <Label htmlFor="fitness_level">Fitness Level</Label>
                    <Select 
                      value={planRequest.fitness_level}
                      onValueChange={(value) => handleInputChange('fitness_level', value)}
                    >
                      <SelectTrigger id="fitness_level">
                        <SelectValue placeholder="Select your fitness level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Workout Days Per Week */}
                  <div className="space-y-2">
                    <Label htmlFor="workout_days_per_week">Workout Days Per Week</Label>
                    <Select 
                      value={planRequest.workout_days_per_week.toString()}
                      onValueChange={(value) => handleInputChange('workout_days_per_week', parseInt(value))}
                    >
                      <SelectTrigger id="workout_days_per_week">
                        <SelectValue placeholder="Select days per week" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7].map(day => (
                          <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Time Per Session */}
                <div className="space-y-2">
                  <Label htmlFor="time_per_session">Time Per Session (minutes)</Label>
                  <Select 
                    value={planRequest.time_per_session.toString()}
                    onValueChange={(value) => handleInputChange('time_per_session', parseInt(value))}
                  >
                    <SelectTrigger id="time_per_session">
                      <SelectValue placeholder="Select time per session" />
                    </SelectTrigger>
                    <SelectContent>
                      {[15, 30, 45, 60, 75, 90, 120].map(time => (
                        <SelectItem key={time} value={time.toString()}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Goals */}
                <div className="space-y-2">
                  <Label htmlFor="goals">Fitness Goals (comma-separated)</Label>
                  <Textarea 
                    id="goals"
                    value={planRequest.goals.join(', ')}
                    onChange={(e) => handleArrayInputChange('goals', e.target.value)}
                    placeholder="e.g., Build muscle, Lose weight, Improve endurance"
                  />
                </div>

                {/* Available Equipment */}
                <div className="space-y-2">
                  <Label htmlFor="available_equipment">Available Equipment (comma-separated)</Label>
                  <Textarea 
                    id="available_equipment"
                    value={planRequest.available_equipment?.join(', ') || ''}
                    onChange={(e) => handleArrayInputChange('available_equipment', e.target.value)}
                    placeholder="e.g., Dumbbells, Barbell, Bench, Resistance bands"
                  />
                </div>

                {/* Preferences */}
                <div className="space-y-2">
                  <Label htmlFor="preferences">Workout Preferences (comma-separated)</Label>
                  <Textarea 
                    id="preferences"
                    value={planRequest.preferences?.join(', ') || ''}
                    onChange={(e) => handleArrayInputChange('preferences', e.target.value)}
                    placeholder="e.g., Compound exercises, HIIT, Supersets"
                  />
                </div>

                {/* Limitations */}
                <div className="space-y-2">
                  <Label htmlFor="limitations">Physical Limitations or Injuries (comma-separated)</Label>
                  <Textarea 
                    id="limitations"
                    value={planRequest.limitations?.join(', ') || ''}
                    onChange={(e) => handleArrayInputChange('limitations', e.target.value)}
                    placeholder="e.g., Lower back pain, Knee injury, Shoulder mobility issues"
                  />
                </div>
              </div>

              {!generatedPlan && (
                <div className="mt-6 flex justify-center">
                  <Button 
                    onClick={generatePlan} 
                    disabled={isGenerating}
                    className="gap-2 bg-chameleon-gradient hover:opacity-90"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Dumbbell className="h-5 w-5" />
                        Generate Workout Plan
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Plan Display */}
          {generatedPlan && (
            <div className="space-y-6 animate-fade-in">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{generatedPlan.title}</CardTitle>
                  <CardDescription>{generatedPlan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Workout Days */}
                    {generatedPlan.workout_days.map((day, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="text-xl font-semibold mb-2">{day.day} - {day.focus}</h3>
                        
                        {/* Warm Up */}
                        {day.warm_up && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-700">Warm Up</h4>
                            <p className="text-gray-600">{day.warm_up}</p>
                          </div>
                        )}
                        
                        {/* Exercises */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-700">Exercises</h4>
                          {day.exercises.map((exercise, exIndex) => (
                            <div key={exIndex} className="border-l-2 border-chameleon-green pl-4 py-2">
                              <h5 className="font-semibold">{exercise.name}</h5>
                              <div className="grid grid-cols-3 gap-2 text-sm mt-1">
                                <div>
                                  <span className="font-medium">Sets:</span> {exercise.sets}
                                </div>
                                <div>
                                  <span className="font-medium">Reps:</span> {exercise.reps}
                                </div>
                                <div>
                                  <span className="font-medium">Rest:</span> {exercise.rest_time}
                                </div>
                              </div>
                              {exercise.description && (
                                <p className="text-gray-600 mt-1">{exercise.description}</p>
                              )}
                              {exercise.instructions && (
                                <div className="mt-2">