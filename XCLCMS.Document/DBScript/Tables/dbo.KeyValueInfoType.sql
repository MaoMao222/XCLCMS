CREATE TABLE [dbo].[KeyValueInfoType]
(
[FK_KeyValueInfoID] [bigint] NOT NULL,
[FK_TypeID] [bigint] NOT NULL,
[RecordState] [char] (1) COLLATE Chinese_PRC_CI_AS NOT NULL,
[CreateTime] [datetime] NOT NULL,
[CreaterID] [bigint] NOT NULL,
[CreaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[UpdateTime] [datetime] NOT NULL,
[UpdaterID] [bigint] NOT NULL,
[UpdaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[KeyValueInfoType] ADD CONSTRAINT [AK_KEY_1_KEYVALUE] UNIQUE NONCLUSTERED  ([FK_KeyValueInfoID], [FK_TypeID]) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [IX_KeyValueInfoID] ON [dbo].[KeyValueInfoType] ([FK_KeyValueInfoID]) ON [PRIMARY]
GO
EXEC sp_addextendedproperty N'MS_Description', '自由数据存储类别关系表', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfoType', NULL, NULL
GO
EXEC sp_addextendedproperty N'MS_Description', '创建者ID', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfoType', 'COLUMN', N'CreaterID'
GO
EXEC sp_addextendedproperty N'MS_Description', '创建者名', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfoType', 'COLUMN', N'CreaterName'
GO
EXEC sp_addextendedproperty N'MS_Description', '创建时间', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfoType', 'COLUMN', N'CreateTime'
GO
EXEC sp_addextendedproperty N'MS_Description', '文章 ID', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfoType', 'COLUMN', N'FK_KeyValueInfoID'
GO
EXEC sp_addextendedproperty N'MS_Description', '分类ID', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfoType', 'COLUMN', N'FK_TypeID'
GO
EXEC sp_addextendedproperty N'MS_Description', '记录状态(RecordStateEnum)', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfoType', 'COLUMN', N'RecordState'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新人ID', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfoType', 'COLUMN', N'UpdaterID'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新人名', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfoType', 'COLUMN', N'UpdaterName'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新时间', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfoType', 'COLUMN', N'UpdateTime'
GO
