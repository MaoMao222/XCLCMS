using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 文章表
    /// </summary>
    [Serializable]
    public partial class Article
    {
        public Article()
        { }

        #region Model

        private long _articleid;
        private string _code;
        private string _title;
        private string _subtitle;
        private string _authorname;
        private string _frominfo;
        private string _articlecontenttype;
        private string _contents;
        private string _summary;
        private long? _mainimage1 = 0;
        private long? _mainimage2 = 0;
        private long? _mainimage3 = 0;
        private int _viewcount;
        private string _iscancomment;
        private int _commentcount;
        private int _goodcount;
        private int _middlecount;
        private int _badcount;
        private int _hotcount;
        private string _urlopentype;
        private string _articlestate;
        private string _verifystate;
        private string _isrecommend;
        private string _isessence;
        private string _istop;
        private DateTime? _topbegintime;
        private DateTime? _topendtime;
        private string _keywords;
        private string _tags;
        private string _comments;
        private string _linkurl;
        private DateTime _publishtime;
        private long _fk_merchantid = 0;
        private long _fk_merchantappid = 0;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;

        /// <summary>
        /// ArticleID
        /// </summary>
        public long ArticleID
        {
            set { _articleid = value; }
            get { return _articleid; }
        }

        /// <summary>
        /// 唯一标识
        /// </summary>
        public string Code
        {
            set { _code = value; }
            get { return _code; }
        }

        /// <summary>
        /// 标题
        /// </summary>
        public string Title
        {
            set { _title = value; }
            get { return _title; }
        }

        /// <summary>
        /// 子标题
        /// </summary>
        public string SubTitle
        {
            set { _subtitle = value; }
            get { return _subtitle; }
        }

        /// <summary>
        /// 所属作者
        /// </summary>
        public string AuthorName
        {
            set { _authorname = value; }
            get { return _authorname; }
        }

        /// <summary>
        /// 来源
        /// </summary>
        public string FromInfo
        {
            set { _frominfo = value; }
            get { return _frominfo; }
        }

        /// <summary>
        /// 内容类型(ArticleContentTypeEnum)
        /// </summary>
        public string ArticleContentType
        {
            set { _articlecontenttype = value; }
            get { return _articlecontenttype; }
        }

        /// <summary>
        /// 内容正文
        /// </summary>
        public string Contents
        {
            set { _contents = value; }
            get { return _contents; }
        }

        /// <summary>
        /// 概述
        /// </summary>
        public string Summary
        {
            set { _summary = value; }
            get { return _summary; }
        }

        /// <summary>
        /// 主图片1ID
        /// </summary>
        public long? MainImage1
        {
            set { _mainimage1 = value; }
            get { return _mainimage1; }
        }

        /// <summary>
        /// 主图片2ID
        /// </summary>
        public long? MainImage2
        {
            set { _mainimage2 = value; }
            get { return _mainimage2; }
        }

        /// <summary>
        /// 主图片3ID
        /// </summary>
        public long? MainImage3
        {
            set { _mainimage3 = value; }
            get { return _mainimage3; }
        }

        /// <summary>
        /// 浏览数
        /// </summary>
        public int ViewCount
        {
            set { _viewcount = value; }
            get { return _viewcount; }
        }

        /// <summary>
        /// 是否能够评论(YesNoEnum)
        /// </summary>
        public string IsCanComment
        {
            set { _iscancomment = value; }
            get { return _iscancomment; }
        }

        /// <summary>
        /// 评论数
        /// </summary>
        public int CommentCount
        {
            set { _commentcount = value; }
            get { return _commentcount; }
        }

        /// <summary>
        /// 点【好】数
        /// </summary>
        public int GoodCount
        {
            set { _goodcount = value; }
            get { return _goodcount; }
        }

        /// <summary>
        /// 点【中】数
        /// </summary>
        public int MiddleCount
        {
            set { _middlecount = value; }
            get { return _middlecount; }
        }

        /// <summary>
        /// 点【差】数
        /// </summary>
        public int BadCount
        {
            set { _badcount = value; }
            get { return _badcount; }
        }

        /// <summary>
        /// 热度
        /// </summary>
        public int HotCount
        {
            set { _hotcount = value; }
            get { return _hotcount; }
        }

        /// <summary>
        /// 打开方式(URLOpenTypeEnum)
        /// </summary>
        public string URLOpenType
        {
            set { _urlopentype = value; }
            get { return _urlopentype; }
        }

        /// <summary>
        /// 文章状态(ArticleStateEnum)
        /// </summary>
        public string ArticleState
        {
            set { _articlestate = value; }
            get { return _articlestate; }
        }

        /// <summary>
        /// 审核状态
        /// </summary>
        public string VerifyState
        {
            set { _verifystate = value; }
            get { return _verifystate; }
        }

        /// <summary>
        /// 是否推荐
        /// </summary>
        public string IsRecommend
        {
            set { _isrecommend = value; }
            get { return _isrecommend; }
        }

        /// <summary>
        /// 是否为精华
        /// </summary>
        public string IsEssence
        {
            set { _isessence = value; }
            get { return _isessence; }
        }

        /// <summary>
        /// 是否置顶
        /// </summary>
        public string IsTop
        {
            set { _istop = value; }
            get { return _istop; }
        }

        /// <summary>
        /// 置顶开始时间
        /// </summary>
        public DateTime? TopBeginTime
        {
            set { _topbegintime = value; }
            get { return _topbegintime; }
        }

        /// <summary>
        /// 置顶结束时间
        /// </summary>
        public DateTime? TopEndTime
        {
            set { _topendtime = value; }
            get { return _topendtime; }
        }

        /// <summary>
        /// 关键字(逗号分隔)
        /// </summary>
        public string KeyWords
        {
            set { _keywords = value; }
            get { return _keywords; }
        }

        /// <summary>
        /// 标签(逗号分隔)
        /// </summary>
        public string Tags
        {
            set { _tags = value; }
            get { return _tags; }
        }

        /// <summary>
        /// 点评
        /// </summary>
        public string Comments
        {
            set { _comments = value; }
            get { return _comments; }
        }

        /// <summary>
        /// 链接地址(标题仅为链接时)
        /// </summary>
        public string LinkUrl
        {
            set { _linkurl = value; }
            get { return _linkurl; }
        }

        /// <summary>
        /// 发布时间
        /// </summary>
        public DateTime PublishTime
        {
            set { _publishtime = value; }
            get { return _publishtime; }
        }

        /// <summary>
        /// 所属商户号
        /// </summary>
        public long FK_MerchantID
        {
            set { _fk_merchantid = value; }
            get { return _fk_merchantid; }
        }

        /// <summary>
        /// 所属应用号
        /// </summary>
        public long FK_MerchantAppID
        {
            set { _fk_merchantappid = value; }
            get { return _fk_merchantappid; }
        }

        /// <summary>
        /// 记录状态(RecordStateEnum)
        /// </summary>
        public string RecordState
        {
            set { _recordstate = value; }
            get { return _recordstate; }
        }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime
        {
            set { _createtime = value; }
            get { return _createtime; }
        }

        /// <summary>
        /// 创建者ID
        /// </summary>
        public long CreaterID
        {
            set { _createrid = value; }
            get { return _createrid; }
        }

        /// <summary>
        /// 创建者名
        /// </summary>
        public string CreaterName
        {
            set { _creatername = value; }
            get { return _creatername; }
        }

        /// <summary>
        /// 更新时间
        /// </summary>
        public DateTime UpdateTime
        {
            set { _updatetime = value; }
            get { return _updatetime; }
        }

        /// <summary>
        /// 更新人ID
        /// </summary>
        public long UpdaterID
        {
            set { _updaterid = value; }
            get { return _updaterid; }
        }

        /// <summary>
        /// 更新人名
        /// </summary>
        public string UpdaterName
        {
            set { _updatername = value; }
            get { return _updatername; }
        }

        #endregion Model
    }
}