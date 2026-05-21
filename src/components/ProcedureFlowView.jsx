import React from 'react';
import { ClinicalFlowTree } from './ClinicalFlowTree';
import { getProcedureFlow } from '../data/procedures';

const pageClass = 'mx-auto max-w-[72rem] space-y-3 sm:space-y-5 xl:space-y-6';

const ProcedureFlowView = ({ procedureId, onBack, onCalculatorOpen, onProtocolOpen }) => {
  const flow = getProcedureFlow(procedureId);

  return (
    <div className={pageClass}>
      <ClinicalFlowTree
        protocol={flow}
        onCalculatorOpen={onCalculatorOpen}
        onProtocolOpen={onProtocolOpen}
        onBack={onBack}
        backLabel="Procedimientos"
        kindLabel="Procedimiento"
      />
    </div>
  );
};

export default ProcedureFlowView;
