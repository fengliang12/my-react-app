import { RichText } from '@tarojs/components';
import { assign, cloneDeep } from 'lodash-es';
import { CSSProperties, useMemo } from 'react';

import { getDomId } from '../../../helper';
import useHanlder from '../../../hooks/useHanlder';
import useStore from '../../../hooks/useStore';
import useStyle from '../../../hooks/useStyle';

type ProRichTextProps = {
  comInfo: Edit.IComponents;
  comIndex: number;
};

const ProRichText: React.FC<ProRichTextProps> = ({ comInfo }) => {
  const { updateNodes } = useStore(comInfo);
  const { baseStyle } = useStyle(comInfo);
  const { hanlderEvent } = useHanlder(comInfo);
  const richTextStyle = useMemo(() => {
    let result: CSSProperties = cloneDeep(baseStyle);
    assign(result, { fontSize: 'initial' });
    return result ?? {};
  }, [baseStyle]);
  const nodes = useMemo(() => {
    return updateNodes || comInfo?.text?.nodes;
  }, [comInfo?.text?.nodes, updateNodes]);
  return (
    <>
      <RichText
        id={getDomId(comInfo?.id)}
        style={richTextStyle}
        nodes={nodes}
        onClick={hanlderEvent}
        onLongPress={hanlderEvent}
      />
    </>
  );
};

export default ProRichText;
