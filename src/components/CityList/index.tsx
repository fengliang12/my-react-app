import { Picker, ViewProps } from "@tarojs/components";
import { useCreation, useMemoizedFn } from "ahooks";
import { cloneDeep } from "lodash-es";
import React, { useEffect, useState } from "react";

import api from "@/src/api";

export interface addressInfoType {
  postcode: string;
  province: string;
  city: string;
  district: string;
}
interface propsType extends ViewProps {
  addressInfo?: addressInfoType;
  onChange: (addressInfo: addressInfoType) => void;
}
type addressAreaType = any[][];
let promiseArea: null | Promise<any> = null;
let area: addressAreaType = [];
const OmsAddress: React.FC<propsType> = (props) => {
  const { addressInfo, onChange } = props;
  const { province = "", city = "", district = "" } = addressInfo ?? {};
  //初始化地址信息
  const initArea = useMemoizedFn(async () => {
    area = await getArea();
    let tRange: addressAreaType = [area[0], []];
    handleRange({ tRange });
  });
  useEffect(() => {
    initArea();
  }, [initArea]);
  const [range, setRange] = useState<addressAreaType>([[], []]);
  const [rangeIndex, setRangeIndex] = useState<number[]>([0, 0]);
  const handleRange = useMemoizedFn(
    ({
      tRange = range,
      tRangeIndex = rangeIndex,
      column = 0,
      isDefault = false,
    }) => {
      if (isDefault && !province) return;
      const data: addressAreaType = tRange;
      for (let i = column; i < 1; i++) {
        const { postcode } = data[i][tRangeIndex[i]];
        data[i + 1] = area[i + 1].filter(
          (item: any) => item.parentPostCode === postcode,
        );
        if (isDefault && province) {
          const idx = data[i + 1].findIndex(
            (e: any) => e.name == (i == 0 ? city : district),
          );
          tRangeIndex[i + 1] = idx < 0 ? 0 : idx;
        }
      }
      setRange(cloneDeep(data));
      setRangeIndex(tRangeIndex);
    },
  );
  const range0 = useCreation(() => range[0], [range[0]]);
  const [init, setInit] = useState(false);
  //初始化省市区
  useEffect(() => {
    if (range0.length && !init) {
      setInit(true);
      const idx = range0.findIndex((e: any) => e.name == province);
      handleRange({
        isDefault: true,
        column: 0,
        tRangeIndex: [idx, 0, 0],
      });
    }
  }, [handleRange, init, province, range0]);

  //获取位置
  const getArea = () => {
    if (promiseArea !== null) return promiseArea;
    return (promiseArea = (async () => {
      const { data }: any = await api.common.getZTArea();
      const provinceList = data.filter((item: any) => item.type === "province");
      const cityList = data.filter((item: any) => item.type === "city");
      return Object.freeze([provinceList, cityList]);
    })());
  };

  const handleColumnChange = ({ detail: { column, value } }) => {
    rangeIndex[column] = value;
    for (let i = column; i < rangeIndex.length - 1; i++) {
      rangeIndex[i + 1] = 0;
    }
    handleRange({ tRangeIndex: rangeIndex, column });
  };
  //确认修改
  const handleChange = () => {
    let arr: any = [];
    const { length = 0 } = range;
    for (let i = 0; i < length; i++) {
      const { name } = range[i][rangeIndex[i]];
      arr.push(name);
    }
    onChange({
      postcode: range[length - 1][rangeIndex[length - 1]].postcode,
      province: arr[0],
      city: arr[1],
      district: arr[2],
    });
  };
  return (
    <>
      {range?.[0]?.[0] && (
        <Picker
          mode="multiSelector"
          className={`${props.className}`}
          range={range}
          range-key="name"
          value={rangeIndex}
          onChange={handleChange}
          onColumnChange={handleColumnChange}
        >
          {props.children}
        </Picker>
      )}
    </>
  );
};
export default OmsAddress;
