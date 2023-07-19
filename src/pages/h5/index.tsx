import { WebView } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";

import Page from "@/components/Page";

const H5 = () => {
  const router = useRouter();
  return (
    <Page>
      <WebView src={decodeURIComponent(router?.params?.url as string) || ""} />
    </Page>
  );
};

export default H5;
