CREATE TABLE [dbo].[Product]
(
[ProductID] [bigint] NOT NULL,
[FK_MerchantID] [bigint] NOT NULL CONSTRAINT [DF__tmp_ms_xx__FK_Me__7FD5EEA5] DEFAULT ((0)),
[FK_MerchantAppID] [bigint] NOT NULL CONSTRAINT [DF__tmp_ms_xx__FK_Me__00CA12DE] DEFAULT ((0)),
[ProductName] [nvarchar] (200) COLLATE Chinese_PRC_CI_AS NOT NULL,
[Description] [nvarchar] (max) COLLATE Chinese_PRC_CI_AS NULL,
[Price] [decimal] (18, 2) NOT NULL,
[Remark] [varchar] (1000) COLLATE Chinese_PRC_CI_AS NULL,
[RecordState] [char] (1) COLLATE Chinese_PRC_CI_AS NOT NULL,
[CreateTime] [datetime] NOT NULL,
[CreaterID] [bigint] NOT NULL,
[CreaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[UpdateTime] [datetime] NOT NULL,
[UpdaterID] [bigint] NOT NULL,
[UpdaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
ALTER TABLE [dbo].[Product] ADD 
CONSTRAINT [PK_PRODUCT] PRIMARY KEY CLUSTERED  ([ProductID]) ON [PRIMARY]
CREATE NONCLUSTERED INDEX [IX_FK_MerchantID] ON [dbo].[Product] ([FK_MerchantID]) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_ProductName] ON [dbo].[Product] ([ProductName]) ON [PRIMARY]

GO
EXEC sp_addextendedproperty N'MS_Description', '产品表', 'SCHEMA', N'dbo', 'TABLE', N'Product', NULL, NULL
GO

EXEC sp_addextendedproperty N'MS_Description', '创建者ID', 'SCHEMA', N'dbo', 'TABLE', N'Product', 'COLUMN', N'CreaterID'
GO

EXEC sp_addextendedproperty N'MS_Description', '创建者名', 'SCHEMA', N'dbo', 'TABLE', N'Product', 'COLUMN', N'CreaterName'
GO

EXEC sp_addextendedproperty N'MS_Description', '创建时间', 'SCHEMA', N'dbo', 'TABLE', N'Product', 'COLUMN', N'CreateTime'
GO

EXEC sp_addextendedproperty N'MS_Description', '产品描述', 'SCHEMA', N'dbo', 'TABLE', N'Product', 'COLUMN', N'Description'
GO

EXEC sp_addextendedproperty N'MS_Description', '所属应用号', 'SCHEMA', N'dbo', 'TABLE', N'Product', 'COLUMN', N'FK_MerchantAppID'
GO

EXEC sp_addextendedproperty N'MS_Description', '所属商户号', 'SCHEMA', N'dbo', 'TABLE', N'Product', 'COLUMN', N'FK_MerchantID'
GO

EXEC sp_addextendedproperty N'MS_Description', '售价', 'SCHEMA', N'dbo', 'TABLE', N'Product', 'COLUMN', N'Price'
GO

EXEC sp_addextendedproperty N'MS_Description', '产品ID', 'SCHEMA', N'dbo', 'TABLE', N'Product', 'COLUMN', N'ProductID'
GO

EXEC sp_addextendedproperty N'MS_Description', '名称', 'SCHEMA', N'dbo', 'TABLE', N'Product', 'COLUMN', N'ProductName'
GO

EXEC sp_addextendedproperty N'MS_Description', '记录状态(RecordStateEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Product', 'COLUMN', N'RecordState'
GO

EXEC sp_addextendedproperty N'MS_Description', '备注', 'SCHEMA', N'dbo', 'TABLE', N'Product', 'COLUMN', N'Remark'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新人ID', 'SCHEMA', N'dbo', 'TABLE', N'Product', 'COLUMN', N'UpdaterID'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新人名', 'SCHEMA', N'dbo', 'TABLE', N'Product', 'COLUMN', N'UpdaterName'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新时间', 'SCHEMA', N'dbo', 'TABLE', N'Product', 'COLUMN', N'UpdateTime'
GO
