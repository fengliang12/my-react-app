declare namespace Api {
    namespace Explore {
        /**
         * 清空搜索记录
         */
        namespace ClearSearchKeyword {
            type FuncT = () => MRP<IResponse>

            interface IResponse {
                [prop: string]: any
            }
        }
        /**
         * 获取搜索关键词
         */
        namespace GetSearchKey {
            type FuncT = () => MRP<IResponse>

            interface IResponse {
                [prop: string]: any
            }
        }
        /**
        * 用户转发文章
        */
        namespace UserArticleLike {
            type FuncT = (id: string) => MRP<IResponse>;

            interface IResponse {
                [prop: string]: any
            }
        }
        /** 会员行为记录 */
        namespace MemberBehavior {
            type FuncT = (data: IRequestBody) => MRP<IResponse>;
            interface IRequestBody {
                /** 活动id */
                activityId: string
                /** 行为关键字 */
                key: string
                /** 行为类型 */
                type: string
            }
            interface IResponse {
                [prop: string]: any
            }
        }
        /**
        * 用户点赞文章（取消或点赞）
        */
        namespace UserArticleIsLike {
            type FuncT = (data: IRequestBody) => MRP<IResponse>;
            interface IRequestBody {
                /** id */
                id: string
                /** 是否取消 */
                isLike?: boolean
            }
            interface IResponse {
                [prop: string]: any
            }
        }

        /**
         * 查看用户收藏的帖子
         */
        namespace UserArticleFavorite {
            type FuncT = (data: IRequestBody) => MRP<IResponse>;
            interface IRequestBody {
                /** 页码 */
                page: number,
                /** 页数 */
                size: number
            }

            interface IResponse {
                [prop: string]: any
            }
        }

        /**
      * 查看用户收藏的帖子（取消和收藏）
      */
        namespace UserArticleIsFavorite {
            type FuncT = (data: IRequestBody) => MRP<IResponse>;
            interface IRequestBody {
                /** id */
                id: string
                /** 是否取消 */
                isKeep: boolean
            }
            interface IResponse {
                [prop: string]: any
            }
        }

        /**  查看用户收藏的帖子（批量取消和收藏） */
        namespace ArticleMultiFavorite {
            type FuncT = (data: IRequestBody) => MRP<IResponse>;
            interface IRequestBody {
                /** id */
                articleIds: Array<string>
                /** 是否取消 */
                isKeep: boolean
            }
            interface IResponse {
                [prop: string]: any
            }
        }


        /**
         * 文章列表
         */
        namespace ArticleList {
            type FuncT = (data: IRequestBody) => MRP<IResponse>

            interface IRequestBody {
                /** 关键词 */
                keyword?: string
                /** 分组id */
                groupId?: string
                /** 商品id */
                goodsId?: string
            }

            interface IResponse {
                [prop: string]: any
            }
        }


        /**
      *  查看文章详情
      */
        namespace ArticleDetail {
            type FuncT = (id: string) => MRP<IResponse>;

            interface IResponse {
                [prop: string]: any
            }
        }

        /**
           *  文章分类树
          */
        namespace ArticleTree {
            type FuncT = () => MRP<IResponse>;

            interface IResponse {
                [prop: string]: any
            }
        }

        /**  关键词列表 */
        namespace KeyList {
            type FuncT = () => MRP<IResponse>;

            interface IResponse {
                [prop: string]: any
            }
        }

        /** 查询配置信息 */
        namespace GetConfigPage {
            type FuncT = (code: string) => MRP<IResponse>;

            interface IResponse {
                [prop: string]: any
            }
        }

        /** 查看收藏（商品） */
        namespace CollectGoods {
            type FuncT = () => MRP<IResponse>;
            interface IResponse {
                [prop: string]: any
            }
        }

        /** 删除收藏（商品） */
        namespace DeleteCollectGoods {
            type FuncT = (data: IRequestBody) => MRP<IResponse>;
            interface IRequestBody {
                /** 商品id */
                id: string
            }
            interface IResponse {
                [prop: string]: any
            }
        }

        /** 批量删除收藏（商品） */
        namespace DeleteMultiCollectGoods {
            type FuncT = (data: IRequestBody) => MRP<IResponse>;
            interface IRequestBody {
                /** 商品id */
                skuIds: Array<string>
            }
            interface IResponse {
                [prop: string]: any
            }
        }

         /** 推荐tab详情页 */
        namespace RecommendDetail {
            type FuncT = (type: string) => MRP<IResponse>;

            interface IResponse {
                [prop: string]: any
            }
        }

        /** 探索介绍详情页 */
        namespace IntroductionList {
            type FuncT = () => MRP<IResponse>;
            interface IResponse {
                [prop: string]: any
            }
        }

        /** 批量加购 */
        namespace BatchAppendCart {
            type FuncT = (data: IRequestBody, config?: any) => MRP<IResponse>
            /** 请求参数 Body */
            interface IRequestBody {
                /** 商品数量 */
                quantity: number
                /** sku标识 */
                skuId: string
            }
            /** 返回参数 */
            interface IResponse {
                [prop: string]: any
            }
        }

    }
}
