import React, { Suspense, lazy, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import PageTransition from '../../../components/animations/PageTransition';
import AnimatedStatCard from '../../../components/animations/AnimatedStatCard';
import FluidLoader from '../../../components/loaders/FluidLoader';
import AnimatedNotification from '../../../components/animations/AnimatedNotification';
import useParticleEffect from '../../../hooks/useParticleEffect';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Activity,
  Zap 
} from 'lucide-react';

// Lazy load 3D components for better performance
const ProjectProgress3D = lazy(() => import('../../../components/charts/3d/ProjectProgress3D'));
const RadarChart3D = lazy(() => import('../../../components/charts/3d/RadarChart3D'));

/**
 * Animation Demo Page
 * Showcases all the new animation features
 * This is a reference implementation showing how to use the animation system
 */
const AnimationDemo = () => {
  const { containerRef, triggerParticles } = useParticleEffect();
  const [showNotification, setShowNotification] = useState(false);

  const handleMilestoneClick = () => {
    triggerParticles({
      count: 100,
      colors: ['#0D8ABC', '#10B981', '#F59E0B'],
      duration: 2,
      spread: 150,
    });
  };

  const radarData = [
    { label: 'Quality', value: 85 },
    { label: 'Speed', value: 70 },
    { label: 'Reliability', value: 90 },
    { label: 'Security', value: 95 },
    { label: 'Innovation', value: 75 },
  ];

  return (
    <DashboardLayout role="client" title="Animation Showcase" subtitle="Premium GSAP + Three.js Effects">
      <PageTransition>
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">🎨 Animation System Showcase</h1>
            <p className="text-blue-100 text-lg">
              Premium dashboard effects powered by GSAP, Three.js, and WebGL
            </p>
          </div>

          {/* Animated KPI Cards */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Animated KPI Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedStatCard
                title="Total Revenue"
                value={2500000}
                prefix="$"
                icon={DollarSign}
                trend="up"
                delay={0}
              />
              <AnimatedStatCard
                title="Active Projects"
                value={24}
                icon={Activity}
                trend="up"
                delay={1}
              />
              <AnimatedStatCard
                title="Team Members"
                value={156}
                icon={Users}
                trend="neutral"
                delay={2}
              />
              <AnimatedStatCard
                title="Completion Rate"
                value={94}
                suffix="%"
                icon={CheckCircle}
                trend="up"
                delay={3}
              />
            </div>
          </div>

          {/* 3D Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 3D Project Progress */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3D Project Progress</h2>
              <p className="text-sm text-gray-500 mb-4">
                Interactive 3D cylinders showing project completion. Hover to rotate.
              </p>
              <Suspense fallback={<FluidLoader text="Loading 3D visualization..." />}>
                <div className="grid grid-cols-2 gap-4">
                  <ProjectProgress3D 
                    progress={75} 
                    color="#0D8ABC" 
                    label="API Development"
                    height={250}
                  />
                  <ProjectProgress3D 
                    progress={45} 
                    color="#10B981" 
                    label="UI/UX Design"
                    height={250}
                  />
                </div>
              </Suspense>
            </div>

            {/* 3D Radar Chart */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3D Performance Radar</h2>
              <p className="text-sm text-gray-500 mb-4">
                Rotating 3D radar showing team performance metrics. Drag to control.
              </p>
              <Suspense fallback={<FluidLoader text="Loading 3D chart..." />}>
                <RadarChart3D data={radarData} autoRotate={true} height={350} />
              </Suspense>
            </div>
          </div>

          {/* Particle Effects Demo */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Particle Effects</h2>
            <p className="text-sm text-gray-500 mb-4">
              Celebratory particle explosion for milestone completions
            </p>
            <div 
              ref={containerRef} 
              className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center"
            >
              <button
                onClick={handleMilestoneClick}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Trigger Particles!
              </button>
            </div>
          </div>

          {/* Loading States */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Fluid Loading States</h2>
            <p className="text-sm text-gray-500 mb-4">
              Premium WebGL-powered loading animations
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FluidLoader size={80} color="#0D8ABC" text="Loading..." />
              <FluidLoader size={80} color="#10B981" text="Processing..." />
              <FluidLoader size={80} color="#F59E0B" text="Syncing..." />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Elastic Notifications</h2>
            <p className="text-sm text-gray-500 mb-4">
              Smooth notification pop-ins with elastic easing
            </p>
            <button
              onClick={() => setShowNotification(true)}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show Notification
            </button>
            
            {showNotification && (
              <div className="mt-4">
                <AnimatedNotification 
                  onClose={() => setShowNotification(false)}
                  duration={5000}
                >
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-green-900">Success!</h4>
                        <p className="text-sm text-green-700">
                          This notification will auto-dismiss in 5 seconds with a smooth animation.
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedNotification>
              </div>
            )}
          </div>

          {/* Implementation Notes */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-blue-900 mb-4">💡 Implementation Notes</h2>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>✅ All animations respect <code className="bg-blue-100 px-2 py-1 rounded">prefers-reduced-motion</code></li>
              <li>✅ 3D components are lazy-loaded for optimal performance</li>
              <li>✅ GSAP contexts ensure proper cleanup on unmount</li>
              <li>✅ Smooth 60fps animations with GPU acceleration</li>
              <li>✅ Works on all devices (fallbacks for low-end hardware)</li>
            </ul>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default AnimationDemo;
