export type NavigationBarHandlePropsType = {
  /**
   * 导航栏背景图
   */
  navBackgroundImage?: string;
  /**
   * 导航栏背景图透明度
   */
  navBackgroundImageLight?: number;
  /**
   * 导航栏标题背景颜色
   */
  navTitleColor?: string;
  /**
   * 导航栏标题文字
   */
  navTitleWord?: string;
  /**
   * 导航栏标题文字颜色
   */
  navTitleWordColor?: string;
  /**
   * 导航栏是否填充
   */
  navFill?: boolean;
};

export type NavigationBarIconNode = ({
  backFn,
  color,
  type,
}: {
  backFn: () => void;
  color: string;
  type: string;
  className: string;
}) => React.ReactNode;

export type CHeaderType = Partial<{
  //是否填充
  fill: boolean;
  //背景图
  backgroundImage: string;
  //背景色
  backgroundColor: string;
  //是否根据页面滚动变化背景透明度
  backgroundColorOpacity: boolean;
  //背景色透明度变化的距离
  backgroundColorOpacityDistance: number;
  //标题图
  titleImage: string;
  //页面标题
  title: string;
  //标题颜色
  titleColor: string;
  //是否显示返回icon
  back: boolean;
  children?: React.ReactNode;
  /** 导航栏样式 */
  titleCss: string;
  /** 导航栏图片宽度 */
  titleImageWidth: number;
  /** 首页路径 */
  homePath: string;
  /**
   * 顶部icon
   */
  IconNode?: NavigationBarIconNode;
  /**
   * 点击调试方法
   */
  toDebug?: () => void;
  /**
   * 背景图透明度
   */
  backgroundImageOpacity?: number;
}>;
