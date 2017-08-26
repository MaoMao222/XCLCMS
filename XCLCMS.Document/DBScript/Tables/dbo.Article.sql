CREATE TABLE [dbo].[Article]
(
[ArticleID] [bigint] NOT NULL,
[Code] [varchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[Title] [nvarchar] (200) COLLATE Chinese_PRC_CI_AS NULL,
[SubTitle] [nvarchar] (200) COLLATE Chinese_PRC_CI_AS NULL,
[AuthorName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[FromInfo] [nvarchar] (500) COLLATE Chinese_PRC_CI_AS NULL,
[ArticleContentType] [char] (3) COLLATE Chinese_PRC_CI_AS NOT NULL,
[Contents] [nvarchar] (max) COLLATE Chinese_PRC_CI_AS NULL,
[Summary] [nvarchar] (500) COLLATE Chinese_PRC_CI_AS NULL,
[MainImage1] [bigint] NULL CONSTRAINT [DF__tmp_ms_xx__MainI__15A53433] DEFAULT ((0)),
[MainImage2] [bigint] NULL CONSTRAINT [DF__tmp_ms_xx__MainI__1699586C] DEFAULT ((0)),
[MainImage3] [bigint] NULL CONSTRAINT [DF__tmp_ms_xx__MainI__178D7CA5] DEFAULT ((0)),
[ViewCount] [int] NOT NULL,
[IsCanComment] [char] (1) COLLATE Chinese_PRC_CI_AS NOT NULL,
[CommentCount] [int] NOT NULL,
[GoodCount] [int] NOT NULL,
[MiddleCount] [int] NOT NULL,
[BadCount] [int] NOT NULL,
[HotCount] [int] NOT NULL,
[URLOpenType] [char] (3) COLLATE Chinese_PRC_CI_AS NULL,
[ArticleState] [char] (3) COLLATE Chinese_PRC_CI_AS NOT NULL,
[VerifyState] [char] (3) COLLATE Chinese_PRC_CI_AS NULL,
[IsRecommend] [char] (1) COLLATE Chinese_PRC_CI_AS NULL,
[IsEssence] [char] (1) COLLATE Chinese_PRC_CI_AS NULL,
[IsTop] [char] (1) COLLATE Chinese_PRC_CI_AS NULL,
[TopBeginTime] [datetime] NULL,
[TopEndTime] [datetime] NULL,
[KeyWords] [nvarchar] (100) COLLATE Chinese_PRC_CI_AS NULL,
[Tags] [nvarchar] (100) COLLATE Chinese_PRC_CI_AS NULL,
[Comments] [nvarchar] (500) COLLATE Chinese_PRC_CI_AS NULL,
[LinkUrl] [varchar] (300) COLLATE Chinese_PRC_CI_AS NULL,
[PublishTime] [datetime] NOT NULL,
[FK_MerchantID] [bigint] NOT NULL CONSTRAINT [DF__tmp_ms_xx__FK_Me__1881A0DE] DEFAULT ((0)),
[FK_MerchantAppID] [bigint] NOT NULL CONSTRAINT [DF__tmp_ms_xx__FK_Me__1975C517] DEFAULT ((0)),
[RecordState] [char] (1) COLLATE Chinese_PRC_CI_AS NOT NULL,
[CreateTime] [datetime] NOT NULL,
[CreaterID] [bigint] NOT NULL,
[CreaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[UpdateTime] [datetime] NOT NULL,
[UpdaterID] [bigint] NOT NULL,
[UpdaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
CREATE NONCLUSTERED INDEX [IX_PublishTime] ON [dbo].[Article] ([PublishTime] DESC) ON [PRIMARY]

ALTER TABLE [dbo].[Article] ADD 
CONSTRAINT [PK_Article] PRIMARY KEY CLUSTERED  ([ArticleID]) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Article] ADD CONSTRAINT [AK_UK_CODE_ARTICLE] UNIQUE NONCLUSTERED  ([Code]) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_Code] ON [dbo].[Article] ([Code]) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_Title] ON [dbo].[Article] ([Title]) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_FK_MerchantID] ON [dbo].[Article] ([FK_MerchantID]) ON [PRIMARY]

GO
EXEC sp_addextendedproperty N'MS_Description', '文章表', 'SCHEMA', N'dbo', 'TABLE', N'Article', NULL, NULL
GO

EXEC sp_addextendedproperty N'MS_Description', '内容类型(ArticleContentTypeEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'ArticleContentType'
GO

EXEC sp_addextendedproperty N'MS_Description', 'ArticleID', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'ArticleID'
GO

EXEC sp_addextendedproperty N'MS_Description', '文章状态(ArticleStateEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'ArticleState'
GO

EXEC sp_addextendedproperty N'MS_Description', '所属作者', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'AuthorName'
GO

EXEC sp_addextendedproperty N'MS_Description', '点【差】数', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'BadCount'
GO

EXEC sp_addextendedproperty N'MS_Description', '唯一标识', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'Code'
GO

EXEC sp_addextendedproperty N'MS_Description', '评论数', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'CommentCount'
GO

EXEC sp_addextendedproperty N'MS_Description', '点评', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'Comments'
GO

EXEC sp_addextendedproperty N'MS_Description', '内容正文', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'Contents'
GO

EXEC sp_addextendedproperty N'MS_Description', '创建者ID', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'CreaterID'
GO

EXEC sp_addextendedproperty N'MS_Description', '创建者名', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'CreaterName'
GO

EXEC sp_addextendedproperty N'MS_Description', '创建时间', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'CreateTime'
GO

EXEC sp_addextendedproperty N'MS_Description', '所属应用号', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'FK_MerchantAppID'
GO

EXEC sp_addextendedproperty N'MS_Description', '所属商户号', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'FK_MerchantID'
GO

EXEC sp_addextendedproperty N'MS_Description', '来源', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'FromInfo'
GO

EXEC sp_addextendedproperty N'MS_Description', '点【好】数', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'GoodCount'
GO

EXEC sp_addextendedproperty N'MS_Description', '热度', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'HotCount'
GO

EXEC sp_addextendedproperty N'MS_Description', '是否能够评论(YesNoEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'IsCanComment'
GO

EXEC sp_addextendedproperty N'MS_Description', '是否为精华', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'IsEssence'
GO

EXEC sp_addextendedproperty N'MS_Description', '是否推荐', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'IsRecommend'
GO

EXEC sp_addextendedproperty N'MS_Description', '是否置顶', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'IsTop'
GO

EXEC sp_addextendedproperty N'MS_Description', '关键字(逗号分隔)', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'KeyWords'
GO

EXEC sp_addextendedproperty N'MS_Description', '链接地址(标题仅为链接时)', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'LinkUrl'
GO

EXEC sp_addextendedproperty N'MS_Description', '主图片1ID', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'MainImage1'
GO

EXEC sp_addextendedproperty N'MS_Description', '主图片2ID', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'MainImage2'
GO

EXEC sp_addextendedproperty N'MS_Description', '主图片3ID', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'MainImage3'
GO

EXEC sp_addextendedproperty N'MS_Description', '点【中】数', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'MiddleCount'
GO

EXEC sp_addextendedproperty N'MS_Description', '发布时间', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'PublishTime'
GO

EXEC sp_addextendedproperty N'MS_Description', '记录状态(RecordStateEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'RecordState'
GO

EXEC sp_addextendedproperty N'MS_Description', '子标题', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'SubTitle'
GO

EXEC sp_addextendedproperty N'MS_Description', '概述', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'Summary'
GO

EXEC sp_addextendedproperty N'MS_Description', '标签(逗号分隔)', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'Tags'
GO

EXEC sp_addextendedproperty N'MS_Description', '标题', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'Title'
GO

EXEC sp_addextendedproperty N'MS_Description', '置顶开始时间', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'TopBeginTime'
GO

EXEC sp_addextendedproperty N'MS_Description', '置顶结束时间', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'TopEndTime'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新人ID', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'UpdaterID'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新人名', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'UpdaterName'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新时间', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'UpdateTime'
GO

EXEC sp_addextendedproperty N'MS_Description', '打开方式(URLOpenTypeEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'URLOpenType'
GO

EXEC sp_addextendedproperty N'MS_Description', '审核状态', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'VerifyState'
GO

EXEC sp_addextendedproperty N'MS_Description', '浏览数', 'SCHEMA', N'dbo', 'TABLE', N'Article', 'COLUMN', N'ViewCount'
GO
