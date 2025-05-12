import { Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useLatest, useMemoizedFn, useSetState, useUpdateEffect } from 'ahooks';
import { assign, cloneDeep, omit, isNil } from 'lodash-es';
import React, {
  CSSProperties,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { layout } from '../../../config/index';
import { getDomId, rpxTopx } from '../../../helper';
import useCountDown from '../../../hooks/useCountDown';
import useHanlder from '../../../hooks/useHanlder';
import usePage from '../../../hooks/usePage';
import useStore from '../../../hooks/useStore';
import useStyle from '../../../hooks/useStyle';
import { LayoutContext } from '../../../index';
import useDynamic from '../../../hooks/useDynamic';

import './index.less';

type ProTextProps = {
  comInfo: Edit.IComponents;
  comIndex: number;
  dynamicInfo?: any
};

type MyContentType = {
  list: string[];
  len: number;
  index: number;
  name: string;
};

const isH5 = process.env.TARO_ENV === 'h5'

const timeCount = 8;
const duration = 400;

const ProText: React.FC<ProTextProps> = ({ comInfo, dynamicInfo }) => {
  const { notices } = useContext(LayoutContext);
  const { updateNodes } = useStore(comInfo);
  const { baseStyle, baseClassName } = useStyle(comInfo);
  const { hanlderEvent } = useHanlder(comInfo, dynamicInfo);
  const { countDownValue, isShowCountDown } = useCountDown(comInfo);
  const { isNowPage } = usePage();
  const { dynamicData } = useDynamic(comInfo, dynamicInfo)
  const [myContent, setMyContent] = useSetState<MyContentType>({
    list: [],
    len: 0,
    index: 0,
    name: ''
  });
  const [noticeStyle, setNoticeStyle] = useState<CSSProperties>({});
  const latestMyContentRef = useLatest(myContent);
  const latestNoticeStyleRef = useLatest(noticeStyle);
  const myContextCountRef = useRef<number>(1);
  const contextClearRef = useRef<any>();
  const noticeClearRef = useRef<any>();
  const noticeRef = useRef<any>();
  const content = useMemo(() => {
    let result: any = comInfo?.text?.nodes
    const dc = dynamicData?.find(x => x.type === 'condition')
    if (dc && !dc.value) {
      return ""
    }
    const dv = dynamicData?.find(x => x.type === 'value')
    if (!isNil(dv?.value)) {
      result = dv.value
    }
    if (!isNil(updateNodes)) {
      result = updateNodes
    }
    return result + '';
  }, [comInfo?.text?.nodes, updateNodes, dynamicData, dynamicInfo]);

  const textStyle = useMemo(() => {
    let result: CSSProperties = cloneDeep(baseStyle);
    assign(result, noticeStyle);
    if (!isShowCountDown) {
      result = assign(result, {
        display: 'none'
      })
    }
    return result ?? {};
  }, [baseStyle, noticeStyle]);

  const computedMyContext = useMemoizedFn(() => {
    if (content?.includes(layout.config.scrollText!)) {
      const list = content.split(layout.config.scrollText!);
      setMyContent({
        list,
        len: list.length,
        index: 0,
        name: 'fadeInUp'
      });
      const fn = () => {
        const latestMyContent = latestMyContentRef.current;
        if (latestMyContent.name === 'fadeInUp') {
          if (myContextCountRef.current >= timeCount) {
            Taro.nextTick(() => setMyContent({ name: 'fadeOutUp' }));
          } else {
            myContextCountRef.current = myContextCountRef.current + 1;
          }
        }
        if (latestMyContent.name === 'fadeOutUp') {
          const nextIndex =
            latestMyContent.index + 1 >= latestMyContent.len ? 0 : latestMyContent.index + 1;
          Taro.nextTick(() =>
            setMyContent({
              name: 'fadeInUp',
              index: nextIndex
            })
          );
          myContextCountRef.current = 1;
        }
        contextClearRef.current = setTimeout(fn, duration);
      };
      contextClearRef.current = setTimeout(fn, duration);
    } else {
      setMyContent({
        list: [(countDownValue ?? content) as string],
        len: 1,
        index: 0,
        name: ''
      });
    }
  });
  const computedNotices = useMemoizedFn(() => {
    const notice = notices?.find(x => x.id === comInfo.id);
    if (notice) {
      noticeRef.current = notice;
      const fn = () => {
        if (latestNoticeStyleRef.current?.left === '100%') {
          Taro.nextTick(() =>
            setNoticeStyle({
              left: rpxTopx(-noticeRef.current?.width),
              transition: `left ${noticeRef.current?.interval}ms linear`
            })
          );
          noticeClearRef.current = setTimeout(fn, noticeRef.current?.interval);
        } else {
          Taro.nextTick(() =>
            setNoticeStyle({
              left: '100%'
            })
          );
          noticeClearRef.current = setTimeout(fn, 100);
        }
      };
      noticeClearRef.current = setTimeout(fn, 100);
    }
  });

  useUpdateEffect(() => {
    if (!isNowPage) {
      if (contextClearRef.current) {
        clearTimeout(contextClearRef.current);
        contextClearRef.current = null;
      }
      if (noticeClearRef.current) {
        clearTimeout(noticeClearRef.current);
        noticeClearRef.current = null;
      }
    }
    if (isNowPage) {
      if (!contextClearRef.current) {
        computedMyContext();
      }
      if (!noticeClearRef.current) {
        computedNotices();
      }
    }
  }, [isNowPage]);

  useEffect(() => {
    computedMyContext();
  }, [content, countDownValue]);

  useEffect(() => {
    computedNotices();
  }, [notices, comInfo]);

  return (
    <>
      <Text
        id={getDomId(comInfo?.id)}
        style={textStyle}
        className={baseClassName}
        {...omit(comInfo?.text, ['nodes'])}
        onClick={hanlderEvent}
        onLongPress={hanlderEvent}
      >
        {myContent?.len === 1 && myContent?.list[0]}
        {myContent?.len > 1 && (
          <Text
            className={isH5 ? '' : myContent.name}
            style={{
              animationFillMode: 'forwards',
              animationDuration: `${duration}ms`,
              display: 'inline-block'
            }}
          >
            {myContent.list[myContent.index]}
          </Text>
        )}
      </Text>
    </>
  );
};

export default ProText;
