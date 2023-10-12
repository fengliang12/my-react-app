import { WebView } from "@tarojs/components";
import { useRouter, useShareAppMessage } from "@tarojs/taro";

import Page from "@/components/Page";
import { setShareParams } from "@/src/utils";

const H5 = () => {
  const router = useRouter();

  useShareAppMessage(() => {
    return setShareParams();
  });
  return (
    <Page>
      <WebView src={decodeURIComponent(router?.params?.url as string) || ""} />
    </Page>
  );
};

export default H5;
