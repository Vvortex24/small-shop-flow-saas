
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/20 to-indigo-100/30" />
      
      {/* Moving lights with very low opacity */}
      <div className="absolute inset-0">
        {/* Light 1 */}
        <div className="absolute w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse"
             style={{
               top: '10%',
               left: '20%',
               animation: 'float1 20s ease-in-out infinite'
             }} />
        
        {/* Light 2 */}
        <div className="absolute w-80 h-80 bg-purple-200/8 rounded-full blur-3xl animate-pulse"
             style={{
               top: '60%',
               right: '15%',
               animation: 'float2 25s ease-in-out infinite reverse'
             }} />
        
        {/* Light 3 */}
        <div className="absolute w-72 h-72 bg-cyan-200/6 rounded-full blur-3xl animate-pulse"
             style={{
               bottom: '20%',
               left: '10%',
               animation: 'float3 30s ease-in-out infinite'
             }} />
        
        {/* Light 4 */}
        <div className="absolute w-64 h-64 bg-pink-200/5 rounded-full blur-3xl animate-pulse"
             style={{
               top: '40%',
               left: '70%',
               animation: 'float4 18s ease-in-out infinite reverse'
             }} />
        
        {/* Additional smaller lights */}
        <div className="absolute w-32 h-32 bg-yellow-200/8 rounded-full blur-2xl animate-pulse"
             style={{
               top: '80%',
               right: '40%',
               animation: 'float5 15s ease-in-out infinite'
             }} />
      </div>
      
      {/* Animated particles with very low opacity */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-400/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
