import { WorkoutPlan, Exercise } from '../../models/AIPlanner';

interface WorkoutPlanDisplayProps {
  plan: WorkoutPlan;
}

const WorkoutPlanDisplay = ({ plan }: WorkoutPlanDisplayProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{plan.title}</h2>
        <p className="text-muted-foreground mt-2">{plan.description}</p>
      </div>

      <div className="grid gap-6">
        {plan.workout_days.map((day, index) => (
          <div key={index} className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">{day.day} - {day.focus}</h3>
            
            {day.warm_up && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Warm Up</h4>
                <p className="text-muted-foreground">{day.warm_up}</p>
              </div>
            )}

            <div className="space-y-4">
              {day.exercises.map((exercise: Exercise, exIndex: number) => (
                <div key={exIndex} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{exercise.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {exercise.sets} sets × {exercise.reps}
                    </span>
                  </div>
                  
                  {exercise.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {exercise.description}
                    </p>
                  )}
                  
                  <div className="text-sm">
                    <p><span className="font-medium">Rest:</span> {exercise.rest_time}</p>
                    <p><span className="font-medium">Muscle Groups:</span> {exercise.muscle_groups.join(', ')}</p>
                    {exercise.equipment && exercise.equipment.length > 0 && (
                      <p><span className="font-medium">Equipment:</span> {exercise.equipment.join(', ')}</p>
                    )}
                  </div>

                  {exercise.instructions && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Instructions:</p>
                      <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {day.cool_down && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Cool Down</h4>
                <p className="text-muted-foreground">{day.cool_down}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {plan.notes && (
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Additional Notes</h4>
          <p className="text-muted-foreground">{plan.notes}</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanDisplay;