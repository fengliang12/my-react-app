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
  }
}
