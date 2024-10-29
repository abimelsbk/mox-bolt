import React from 'react';
import { Clock, Tag, Briefcase } from 'lucide-react';
import { MentorshipService } from '../types';

interface ServiceCardProps {
  service: MentorshipService;
  onBook: (serviceId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {service.title}
        </h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{service.duration} mins</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Tag className="h-4 w-4 mr-1" />
            <span>{service.price === 0 ? 'Free' : `$${service.price}`}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {service.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => onBook(service.id)}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Book Session
        </button>
      </div>
    </div>
  );
};