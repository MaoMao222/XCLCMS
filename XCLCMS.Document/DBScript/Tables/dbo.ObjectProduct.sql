CREATE TABLE [dbo].[ObjectProduct]
(
[ObjectType] [char] (3) COLLATE Chinese_PRC_CI_AS NOT NULL,
[FK_ObjectID] [bigint] NOT NULL,
[FK_ProductID] [bigint] NOT NULL,
[RecordState] [char] (1) COLLATE Chinese_PRC_CI_AS NOT NULL,
[CreateTime] [datetime] NOT NULL,
[CreaterID] [bigint] NOT NULL,
[CreaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[UpdateTime] [datetime] NOT NULL,
[UpdaterID] [bigint] NOT NULL,
[UpdaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ObjectProduct] ADD CONSTRAINT [PK_OBJECTPRODUCT] PRIMARY KEY CLUSTERED  ([ObjectType], [FK_ObjectID], [FK_ProductID]) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [IX_ObjectType] ON [dbo].[ObjectProduct] ([ObjectType]) ON [PRIMARY]
GO
EXEC sp_addextendedproperty N'MS_Description', '所有产品关系表', 'SCHEMA', N'dbo', 'TABLE', N'ObjectProduct', NULL, NULL
GO
EXEC sp_addextendedproperty N'MS_Description', '创建者ID', 'SCHEMA', N'dbo', 'TABLE', N'ObjectProduct', 'COLUMN', N'CreaterID'
GO
EXEC sp_addextendedproperty N'MS_Description', '创建者名', 'SCHEMA', N'dbo', 'TABLE', N'ObjectProduct', 'COLUMN', N'CreaterName'
GO
EXEC sp_addextendedproperty N'MS_Description', '创建时间', 'SCHEMA', N'dbo', 'TABLE', N'ObjectProduct', 'COLUMN', N'CreateTime'
GO

EXEC sp_addextendedproperty N'MS_Description', '产品所属主体ID', 'SCHEMA', N'dbo', 'TABLE', N'ObjectProduct', 'COLUMN', N'FK_ObjectID'
GO

EXEC sp_addextendedproperty N'MS_Description', '产品ID', 'SCHEMA', N'dbo', 'TABLE', N'ObjectProduct', 'COLUMN', N'FK_ProductID'
GO

EXEC sp_addextendedproperty N'MS_Description', '产品所属主体类别(ObjectTypeEnum)', 'SCHEMA', N'dbo', 'TABLE', N'ObjectProduct', 'COLUMN', N'ObjectType'
GO

EXEC sp_addextendedproperty N'MS_Description', '记录状态(RecordStateEnum)', 'SCHEMA', N'dbo', 'TABLE', N'ObjectProduct', 'COLUMN', N'RecordState'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新人ID', 'SCHEMA', N'dbo', 'TABLE', N'ObjectProduct', 'COLUMN', N'UpdaterID'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新人名', 'SCHEMA', N'dbo', 'TABLE', N'ObjectProduct', 'COLUMN', N'UpdaterName'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新时间', 'SCHEMA', N'dbo', 'TABLE', N'ObjectProduct', 'COLUMN', N'UpdateTime'
GO
