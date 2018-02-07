CREATE TABLE [dbo].[KeyValueInfo]
(
[KeyValueInfoID] [bigint] NOT NULL,
[Code] [varchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[KeyValueType] [char] (3) COLLATE Chinese_PRC_CI_AS NULL,
[FK_ProductID] [bigint] NOT NULL,
[FK_MerchantID] [bigint] NOT NULL CONSTRAINT [DF__KeyValueI__FK_Me__26EFBBC6] DEFAULT ((0)),
[FK_MerchantAppID] [bigint] NOT NULL CONSTRAINT [DF__KeyValueI__FK_Me__27E3DFFF] DEFAULT ((0)),
[FK_UserID] [bigint] NOT NULL CONSTRAINT [DF__KeyValueI__FK_Us__28D80438] DEFAULT ((0)),
[UserName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[Contents] [varchar] (max) COLLATE Chinese_PRC_CI_AS NULL,
[Remark] [varchar] (1000) COLLATE Chinese_PRC_CI_AS NULL,
[RecordState] [char] (1) COLLATE Chinese_PRC_CI_AS NOT NULL,
[CreateTime] [datetime] NOT NULL,
[CreaterID] [bigint] NOT NULL,
[CreaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[UpdateTime] [datetime] NOT NULL,
[UpdaterID] [bigint] NOT NULL,
[UpdaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[KeyValueInfo] ADD CONSTRAINT [PK_KEYVALUEINFO] PRIMARY KEY CLUSTERED  ([KeyValueInfoID]) ON [PRIMARY]
GO
ALTER TABLE [dbo].[KeyValueInfo] ADD CONSTRAINT [AK_UK_CODE_KEYVALUE] UNIQUE NONCLUSTERED  ([Code]) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [IX_Code] ON [dbo].[KeyValueInfo] ([Code]) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [IX_FK_MerchantID] ON [dbo].[KeyValueInfo] ([FK_MerchantID]) ON [PRIMARY]
GO
EXEC sp_addextendedproperty N'MS_Description', '自由数据存储表', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', NULL, NULL
GO
EXEC sp_addextendedproperty N'MS_Description', '唯一标识', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'Code'
GO
EXEC sp_addextendedproperty N'MS_Description', '内容', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'Contents'
GO
EXEC sp_addextendedproperty N'MS_Description', '创建者ID', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'CreaterID'
GO
EXEC sp_addextendedproperty N'MS_Description', '创建者名', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'CreaterName'
GO
EXEC sp_addextendedproperty N'MS_Description', '创建时间', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'CreateTime'
GO
EXEC sp_addextendedproperty N'MS_Description', '所属应用号', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'FK_MerchantAppID'
GO
EXEC sp_addextendedproperty N'MS_Description', '所属商户号', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'FK_MerchantID'
GO
EXEC sp_addextendedproperty N'MS_Description', '所属产品', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'FK_ProductID'
GO
EXEC sp_addextendedproperty N'MS_Description', '所属用户', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'FK_UserID'
GO
EXEC sp_addextendedproperty N'MS_Description', 'KeyValueInfoID', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'KeyValueInfoID'
GO
EXEC sp_addextendedproperty N'MS_Description', '分类(KeyValueTypeEnum)', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'KeyValueType'
GO
EXEC sp_addextendedproperty N'MS_Description', '记录状态(RecordStateEnum)', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'RecordState'
GO
EXEC sp_addextendedproperty N'MS_Description', '备注', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'Remark'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新人ID', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'UpdaterID'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新人名', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'UpdaterName'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新时间', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'UpdateTime'
GO
EXEC sp_addextendedproperty N'MS_Description', '所属用户名', 'SCHEMA', N'dbo', 'TABLE', N'KeyValueInfo', 'COLUMN', N'UserName'
GO
