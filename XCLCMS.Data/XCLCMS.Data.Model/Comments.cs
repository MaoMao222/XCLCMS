using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// 评论表
    /// </summary>
    [Serializable]
    public partial class Comments
    {
        public Comments()
        { }

        #region Model

        private long _commentsid;
        private string _objecttype;
        private long? _fk_objectid;
        private string _username;
        private string _email;
        private long _parentcommentid;
        private int _goodcount;
        private int _middlecount;
        private int _badcount;
        private string _contents;
        private string _verifystate;
        private string _remark;
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
        /// CommentsID
        /// </summary>
        public long CommentsID
        {
            set { _commentsid = value; }
            get { return _commentsid; }
        }

        /// <summary>
        /// 被评论对象类别(ObjectTypeEnum)
        /// </summary>
        public string ObjectType
        {
            set { _objecttype = value; }
            get { return _objecttype; }
        }

        /// <summary>
        /// 被评论对象ID
        /// </summary>
        public long? FK_ObjectID
        {
            set { _fk_objectid = value; }
            get { return _fk_objectid; }
        }

        /// <summary>
        /// 评论者名
        /// </summary>
        public string UserName
        {
            set { _username = value; }
            get { return _username; }
        }

        /// <summary>
        /// 评论者电子邮件
        /// </summary>
        public string Email
        {
            set { _email = value; }
            get { return _email; }
        }

        /// <summary>
        /// 上级评论
        /// </summary>
        public long ParentCommentID
        {
            set { _parentcommentid = value; }
            get { return _parentcommentid; }
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
        /// 评论内容
        /// </summary>
        public string Contents
        {
            set { _contents = value; }
            get { return _contents; }
        }

        /// <summary>
        /// 审核状态(VerifyStateEnum)
        /// </summary>
        public string VerifyState
        {
            set { _verifystate = value; }
            get { return _verifystate; }
        }

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark
        {
            set { _remark = value; }
            get { return _remark; }
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