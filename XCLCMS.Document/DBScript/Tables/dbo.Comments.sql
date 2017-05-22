CREATE TABLE [dbo].[Comments]
(
[CommentsID] [bigint] NOT NULL,
[ObjectType] [char] (3) COLLATE Chinese_PRC_CI_AS NOT NULL,
[FK_ObjectID] [bigint] NULL,
[UserName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[Email] [varchar] (100) COLLATE Chinese_PRC_CI_AS NULL,
[ParentCommentID] [bigint] NOT NULL,
[GoodCount] [int] NOT NULL,
[MiddleCount] [int] NOT NULL,
[BadCount] [int] NOT NULL,
[Contents] [nvarchar] (2000) COLLATE Chinese_PRC_CI_AS NULL,
[VerifyState] [char] (3) COLLATE Chinese_PRC_CI_AS NOT NULL,
[Remark] [nvarchar] (200) COLLATE Chinese_PRC_CI_AS NULL,
[FK_MerchantID] [bigint] NOT NULL CONSTRAINT [DF__tmp_ms_xx__FK_Me__338A9CD5] DEFAULT ((0)),
[FK_MerchantAppID] [bigint] NOT NULL CONSTRAINT [DF__tmp_ms_xx__FK_Me__347EC10E] DEFAULT ((0)),
[RecordState] [char] (1) COLLATE Chinese_PRC_CI_AS NOT NULL,
[CreateTime] [datetime] NOT NULL,
[CreaterID] [bigint] NOT NULL,
[CreaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[UpdateTime] [datetime] NOT NULL,
[UpdaterID] [bigint] NOT NULL,
[UpdaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL
) ON [PRIMARY]
ALTER TABLE [dbo].[Comments] ADD 
CONSTRAINT [PK_COMMENTS] PRIMARY KEY CLUSTERED  ([CommentsID]) ON [PRIMARY]
CREATE NONCLUSTERED INDEX [IX_ObjectType] ON [dbo].[Comments] ([ObjectType]) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_FK_MerchantID] ON [dbo].[Comments] ([FK_MerchantID]) ON [PRIMARY]

GO
EXEC sp_addextendedproperty N'MS_Description', '评论表', 'SCHEMA', N'dbo', 'TABLE', N'Comments', NULL, NULL
GO

EXEC sp_addextendedproperty N'MS_Description', '点【差】数', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'BadCount'
GO

EXEC sp_addextendedproperty N'MS_Description', 'CommentsID', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'CommentsID'
GO

EXEC sp_addextendedproperty N'MS_Description', '评论内容', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'Contents'
GO

EXEC sp_addextendedproperty N'MS_Description', '创建者ID', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'CreaterID'
GO

EXEC sp_addextendedproperty N'MS_Description', '创建者名', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'CreaterName'
GO

EXEC sp_addextendedproperty N'MS_Description', '创建时间', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'CreateTime'
GO

EXEC sp_addextendedproperty N'MS_Description', '评论者电子邮件', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'Email'
GO

EXEC sp_addextendedproperty N'MS_Description', '所属应用号', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'FK_MerchantAppID'
GO

EXEC sp_addextendedproperty N'MS_Description', '所属商户号', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'FK_MerchantID'
GO

EXEC sp_addextendedproperty N'MS_Description', '被评论对象ID', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'FK_ObjectID'
GO

EXEC sp_addextendedproperty N'MS_Description', '点【好】数', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'GoodCount'
GO

EXEC sp_addextendedproperty N'MS_Description', '点【中】数', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'MiddleCount'
GO

EXEC sp_addextendedproperty N'MS_Description', '被评论对象类别(ObjectTypeEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'ObjectType'
GO

EXEC sp_addextendedproperty N'MS_Description', '上级评论', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'ParentCommentID'
GO

EXEC sp_addextendedproperty N'MS_Description', '记录状态(RecordStateEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'RecordState'
GO

EXEC sp_addextendedproperty N'MS_Description', '备注', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'Remark'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新人ID', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'UpdaterID'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新人名', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'UpdaterName'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新时间', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'UpdateTime'
GO

EXEC sp_addextendedproperty N'MS_Description', '评论者名', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'UserName'
GO

EXEC sp_addextendedproperty N'MS_Description', '审核状态(VerifyStateEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Comments', 'COLUMN', N'VerifyState'
GO
