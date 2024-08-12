declare namespace Api {
  namespace Behavior {
    type FuncT = (data: Partial<IRequestBody>) => MRP<any>;
    interface CustomInfos {
      name: string;
      value: string;
    }
    interface IRequestBody {
      channelId: string;
      counterId: string;
      customInfos?: CustomInfos[];
      inValid: false;
      key: string;
      sourceId: string;
      took: 0;
      type: string;
    }
  }
}
