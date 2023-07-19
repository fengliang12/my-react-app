import { CSSProperties } from "react";

interface IPainter {
  customStyle?: string; //	canvas 的自定义样式
  palette?: IPalette; //静态模版，具体规范下文有详细介绍
  scaleRatio?: number; //缩放比，会在传入的 palette 中统一乘以该缩放比，作用和 widthPixels 类似，所以不要同时使用
  widthPixels?: number; //生成的图片的像素宽度，如不传则根据模版动态生成
  dirty?: boolean; //	是否启用脏检查
  LRU?: boolean; //	是否开启 LRU 机制
  dancePalette?: IPalette; //	动态模版，规范同静态模版
  customActionStyle?: ICustomActionStyle; //选择框、缩放图标、删除图标的自定义样式与图片
  action?: IView; //动态编辑内容，用于刷新动态模版
  disableAction?: boolean; //	禁止动态编辑操作
  clearActionBox?: boolean; //	清除动态编辑框
  imgErr?: (e) => void; //	图片生成失败，可以从 e.detail.error 获取错误信息
  imgOk?: (e) => void; //	图片生成成功，可以从 e.detail.path 获取生成的图片路径
  viewUpdate?: (e) => void; //	动态模版， view 被更新，可从 e.detail.view 获取更新的 view
  viewClicked?: (e) => void; //	动态模版， view 被选中， 可从 e.detail.view 获取点击的 view，如为空，则是选中背景
  touchEnd?: (e) => void; //	动态模版，触碰结束。只有 view，代表触碰的对象；包含 view、type、index，代表点击了删除 icon；
  didShow?: (e) => void; //	动态模版，绘制结束时触发
  use2D?: boolean; //	是否使用 canvas2d 接口（注意！使用 use2D 就无法使用 dancePalette 与 action）
}
interface IView {
  type: "rect" | "text" | "image" | "qrcode";
  text?: string;
  url?: string;
  id?: string;
  /** 事实上painter中view的css属性并不完全与CSSProperties一致。 */
  /** 有一些属性painter并不支持，而当你需要开启一些“高级”能力时，属性的使用方式也与css规范不一致。 */
  /** 具体的区别我们将在下方对应的view介绍中详细讲解，在这里使用CSSProperties仅仅是为了让你享受代码提示 */
  css: CSSProperties;
}

interface IPalette {
  background: string; // 整个模版的背景，支持网络图片的链接、纯色和渐变色
  width: string;
  height: string;
  borderRadius: string;
  views: Array<IView>;
}

interface ICustomActionStyle {
  border: string; // 动态编辑选择框的边框样式
  scale: {
    textIcon: string; // 文字view所使用的缩放图标图片
    imageIcon: string; // 图片view所使用的缩放图标图片
  };
  delete: {
    icon: string; // 删除图标图片
  };
}
