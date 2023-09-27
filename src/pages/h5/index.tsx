import { WebView } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";

import Page from "@/components/Page";

const H5 = () => {
  const router = useRouter();
  console.log("router?.params?.url", router?.params?.url);

  return (
    <Page>
      <WebView src={decodeURIComponent(router?.params?.url as string) || ""} />
    </Page>
  );
};

export default H5;
