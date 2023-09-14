declare namespace Api {
  namespace Counter {
    namespace Public {
      enum Type {
        OFFLINE_STORE,
        ONLINE_FLAG_STORE,
        ONLINE_OTHER_STORE,
      }
      interface Item {
        /** 柜台类型 */
        type: Public.Type | null | any;
        /** 柜台名称 */
        name: string | null;
        /** 柜台BA列表 */
        baList: any[] | null;
      }
    }

    namespace GetCityList {
      type FuncT = () => MRP<Array<Item>>;
      type Item = {
        province: string;
        cityList: string[];
      };
    }
    namespace GetCounterList {
      type FuncT = () => MRP<Array<Public.Item>>;
    }
    namespace GetBaByMarsCode {
      type FuncT = (marsCode: string) => MRP<IResponse>;

      enum Type {
        OFFLINE_STORE,
        ONLINE_FLAG_STORE,
        ONLINE_OTHER_STORE,
      }

      interface IResponse {
        /** 柜台类型 */
        type: Type | null | any;
        /** 柜台名称 */
        name: string | null;
        /** 柜台BA列表 */
        baList: any[] | null;
      }
    }

    /** 获取附近柜台 */
    namespace GetCounterNearList {
      type FuncT = (params: IRequest) => MRP<IResponse>;

      type IRequest = {
        lng?: number;
        lat?: number;
        city?: string;
        cityOrName?: string;
        recommend?: boolean;
        channel?: string;
        type?: string;
        counterCodes?: string[];

        province?: string; // 前端拓展字段
      };

      type IResponse = NearbyCounter[];

      type NearbyCounter = {
        deleted: boolean;
        createTime: any;
        updateTime: string;
        id: string;
        fourCounterCode: string;
        loginPassword: any;
        parentCounterId: any;
        functionalAuthority: any;
        storeAttribute: any;
        putaway: boolean;
        recommend: boolean;
        distance: number;
        detailInfo: DetailInfo;
        address: Address;
        keyType: any;
        position: number[];
        lbsRecommend: boolean;
        openingTime: any;
        order: number;
        channel: any;
        payment: Payment;
        allowCounterGroups: any[];
        wareHouseId: any;
      };

      interface DetailInfo {
        name: string;
        pinyin: any;
        businessHoursStart: string;
        businessHoursEnd: string;
        telephone: string;
        payChannel: any;
        type: string;
        counterType: any;
        orderDeliverType: string[];
        payUrl: any;
        appId: any;
        mchId: any;
        payCode: any;
        payKey: any;
        imageUrl: any;
        imageList: any;
        description: any;
        mapDepartmentId: any;
        managerImage: any;
      }

      interface Address {
        lat: number;
        lng: number;
        country: any;
        area: any;
        province: string;
        city: string;
        county: any;
        street: any;
        address: string;
      }

      interface Payment {
        paymentType: string;
        merchantId: any;
        secretKey: any;
        certificate: any;
        qrCode: any;
      }
    }
  }
}
