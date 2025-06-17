// Taro.qy;

export interface QyApi {
  /**
   * 获取企业微信派发的临时登录凭证
   *
   * 注意：在企业微信中的小程序，调用wx.qy.login获取到code之后，需要再调用code2Session接口，才真正完成登录流程。
   */
  login(options?: any): Promise<any>;

  /**
   * 校验当前api是否可用
   */
  canIUse(api: string): Promise<boolean>;

  /**
   * 校验用户当前 session_key 是否有效
   *
   * 如果有重新登录，需要调用 jscode2session 接口后，session_key 才会有效
   */
  checkSession(options: any): Promise<any>;

  /**
   * 获取企业微信系统信息
   *
   *  小程序可以企业微信中调用此接口，获得企业微信终端的版本号
   */
  getSystemInfo(options: any): Promise<any>;
  /**
 * 调用该接口可以获得用户是从哪个入口打开页面，从而决定是否可以调用工具栏相关的接口
 *
 *  1. 此接口仅在企业微信3.0.24及以后版本支持，微信端不支持（微信开发者工具也不支持）
    2. 必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
    3. 当前成员必须在应用的可见范围
    4. 从企业微信3.1.6版本开始，所有应用皆可调用，包括自建应用与第三方应用
 */
  getContext(options: any): Promise<any>;

  /**
   * 打开通讯录选人功能
   *
   * 必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
  当前成员必须在应用的可见范围
  */
  selectEnterpriseContact(options: any): Promise<any>;

  /**
   * 打开个人信息页
   *
   * 必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
  当前成员必须在应用的可见范围
  */
  openUserProfile(options: any): Promise<any>;
  /**
   * 获取企业成员基本信息
   *
   *  1、必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态.
   *  2、用户在应用可见范围内时可以静默获取，否则需要用户同意确认。如应用为第三方应用，且需要获取性别敏感信息，则无论是否处于应用可见范围都需要用户同意后才能获取。
   */
  getEnterpriseUserInfo(options: any): Promise<any>;

  /**
 * 获取企业成员头像
 *
 *  1、必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
    2、要求用户在应用可见范围内，且需要用户同意确认
 */
  getAvatar(options: any): Promise<any>;

  /**
 * 获取企业成员个人二维码
 *
 *  1、必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
    2、要求用户在应用可见范围内，且每次调用都需要用户同意确认
 */
  getQrCode(options: any): Promise<any>;

  /**
   * 获取企业成员手机号
   *
   * 1、必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
  2、要求用户在应用可见范围内，且每次调用都需要用户同意确认
  3、获取的是当前企业成员在企业通讯录中的手机号
  4、仅自建应用可调用，代开发应用需要管理员勾选授权了手机号，第三方应用不可调用
  */
  getMobile(options: any): Promise<any>;

  /**
   * 获取企业成员手机号
   *
   *  1、必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
      2、要求用户在应用可见范围内，且每次调用都需要用户同意确认
      3、仅自建应用可调用，代开发应用需要管理员勾选授权了邮箱，第三方应用不可调用
  */
  getEmail(options: any): Promise<any>;

  /**
   * 打开企业互联/局校互联/上下游通讯录选人功能，仅返回应用可见范围内的成员和部门。
   *
      调用前提：
      此接口仅在企业微信3.1.6及以后版本支持，微信端不支持（微信开发者工具也不支持），仅支持ios，android和win端调用
      上下游相关参数仅企业微信3.1.20及以后版本支持，微信端不支持（微信开发者工具也不支持），仅支持ios和android
      必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
  */
  selectCorpGroupContact(options: any): Promise<any>;

  /**
   * 跳转到认领班级的界面
   *
      此接口仅在企业微信3.1.8及以后版本支持
      必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
  */
  claimClassAdmin(options: any): Promise<any>;

  /**
   * 打开会话接口
   *
   *  调用前提：
      必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
      当前成员必须在应用的可见范围。
      externalUserIds由外部联系人选人接口selectExternalContact获得。
      如果创建的会话有微信联系人，群成员人数不能超过40人。
      在企业微信3.0.36及以上的版本，创建会话成功之后，接口会返回chatId。
      在企业微信3.0.36及以上的版本，支持传入chatId打开已有的会话，此时会忽略userIds、externalUserIds与groupName参数。注意：目前仅支持打开客户群，若不是客户群，将报错 unsupported chat.
  */
  selectExternalContact(options: any): void;
  /**
   * 变更群成员接口
   *
   *  调用前提：
      此接口仅在企业微信3.0.36及以后版本支持。
      调用前提：必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态。
      当前成员必须在应用的可见范围，且必须在该群内。
      仅支持往群里添加企业内部成员。
      目前仅支持客户群调用，若不是客户群，将报错 unsupported chat.
  */
  updateEnterpriseChat(options: any): Promise<any>;
  /**
   * 在工具栏或者附件栏向当前会话发送消息，支持多种消息格式，包括文本("text")，图片("image")，视频("video")，文件("file")、H5("news"）和小程序("miniprogram")。
   *
   *  1. 必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
      2. 当前成员必须在应用的可见范围，否则报错：user not in allow list
      3. 需要从特定入口进入页面才可调用，否则会报错：without context of external contact，可先通过调用wx.qy.getContext来判断进入小程序的入口，允许调用的入口说明参见“不同入口所需的权限说明”。
      4. 从不同的入口进入的页面，应用需要满足相应用的权限，否则会报“no permission”错误，所需的权限参见“不同入口所需的权限说明”。
  */
  sendChatMessage(options: any): Promise<any>;

  /**
   * 创建企业互联/上下游会话接口
   *
   *  此接口仅在企业微信3.1.8及以后版本支持
      必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
      当前成员必须在应用的可见范围。
      企业必须开启互联群功能
      仅限企业互联和上下游企业可调用
      如果创建的会话有微信联系人，群成员人数不能超过40人
      上下游及外部联系人仅企业微信3.1.20及以后版本支持
      群人数不能超过2000人
      当前成员为下游企业成员时，上下游空间中的"允许外部单位之间互相查看"需要打开群成员中才可以包含其他下游企业成员
  */
  createCorpGroupChat(options: any): Promise<any>;

  /**
   * 变更企业互联/上下游群成员接口
   *
   *  此接口仅在企业微信3.1.8及以后版本支持
      必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
      当前成员必须在应用的可见范围。
      企业必须开启互联群功能
      仅限企业互联和上下游企业可调用
      如果创建的会话有微信联系人，群成员人数不能超过40人
      上下游及外部联系人仅企业微信3.1.20及以后版本支持
      群人数不能超过2000人
      当前成员为下游企业成员时，上下游空间中的"允许外部单位之间互相查看"需要打开群成员中才可以包含其他下游企业成员
  */
  updateCorpGroupChat(options: any): Promise<any>;

  /**
   * 打开应用管理页面
   */
  openAppManage(options: any): Promise<any>;

  /**
   * 打开 NFC 模块，仅支持安卓系统
   */
  getNFCReaderState(options: any): Promise<any>;

  /**
   * 关闭 NFC 模块，仅支持安卓系统
   */
  stopNFCReader(options: any): Promise<any>;

  /**
   * 启动NFC阅读器
   */
  startNFCReader(options: any): Promise<any>;

  /**
   * 从会话选择文件
   *
   * 必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
  当前成员必须在应用的可见范围
  */
  chooseMessageFile(options: any): Promise<any>;

  /**
   * 外部联系人选人接口
   *
   * 必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
    当前成员必须在应用的可见范围
    仅配置了客户联系功能的用户可调用。
  */
  selectExternalContact(options: any): Promise<any>;

  /**
   * 获取当前外部联系人userid
   *
   * 必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
  当前成员必须在应用的可见范围。
  需要从特定入口进入页面才可调用，否则会报错：without context of external contact，可先通过调用wx.qy.getContext来判断进入小程序的入口，允许调用的入口说明参见“不同入口所需的权限说明”。
  从不同的入口进入的页面，应用需要满足相应用的权限，否则会报“no permission”错误，所需的权限参见“不同入口所需的权限说明”。

  */
  getCurExternalContact(options: any): Promise<any>;

  /**
   * 该接口支持在小程序环境中，具有客户联系权限的企业成员将文本内容和附件传递到群发助手、发送给客户。为了防止滥用，同一个成员每日向一个客户最多可群发一条消息，每次群发最多可选200个客户。

    文本最多支持传入4000个字
    附件最多支持传入9个，类型支持图片(“image”)，视频(“video”)，图文(“link”)，小程序(“miniprogram”)和文件(“file”)
    支持传入文本和多附件的能力，仅在企业微信3.1.6及以后版本支持（mac端暂不支持）（查看旧版本接口调用方式）。微信客户端和微信开发者工具都不支持该接口。
    必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
    当前成员必须在应用的可见范围
    仅配置了客户联系功能的用户可调用
    应用需有客户联系功能权限（第三方应用需具有“企业客户权限->客户基础信息”权限），否则会报“no permission”错误
  */
  shareToExternalContact(options: any): Promise<any>;

  /**
   * 获取当前客户群的群ID

    必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
    当前成员必须在应用的可见范围。
    需要从特定入口进入页面才可调用，否则会报错：without context of external contact，可先通过调用wx.qy.getContext来判断进入小程序的入口，允许调用的入口说明参见“不同入口所需的权限说明”。
    从不同的入口进入的页面，应用需要满足相应的权限，否则会报“no permission”错误，所需的权限参见“不同入口所需的权限说明”。
  */
  getCurExternalChat(options: any): Promise<any>;

  /**
   * 该接口支持在小程序环境中，具有客户联系权限的企业成员将文本内容和附件传递到客户群群发、发送到客户群。
  为了防止滥用，同一个成员每日向一个客户群最多可群发一条消息，每次群发最多可选2000个最近活跃的客户群。

  文本最多支持传入4000个字
  附件最多支持传入9个，类型支持图片(“image”)，视频(“video”)，图文(“link”)，小程序(“miniprogram”)和文件(“file”)
  支持传入文本和多附件的能力，仅在企业微信3.1.6及以后版本支持（mac端暂不支持）（查看旧版本接口调用方式）。微信客户端和微信开发者工具都不支持该接口。
  必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
  当前成员必须在应用的可见范围
  仅配置了客户联系功能的用户可调用
  应用需有客户联系功能权限（第三方应用需具有“企业客户权限->客户基础信息”权限），否则会报“no permission”错误
  */
  shareToExternalChat(options: any): Promise<any>;

  /**
   * 快速跳转到添加客户的界面
   *
   * 必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
    当前成员必须在应用的可见范围
    仅配置了客户联系功能的用户可调用，否则报错：no permission
    应用需有客户联系功能权限（第三方应用需具有“企业客户权限->客户基础信息”权限），否则会报“no permission”错误
    仅企业微信移动端3.0.36版本及以上可用
  */
  navigateToAddCustomer(options: any): Promise<any>;

  /**
   * 具有客户联系权限的企业成员，可通过该接口将文本内容和附件传递到客户朋友圈。当前暂仅支持在企业微信内调用。
   */
  shareToExternalMoments(options: any): Promise<any>;

  /**
   * 具有客户联系权限的企业成员，可通过该接口设置个人的朋友圈封面和签名。当前暂仅支持在企业微信内调用。
   */
  updateMomentsSetting(options: any): Promise<any>;

  /**
   * 此接口用于新建一个文档、表格、收集表、幻灯片或智能表格。
   */
  createDoc(options: any): Promise<any>;
  /**
   * 调用该接口，可唤起选择器窗口，选择一个或多个文档。选中后返回对应文档的url。
   *
   * 必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态。
    当前成员必须在应用的可见范围之中，否则调用时会报“no permission”错误。
    应用需具有文档使用权限，否则调用时会报“no permission”错误。
  */
  wedocSelectDoc(options: any): Promise<any>;

  /**
   * 此接口用于查看企业内成员在指定时间内日程闲忙状态

    必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态。
    当前成员必须在应用的可见范围之中，否则调用时会报“no permission”错误。
    应用需具有日程使用权限，否则调用时会报“no permission”错误。
  */
  checkSchedule(options: any): Promise<any>;

  /**
   * 此接口用于创建快速会议并调起进行中的会议页面。

    此接口仅在企业微信4.0及以后版本支持
    必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
    当前成员必须在应用的可见范围
    应用需具有会议使用权限，见配置可使用会议的应用
  */
  startMeeting(options: any): Promise<any>;

  /**
   * 调用该接口，可唤起微盘选择器窗口，选择目标目录位置。选中后返回用于上传的临时ticket。可用临时ticket调用文件上传接口，以操作用户的名义上传文件至该目录。
   *
   * 必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态。
      当前成员必须在应用的可见范围之中，否则调用时会报“no permission”错误。
      应用需具有微盘使用权限，否则调用时会报“no permission”错误。
      若用户在某一目录位置不具备「上传」权限（微盘权限值为“可下载”/“仅预览”或自定义权限取消勾选“上传”权限），则无法选择该目录。
    */
  wedriveSelectDir(options: any): Promise<any>;

  /**
   * 选择文件
    调用该接口，可唤起微盘选择器窗口，选择一个或多个微盘文件或文档。选中后返回对应文件的url。

    必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态。
    当前成员必须在应用的可见范围之中，否则调用时会报“no permission”错误。
    应用需具有微盘和文档使用权限，否则调用时会报“no permission”错误。
    若用户对某文件不具备「分享」权限（微盘自定义权限取消勾选“分享”权限），则无法选择该文件。
  */
  wedriveSelectFile(options: any): Promise<any>;

  /**
   * 创建立即直播 或 进入

      此接口仅在企业微信3.1.0及以后版本支持
      必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
      当前成员必须在应用的可见范围
      应用需具有直播使用权限，见配置可使用直播的应用
  */
  startLiving(options: any): Promise<any>;

  /**
   * 此接口将调起直播间回放页面

      此接口仅在企业微信3.1.0及以后版本支持
      必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
      当前成员必须在应用的可见范围
      应用需具有直播使用权限，见配置可使用直播的应用

  */
  replayLiving(options: any): Promise<any>;
  /**
   * 此接口将调起直播回放下载页面
   *
  此接口仅在企业微信3.1.0及以后版本支持，且目前仅PC端支持
  必须先调用过wx.qy.login，且session_key未过期，开发者可调用checkSession 检查当前登录态
  当前成员必须在应用的可见范围
  应用需具有直播使用权限。见配置可使用直播的应用
  只允许直播的发起人下载直播回放

  */
  downloadLivingReplay(options: any): Promise<any>;

  /**
   *   打开会话
   *   https://developer.work.weixin.qq.com/document/path/98145
   *
   */
  openEnterpriseChat(options: any): Promise<any>;
}
