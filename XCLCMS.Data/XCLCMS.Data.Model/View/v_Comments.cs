using System;

namespace XCLCMS.Data.Model.View
{   /// <summary>
    /// v_Comments:实体类(属性说明自动提取数据库字段的描述信息)
    /// </summary>
    [Serializable]
    public partial class v_Comments
    {
        public v_Comments()
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
        private long _fk_merchantid;
        private long _fk_merchantappid;
        private string _recordstate;
        private DateTime _createtime;
        private long _createrid;
        private string _creatername;
        private DateTime _updatetime;
        private long _updaterid;
        private string _updatername;
        private string _merchantname;
        private string _merchantappname;

        /// <summary>
        ///
        /// </summary>
        public long CommentsID
        {
            set { _commentsid = value; }
            get { return _commentsid; }
        }

        /// <summary>
        ///
        /// </summary>
        public string ObjectType
        {
            set { _objecttype = value; }
            get { return _objecttype; }
        }

        /// <summary>
        ///
        /// </summary>
        public long? FK_ObjectID
        {
            set { _fk_objectid = value; }
            get { return _fk_objectid; }
        }

        /// <summary>
        ///
        /// </summary>
        public string UserName
        {
            set { _username = value; }
            get { return _username; }
        }

        /// <summary>
        ///
        /// </summary>
        public string Email
        {
            set { _email = value; }
            get { return _email; }
        }

        /// <summary>
        ///
        /// </summary>
        public long ParentCommentID
        {
            set { _parentcommentid = value; }
            get { return _parentcommentid; }
        }

        /// <summary>
        ///
        /// </summary>
        public int GoodCount
        {
            set { _goodcount = value; }
            get { return _goodcount; }
        }

        /// <summary>
        ///
        /// </summary>
        public int MiddleCount
        {
            set { _middlecount = value; }
            get { return _middlecount; }
        }

        /// <summary>
        ///
        /// </summary>
        public int BadCount
        {
            set { _badcount = value; }
            get { return _badcount; }
        }

        /// <summary>
        ///
        /// </summary>
        public string Contents
        {
            set { _contents = value; }
            get { return _contents; }
        }

        /// <summary>
        ///
        /// </summary>
        public string VerifyState
        {
            set { _verifystate = value; }
            get { return _verifystate; }
        }

        /// <summary>
        ///
        /// </summary>
        public string Remark
        {
            set { _remark = value; }
            get { return _remark; }
        }

        /// <summary>
        ///
        /// </summary>
        public long FK_MerchantID
        {
            set { _fk_merchantid = value; }
            get { return _fk_merchantid; }
        }

        /// <summary>
        ///
        /// </summary>
        public long FK_MerchantAppID
        {
            set { _fk_merchantappid = value; }
            get { return _fk_merchantappid; }
        }

        /// <summary>
        ///
        /// </summary>
        public string RecordState
        {
            set { _recordstate = value; }
            get { return _recordstate; }
        }

        /// <summary>
        ///
        /// </summary>
        public DateTime CreateTime
        {
            set { _createtime = value; }
            get { return _createtime; }
        }

        /// <summary>
        ///
        /// </summary>
        public long CreaterID
        {
            set { _createrid = value; }
            get { return _createrid; }
        }

        /// <summary>
        ///
        /// </summary>
        public string CreaterName
        {
            set { _creatername = value; }
            get { return _creatername; }
        }

        /// <summary>
        ///
        /// </summary>
        public DateTime UpdateTime
        {
            set { _updatetime = value; }
            get { return _updatetime; }
        }

        /// <summary>
        ///
        /// </summary>
        public long UpdaterID
        {
            set { _updaterid = value; }
            get { return _updaterid; }
        }

        /// <summary>
        ///
        /// </summary>
        public string UpdaterName
        {
            set { _updatername = value; }
            get { return _updatername; }
        }

        /// <summary>
        ///
        /// </summary>
        public string MerchantName
        {
            set { _merchantname = value; }
            get { return _merchantname; }
        }

        /// <summary>
        ///
        /// </summary>
        public string MerchantAppName
        {
            set { _merchantappname = value; }
            get { return _merchantappname; }
        }

        #endregion Model
    }
}