CREATE TABLE [dbo].[Orders]
(
[OrderID] [bigint] NOT NULL,
[FK_ProductID] [bigint] NOT NULL,
[FK_MerchantID] [bigint] NOT NULL CONSTRAINT [DF__Orders__FK_Merch__7093AB15] DEFAULT ((0)),
[FK_MerchantAppID] [bigint] NOT NULL CONSTRAINT [DF__Orders__FK_Merch__7187CF4E] DEFAULT ((0)),
[FK_UserID] [bigint] NOT NULL CONSTRAINT [DF__Orders__FK_UserI__727BF387] DEFAULT ((0)),
[UserName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[Price] [decimal] (18, 2) NOT NULL CONSTRAINT [DF__Orders__Price__737017C0] DEFAULT ((0)),
[PayStatus] [char] (3) COLLATE Chinese_PRC_CI_AS NULL,
[PayType] [char] (3) COLLATE Chinese_PRC_CI_AS NULL,
[DealDoneTime] [datetime] NULL,
[Remark] [varchar] (1000) COLLATE Chinese_PRC_CI_AS NULL,
[RecordState] [char] (1) COLLATE Chinese_PRC_CI_AS NOT NULL,
[FlowStatus] [int] NOT NULL CONSTRAINT [DF__Orders__FlowStat__74643BF9] DEFAULT ((0)),
[CreateTime] [datetime] NOT NULL,
[CreaterID] [bigint] NOT NULL,
[CreaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[UpdateTime] [datetime] NOT NULL,
[UpdaterID] [bigint] NOT NULL,
[UpdaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Orders] ADD CONSTRAINT [PK_ORDERS] PRIMARY KEY CLUSTERED  ([OrderID]) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [IX_FK_MerchantID] ON [dbo].[Orders] ([FK_MerchantID]) ON [PRIMARY]
GO
EXEC sp_addextendedproperty N'MS_Description', '订单表', 'SCHEMA', N'dbo', 'TABLE', N'Orders', NULL, NULL
GO
EXEC sp_addextendedproperty N'MS_Description', '创建者ID', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'CreaterID'
GO
EXEC sp_addextendedproperty N'MS_Description', '创建者名', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'CreaterName'
GO
EXEC sp_addextendedproperty N'MS_Description', '创建时间', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'CreateTime'
GO
EXEC sp_addextendedproperty N'MS_Description', '所属应用号', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'FK_MerchantAppID'
GO
EXEC sp_addextendedproperty N'MS_Description', '所属商户号', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'FK_MerchantID'
GO
EXEC sp_addextendedproperty N'MS_Description', '所属产品', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'FK_ProductID'
GO
EXEC sp_addextendedproperty N'MS_Description', '所属用户', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'FK_UserID'
GO
EXEC sp_addextendedproperty N'MS_Description', '流水状态', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'FlowStatus'
GO
EXEC sp_addextendedproperty N'MS_Description', '订单ID', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'OrderID'
GO
EXEC sp_addextendedproperty N'MS_Description', '支付状态(PayStatusEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'PayStatus'
GO
EXEC sp_addextendedproperty N'MS_Description', '支付方式(PayTypeEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'PayType'
GO
EXEC sp_addextendedproperty N'MS_Description', '价格', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'Price'
GO
EXEC sp_addextendedproperty N'MS_Description', '记录状态(RecordStateEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'RecordState'
GO
EXEC sp_addextendedproperty N'MS_Description', '备注', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'Remark'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新人ID', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'UpdaterID'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新人名', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'UpdaterName'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新时间', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'UpdateTime'
GO
EXEC sp_addextendedproperty N'MS_Description', '所属用户名', 'SCHEMA', N'dbo', 'TABLE', N'Orders', 'COLUMN', N'UserName'
GO
