import { useContext, useMemo } from 'react';

import { TemplateContext } from '../index';

export default function useInsertSlot({ path }) {
  const { insertSlot, templateCustomData } = useContext(TemplateContext);
  const slot = useMemo(() => {
    let iSlot = insertSlot?.find(x => x.path === path);
    if (iSlot) {
      return {
        index: iSlot.index,
        element: iSlot.getElement?.(iSlot.customData, templateCustomData)
      };
    }
    return null;
  }, [insertSlot, path]);
  return {
    iSlot: slot
  };
}
