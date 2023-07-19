import type { PickerViewProps } from "@tarojs/components";
import {
  CommonEventFunction,
  Picker,
  PickerMultiSelectorProps,
} from "@tarojs/components";
import { useMemoizedFn } from "ahooks";
import React, { useEffect, useState } from "react";

interface T_Props extends PickerViewProps {
  modelValue?: Array<any>; //回显内容
  cascadeCount: number; //层级数
  handledData: Array<any>; ////数据源，多层级结构
  cascadeProps?: { label: string; value: string; children: string }; //配置选项
  resultProps?: Array<string>; //返回结果对象中的属性集合,如果不填，默认返回cascadeProps.value对于的字符串数组
  noConvertResult?: boolean;
  disabled?: boolean;
  callback: (e: any) => void; //回调函数
}

const CascadePicker: React.FC<T_Props> = React.memo((props) => {
  let {
    cascadeCount = 3,
    modelValue,
    handledData,
    cascadeProps = { label: "label", value: "value", children: "children" },
    resultProps = [],
    noConvertResult = false,
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
   * picker选择
   */
  const [multiIndex, setMultiIndex] = useState<any>(() => {
    return new Array(cascadeCount).fill(0);
  });
  const [multiArray, setMultiArray] = useState<any>(() => {
    return new Array(cascadeCount).fill(0).map(() => []);
  });

  /**
   * 初始化MultiArray
   */
  const initMultiArray = useMemoizedFn(() => {
    let tempMultiArray = new Array(cascadeCount).fill(0).map(() => []);
    let tempMultiIndex = new Array(cascadeCount).fill(0);
    let tempArr: any = null;
    let index: number = 0;
    for (let i = 0; i < cascadeCount; i++) {
      tempMultiArray[i] = tempArr
        ? (tempArr = tempArr?.[index][children])
        : (tempArr = handledData);

      if (modelValue && modelValue?.length > 0) {
        //内容回显
        index = tempArr.findIndex((item) => {
          return item[value] === modelValue?.[i];
        });
        tempMultiIndex[i] = index;
      }
    }
    setMultiIndex(tempMultiIndex);
    setMultiArray(tempMultiArray);
  });

  useEffect(() => {
    if (handledData && handledData?.length > 0) {
      initMultiArray();
    }
  }, [handledData, modelValue, initMultiArray]);

  /**
   * picker选中结果
   * @param param0
   */
  const handleChange: CommonEventFunction<PickerMultiSelectorProps.ChangeEventDetail> =
    useMemoizedFn(({ detail: { value: list } }) => {
      let result: any = null;

      //默认返回cascadeProps.value对于的值
      if (noConvertResult) {
        result = list.map((item, index) => {
          return multiArray[index][item];
        });
      } else if (resultProps.length === 0) {
        result = list.map((item, index) => {
          return multiArray[index][item][value];
        });
      } else {
        //根据resultProps返回对应的对象数组
        result = list.map((item, index) => {
          let tempObj = multiArray[index][item];
          return Object.fromEntries(
            resultProps.map((key) => [key, tempObj[key]])
          );
        });
      }
      callback(result);
    });

  /**
   * 列滚动
   * @param param0
   */
  const handleColumnChange: CommonEventFunction<PickerMultiSelectorProps.ColumnChangeEventDetail> =
    useMemoizedFn(({ detail: { column, value: index } }) => {
      handleMultiIndex(column, index);
      handleMultiArray(column, index);
    });

  /**
   * 处理index
   * @param column
   * @param index
   */
  const handleMultiIndex = useMemoizedFn((column, index) => {
    multiIndex[column] = index;
    for (let i = column + 1; i < cascadeCount; i++) {
      multiIndex[i] = 0;
    }
    setMultiIndex([...multiIndex]);
  });

  /**
   * 处理MultiArray
   */
  const handleMultiArray = useMemoizedFn((column, index) => {
    let arr = multiArray[column][index]?.[children];
    for (let i = column + 1; i < cascadeCount; i++) {
      multiArray[i] = arr;
      arr = arr[0][children];
    }
    setMultiArray([...multiArray]);
  });

  return (
    <Picker
      mode="multiSelector"
      value={multiIndex}
      range={multiArray}
      range-key={label}
      {...props}
      onChange={handleChange}
      onColumnChange={handleColumnChange}
      disabled={disabled}
    >
      {props.children}
    </Picker>
  );
});
export default CascadePicker;
