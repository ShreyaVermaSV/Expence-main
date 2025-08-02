import React from 'react';

export default function AnimatedArrowButton() {
  return (
    <>
    <div className="animate-arrow-left-right p-2">
            <svg className="w-8 h-8 z-10 text-red-600 rotate-90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0l-8 8h6v8h4v-8h6z" />
            </svg>
          </div>
    </>
  );
}
