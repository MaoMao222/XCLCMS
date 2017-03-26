CREATE TABLE [dbo].[UserInfo]
(
[UserInfoID] [bigint] NOT NULL,
[UserName] [varchar] (50) COLLATE Chinese_PRC_CI_AS NOT NULL,
[FK_MerchantID] [bigint] NOT NULL CONSTRAINT [DF__tmp_ms_xx__FK_Me__45544755] DEFAULT ((0)),
[FK_MerchantAppID] [bigint] NOT NULL CONSTRAINT [DF__tmp_ms_xx__FK_Me__46486B8E] DEFAULT ((0)),
[RealName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[NickName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[Pwd] [varchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[Age] [int] NOT NULL,
[SexType] [char] (1) COLLATE Chinese_PRC_CI_AS NULL,
[Birthday] [datetime] NULL,
[Tel] [varchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[QQ] [varchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[Email] [varchar] (100) COLLATE Chinese_PRC_CI_AS NULL,
[OtherContact] [nvarchar] (500) COLLATE Chinese_PRC_CI_AS NULL,
[AccessType] [varchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[AccessToken] [varchar] (100) COLLATE Chinese_PRC_CI_AS NULL,
[UserState] [char] (1) COLLATE Chinese_PRC_CI_AS NULL,
[Remark] [nvarchar] (1000) COLLATE Chinese_PRC_CI_AS NULL,
[RoleName] [nvarchar] (100) COLLATE Chinese_PRC_CI_AS NULL,
[RoleMaxWeight] [int] NULL,
[RecordState] [char] (1) COLLATE Chinese_PRC_CI_AS NOT NULL,
[CreateTime] [datetime] NOT NULL,
[CreaterID] [bigint] NOT NULL,
[CreaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[UpdateTime] [datetime] NOT NULL,
[UpdaterID] [bigint] NOT NULL,
[UpdaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL
) ON [PRIMARY]
ALTER TABLE [dbo].[UserInfo] ADD 
CONSTRAINT [PK_USERINFO] PRIMARY KEY CLUSTERED  ([UserInfoID]) ON [PRIMARY]
GO
ALTER TABLE [dbo].[UserInfo] ADD CONSTRAINT [AK_UK_USERNAME_USERINFO] UNIQUE NONCLUSTERED  ([UserName]) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_UserName] ON [dbo].[UserInfo] ([UserName]) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_FK_MerchantID] ON [dbo].[UserInfo] ([FK_MerchantID]) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_RealName] ON [dbo].[UserInfo] ([RealName]) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_NickName] ON [dbo].[UserInfo] ([NickName]) ON [PRIMARY]

GO
EXEC sp_addextendedproperty N'MS_Description', '用户信息表', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', NULL, NULL
GO

EXEC sp_addextendedproperty N'MS_Description', '访问token', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'AccessToken'
GO

EXEC sp_addextendedproperty N'MS_Description', '访问方式', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'AccessType'
GO

EXEC sp_addextendedproperty N'MS_Description', '年龄', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'Age'
GO

EXEC sp_addextendedproperty N'MS_Description', '出生日期', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'Birthday'
GO

EXEC sp_addextendedproperty N'MS_Description', '创建者ID', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'CreaterID'
GO

EXEC sp_addextendedproperty N'MS_Description', '创建者名', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'CreaterName'
GO

EXEC sp_addextendedproperty N'MS_Description', '创建时间', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'CreateTime'
GO

EXEC sp_addextendedproperty N'MS_Description', '电子邮件', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'Email'
GO

EXEC sp_addextendedproperty N'MS_Description', '所属应用号', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'FK_MerchantAppID'
GO

EXEC sp_addextendedproperty N'MS_Description', '所属商户号', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'FK_MerchantID'
GO

EXEC sp_addextendedproperty N'MS_Description', '昵称', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'NickName'
GO

EXEC sp_addextendedproperty N'MS_Description', N'其它联系方式', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'OtherContact'
GO


EXEC sp_addextendedproperty N'MS_Description', '密码', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'Pwd'
GO

EXEC sp_addextendedproperty N'MS_Description', 'QQ', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'QQ'
GO

EXEC sp_addextendedproperty N'MS_Description', '真实姓名', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'RealName'
GO

EXEC sp_addextendedproperty N'MS_Description', '记录状态(RecordStateEnum)', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'RecordState'
GO

EXEC sp_addextendedproperty N'MS_Description', '备注', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'Remark'
GO

EXEC sp_addextendedproperty N'MS_Description', '角色最大权重', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'RoleMaxWeight'
GO

EXEC sp_addextendedproperty N'MS_Description', '角色名(逗号分隔)', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'RoleName'
GO

EXEC sp_addextendedproperty N'MS_Description', '性别(UserSexTypeEnum)', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'SexType'
GO

EXEC sp_addextendedproperty N'MS_Description', '手机号', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'Tel'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新人ID', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'UpdaterID'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新人名', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'UpdaterName'
GO

EXEC sp_addextendedproperty N'MS_Description', '更新时间', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'UpdateTime'
GO

EXEC sp_addextendedproperty N'MS_Description', 'UserInfoID', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'UserInfoID'
GO

EXEC sp_addextendedproperty N'MS_Description', '用户名', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'UserName'
GO

EXEC sp_addextendedproperty N'MS_Description', '用户状态(UserStateEnum)', 'SCHEMA', N'dbo', 'TABLE', N'UserInfo', 'COLUMN', N'UserState'
GO
