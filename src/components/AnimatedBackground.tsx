
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
      
      {/* Moving lights */}
      <div className="absolute inset-0">
        {/* Light 1 */}
        <div className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"
             style={{
               top: '10%',
               left: '20%',
               animation: 'float1 20s ease-in-out infinite'
             }} />
        
        {/* Light 2 */}
        <div className="absolute w-80 h-80 bg-purple-500/25 rounded-full blur-3xl animate-pulse"
             style={{
               top: '60%',
               right: '15%',
               animation: 'float2 25s ease-in-out infinite reverse'
             }} />
        
        {/* Light 3 */}
        <div className="absolute w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"
             style={{
               bottom: '20%',
               left: '10%',
               animation: 'float3 30s ease-in-out infinite'
             }} />
        
        {/* Light 4 */}
        <div className="absolute w-64 h-64 bg-pink-500/15 rounded-full blur-3xl animate-pulse"
             style={{
               top: '40%',
               left: '70%',
               animation: 'float4 18s ease-in-out infinite reverse'
             }} />
        
        {/* Additional smaller lights */}
        <div className="absolute w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"
             style={{
               top: '80%',
               right: '40%',
               animation: 'float5 15s ease-in-out infinite'
             }} />
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.1); }
          50% { transform: translate(-20px, -60px) scale(0.9); }
          75% { transform: translate(-40px, -20px) scale(1.05); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 40px) scale(1.15); }
          66% { transform: translate(20px, -50px) scale(0.85); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -80px) scale(1.2); }
        }
        
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-50px, 30px) scale(0.9); }
          75% { transform: translate(40px, -40px) scale(1.1); }
        }
        
        @keyframes float5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 50px) scale(1.3); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
