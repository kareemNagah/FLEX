
import React from 'react';
import { Input } from '@/components/ui/input';
import { LucideIcon } from 'lucide-react';

interface PreferenceFormFieldProps {
  id: string;
  name: string;
  label: string;
  value: string | number;
  type?: string;
  min?: string;
  max?: string;
  step?: string;
  placeholder?: string;
  icon: LucideIcon;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PreferenceFormField = ({
  id,
  name,
  label,
  value,
  type = 'text',
  min,
  max,
  step,
  placeholder,
  icon: Icon,
  onChange
}: PreferenceFormFieldProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium flex items-center gap-1">
        <Icon className="h-4 w-4" />
        {label}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default PreferenceFormField;
