import type { PickerViewProps } from "@tarojs/components";
import { useMemoizedFn } from "ahooks";
import React, { useEffect, useState } from "react";

import CascadePicker from "../CascadePicker";

interface T_Props extends PickerViewProps {
  isCascadeData: boolean; //数据源是否是树形结构
  cascadeCount: number; //层级数默认3
  pickerData: Array<any>; //数据源
  modelValue?: Array<any>; //回显内容
  cascadeProps?: { label: string; value: string; children: string }; //配置选项
  customKeyList?: Array<string>; //一级数据转成多级数据对应的key
  resultProps?: Array<string>; //返回结果对象中的属性集合
  disabled?: boolean;
  callback: (e: any) => void;
}

const MultiplePicker: React.FC<T_Props> = (props) => {
  const {
    cascadeCount = 3,
    isCascadeData = false,
    pickerData,
    modelValue,
    cascadeProps = { label: "label", value: "value", children: "children" },
    customKeyList = [],
    resultProps = [],
    disabled = false,
    callback,
  } = props;

  /**
   * label: 指定选项标签为选项对象的某个属性值
   * value:指定选项的值为选项对象的某个属性值
   * children:指定选项的子选项为选项对象的某个属性值
   */
  const { label, value, children } = cascadeProps;

  /**
   * 处理数据
   */
  const [handledData, setHandleData] = useState<any>();

  const handlePickerData = useMemoizedFn(() => {
    if (!pickerData) return;
    let tempHandleData: Array<any> = [];
    pickerData.forEach((elem: any) => {
      let tempList = tempHandleData;
      for (let i = 0; i < customKeyList.length; i++) {
        let index = tempList.findIndex(
          (item: any) => item[label] === elem[customKeyList[i]]
        );
        if (index !== -1) {
          tempList = tempList[index][children];
        } else {
          tempList.push(handleChildren(elem, i));
          break;
        }
      }
    });
    setHandleData(tempHandleData);
  });

  /**
   * 处理添加数据
   * @param elem
   * @param index
   * @returns
   */
  const handleChildren = useMemoizedFn((elem, index) => {
    let key = customKeyList[index];
    let child = {
      [label]: elem[key],
      [value]: elem,
      [children]:
        index < customKeyList.length ? [handleChildren(elem, ++index)] : null,
    };
    return child;
  });

  useEffect(() => {
    if (isCascadeData) {
      setHandleData(pickerData);
    } else {
      handlePickerData();
    }
  }, [handlePickerData, pickerData, isCascadeData]);

  return (
    <CascadePicker
      cascadeCount={cascadeCount}
      handledData={handledData}
      cascadeProps={cascadeProps}
      modelValue={modelValue}
      resultProps={resultProps}
      disabled={disabled}
      className={`${props.className}`}
      callback={(info) => callback(info[info.length - 1])}
    >
      {props.children}
    </CascadePicker>
  );
};
export default MultiplePicker;
