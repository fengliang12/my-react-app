declare namespace Api {
  namespace ClockIn {
    namespace JoinClockInFlag {
      type FuncT = () => MRP<any>;
    }

    namespace GetClockInActivityDetail {
      type FuncT = (id: string) => MRP<any>;
    }

    namespace SubmitClockInQrCode {
      type FuncT = (data: RequestBody) => MRP<any>;
      interface RequestBody {
        lng: string;
        lat: string;
        code: string;
      }
    }
  }
}
