import React from 'react';
import { ClinicalFlowTree } from './ClinicalFlowTree';
import { getProtocolFlow } from '../data/protocolFlows';

const pageClass = 'mx-auto max-w-[72rem] space-y-3 sm:space-y-5 xl:space-y-6';

const ClinicalProtocolFlowView = ({ protocolId, onBack, onCalculatorOpen, onProcedureOpen, onProtocolOpen }) => {
  const flow = getProtocolFlow(protocolId);

  return (
    <div className={pageClass}>
      <ClinicalFlowTree
        protocol={flow}
        onCalculatorOpen={onCalculatorOpen}
        onProcedureOpen={onProcedureOpen}
        onProtocolOpen={onProtocolOpen}
        onBack={onBack}
        backLabel="Protocolos"
        kindLabel="Urgencias hospitalarias"
      />
    </div>
  );
};

export default ClinicalProtocolFlowView;
