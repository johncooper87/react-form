import React from 'react';

export const ComposerContext = React.createContext();

function Fields({ comp, children }) {

  return <ComposerContext.Provider value={comp}>
    {children}
  </ComposerContext.Provider>;
}

export default React.memo(Fields);