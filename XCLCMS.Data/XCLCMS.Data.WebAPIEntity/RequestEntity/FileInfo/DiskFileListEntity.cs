using System;
using System.Runtime.Serialization;

namespace XCLCMS.Data.WebAPIEntity.RequestEntity.FileInfo
{
    [DataContract]
    [Serializable]
    public class DiskFileListEntity
    {
        /// <summary>
        /// 当前目录（物理路径）
        /// </summary>
        [DataMember]
        public string CurrentDirectory { get; set; }

        [DataMember]
        public string RootPath { get; set; }

        [DataMember]
        public string WebRootPath { get; set; }
    }
}