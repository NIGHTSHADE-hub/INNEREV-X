import React from 'react';
import { PipelineStage } from '../types';
import { Scan, Scissors, FileText, BrainCircuit, Database } from 'lucide-react';

interface PipelineVisualizerProps {
  currentStage: PipelineStage;
}

const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ currentStage }) => {
  const steps = [
    { id: PipelineStage.YOLO_DETECTION, label: 'YOLO v8', icon: Scan, desc: 'Detecting text regions' },
    { id: PipelineStage.CROPPING, label: 'Cropping', icon: Scissors, desc: 'Cropping detected text' },
    { id: PipelineStage.TROCR_RECOGNITION, label: 'TrOCR', icon: FileText, desc: 'Optical Character Recognition' },
    { id: PipelineStage.LLM_STRUCTURING, label: 'LLM', icon: BrainCircuit, desc: 'Structuring Data' },
    { id: PipelineStage.DB_FILLING, label: 'Database', icon: Database, desc: 'Filling Database' },
  ];

  const getStepStatus = (stepId: PipelineStage) => {
    const stageOrder = [
      PipelineStage.IDLE,
      PipelineStage.YOLO_DETECTION,
      PipelineStage.CROPPING,
      PipelineStage.TROCR_RECOGNITION,
      PipelineStage.LLM_STRUCTURING,
      PipelineStage.DB_FILLING,
      PipelineStage.COMPLETE
    ];
    
    const currentIndex = stageOrder.indexOf(currentStage);
    const stepIndex = stageOrder.indexOf(stepId);

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 text-center">AI Processing Pipeline</h3>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
        {/* Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -z-0 -translate-y-8" />

        {steps.map((step) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          
          let colorClass = "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-700"; // Pending
          if (status === 'active') colorClass = "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/20";
          if (status === 'completed') colorClass = "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-500";

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center w-full md:w-1/5 transition-all duration-300">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${colorClass} transition-all duration-500 mb-3`}>
                <Icon size={24} />
              </div>
              <div className="text-center">
                <p className={`font-bold text-sm ${status === 'active' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 h-4">
                  {status === 'active' ? step.desc : ''}
                </p>
              </div>
              
              {/* Mobile Connector Arrow */}
              <div className="md:hidden h-6 w-0.5 bg-slate-200 dark:bg-slate-700 my-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineVisualizer;