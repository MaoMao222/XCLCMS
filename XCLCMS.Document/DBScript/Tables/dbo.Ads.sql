CREATE TABLE [dbo].[Ads]
(
[AdsID] [bigint] NOT NULL,
[Code] [varchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[AdsType] [char] (3) COLLATE Chinese_PRC_CI_AS NULL,
[Title] [nvarchar] (200) COLLATE Chinese_PRC_CI_AS NULL,
[Contents] [nvarchar] (max) COLLATE Chinese_PRC_CI_AS NULL,
[AdWidth] [int] NOT NULL,
[AdHeight] [int] NOT NULL,
[URL] [varchar] (500) COLLATE Chinese_PRC_CI_AS NULL,
[URLOpenType] [char] (3) COLLATE Chinese_PRC_CI_AS NULL,
[StartTime] [datetime] NULL,
[EndTime] [datetime] NULL,
[NickName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[Email] [varchar] (100) COLLATE Chinese_PRC_CI_AS NULL,
[QQ] [varchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[Tel] [varchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[OtherContact] [nvarchar] (500) COLLATE Chinese_PRC_CI_AS NULL,
[Remark] [nvarchar] (500) COLLATE Chinese_PRC_CI_AS NULL,
[FK_MerchantID] [bigint] NOT NULL CONSTRAINT [DF__tmp_ms_xx__FK_Me__10E07F16] DEFAULT ((0)),
[FK_MerchantAppID] [bigint] NOT NULL CONSTRAINT [DF__tmp_ms_xx__FK_Me__11D4A34F] DEFAULT ((0)),
[RecordState] [char] (1) COLLATE Chinese_PRC_CI_AS NOT NULL,
[CreateTime] [datetime] NOT NULL,
[CreaterID] [bigint] NOT NULL,
[CreaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[UpdateTime] [datetime] NOT NULL,
[UpdaterID] [bigint] NOT NULL,
[UpdaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
ALTER TABLE [dbo].[Ads] ADD 
CONSTRAINT [PK_ADS] PRIMARY KEY CLUSTERED  ([AdsID]) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Ads] ADD CONSTRAINT [AK_UK_CODE_ADS] UNIQUE NONCLUSTERED  ([Code]) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_Code] ON [dbo].[Ads] ([Code]) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_Title] ON [dbo].[Ads] ([Title]) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_FK_MerchantID] ON [dbo].[Ads] ([FK_MerchantID]) ON [PRIMARY]

GO
EXEC sp_addextendedproperty N'MS_Description', '广告表', 'SCHEMA', N'dbo', 'TABLE', N'Ads', NULL, NULL
GO

EXEC sp_addextendedproperty N'MS_Description', '高度', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'AdHeight'
GO

EXEC sp_addextendedproperty N'MS_Description', 'AdsID', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'AdsID'
GO

EXEC sp_addextendedproperty N'MS_Description', '广告类型(AdsTypeEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'AdsType'
GO

EXEC sp_addextendedproperty N'MS_Description', '宽度', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'AdWidth'
GO

EXEC sp_addextendedproperty N'MS_Description', '唯一标识', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'Code'
GO

EXEC sp_addextendedproperty N'MS_Description', '广告内容', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'Contents'
GO

EXEC sp_addextendedproperty N'MS_Description', '创建者ID', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'CreaterID'
GO

EXEC sp_addextendedproperty N'MS_Description', '创建者名', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'CreaterName'
GO

EXEC sp_addextendedproperty N'MS_Description', '创建时间', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'CreateTime'
GO

EXEC sp_addextendedproperty N'MS_Description', '电子邮件', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'Email'
GO

EXEC sp_addextendedproperty N'MS_Description', '结束时间', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'EndTime'
GO

EXEC sp_addextendedproperty N'MS_Description', '所属应用号', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'FK_MerchantAppID'
GO

EXEC sp_addextendedproperty N'MS_Description', '所属商户号', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'FK_MerchantID'
GO

EXEC sp_addextendedproperty N'MS_Description', '昵称', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'NickName'
GO

EXEC sp_addextendedproperty N'MS_Description', '其它联系方式', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'OtherContact'
GO

EXEC sp_addextendedproperty N'MS_Description', 'QQ', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'QQ'
GO

EXEC sp_addextendedproperty N'MS_Description', '记录状态(RecordStateEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'RecordState'
GO

EXEC sp_addextendedproperty N'MS_Description', '备注', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'Remark'
GO

EXEC sp_addextendedproperty N'MS_Description', '开始时间', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'StartTime'
GO

EXEC sp_addextendedproperty N'MS_Description', '手机号', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'Tel'
GO

EXEC sp_addextendedproperty N'MS_Description', '广告标题', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'Title'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新人ID', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'UpdaterID'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新人名', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'UpdaterName'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新时间', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'UpdateTime'
GO

EXEC sp_addextendedproperty N'MS_Description', '链接地址', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'URL'
GO

EXEC sp_addextendedproperty N'MS_Description', '打开方式(URLOpenTypeEnum)', 'SCHEMA', N'dbo', 'TABLE', N'Ads', 'COLUMN', N'URLOpenType'
GO
