import React from 'react';
import { UserIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

const ChatMessage = ({ message, isAi }) => {
  return (
    <div
      className={`max-w-4xl mx-auto flex items-start space-x-3 p-4 rounded-xl transition-all duration-200 ${
        isAi ? 'bg-blue-50 hover:bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'
      } shadow-sm`}
    >
      <div
        className={`flex-shrink-0 rounded-full p-2 ${
          isAi ? 'bg-blue-100' : 'bg-green-100'
        }`}
      >
        {isAi ? (
          <ComputerDesktopIcon className="h-5 w-5 text-blue-600" />
        ) : (
          <UserIcon className="h-5 w-5 text-green-600" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <p
          className={`font-semibold text-sm ${
            isAi ? 'text-blue-800' : 'text-green-800'
          }`}
        >
          {isAi ? 'AI Assistant' : 'You'}
        </p>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {message}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;