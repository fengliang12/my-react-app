declare namespace Api {
  namespace EnclosureStore {
    namespace Public {
      interface StoreItem {
        storeLogo?: string;
        storeAddress?: string;
        storeName?: string;
        storeDistance?: number;
      }
    }
    namespace GetStore {
      interface IRequestBody {}
      interface IResponse {}
    }
  }
}