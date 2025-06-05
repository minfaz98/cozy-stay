
import React from 'react';
import { Check } from 'lucide-react';

interface RoomFeatureProps {
  title: string;
}

const RoomFeature: React.FC<RoomFeatureProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-2">
      <Check className="h-5 w-5 text-hotel" />
      <span>{title}</span>
    </div>
  );
};

export default RoomFeature;
