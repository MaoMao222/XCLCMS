CREATE TABLE [dbo].[SysRoleFunction]
(
[FK_SysRoleID] [bigint] NOT NULL,
[FK_SysFunctionID] [bigint] NOT NULL,
[RecordState] [char] (1) COLLATE Chinese_PRC_CI_AS NOT NULL,
[CreateTime] [datetime] NOT NULL,
[CreaterID] [bigint] NOT NULL,
[CreaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[UpdateTime] [datetime] NOT NULL,
[UpdaterID] [bigint] NOT NULL,
[UpdaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[SysRoleFunction] ADD CONSTRAINT [AK_KEY_1_SYSROLEF] UNIQUE NONCLUSTERED  ([FK_SysRoleID], [FK_SysFunctionID]) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_SysRoleID] ON [dbo].[SysRoleFunction] ([FK_SysRoleID]) ON [PRIMARY]

GO
EXEC sp_addextendedproperty N'MS_Description', '角色功能关系表', 'SCHEMA', N'dbo', 'TABLE', N'SysRoleFunction', NULL, NULL
GO
EXEC sp_addextendedproperty N'MS_Description', '创建者ID', 'SCHEMA', N'dbo', 'TABLE', N'SysRoleFunction', 'COLUMN', N'CreaterID'
GO
EXEC sp_addextendedproperty N'MS_Description', '创建者名', 'SCHEMA', N'dbo', 'TABLE', N'SysRoleFunction', 'COLUMN', N'CreaterName'
GO
EXEC sp_addextendedproperty N'MS_Description', '创建时间', 'SCHEMA', N'dbo', 'TABLE', N'SysRoleFunction', 'COLUMN', N'CreateTime'
GO
EXEC sp_addextendedproperty N'MS_Description', '功能ID', 'SCHEMA', N'dbo', 'TABLE', N'SysRoleFunction', 'COLUMN', N'FK_SysFunctionID'
GO
EXEC sp_addextendedproperty N'MS_Description', '角色ID', 'SCHEMA', N'dbo', 'TABLE', N'SysRoleFunction', 'COLUMN', N'FK_SysRoleID'
GO
EXEC sp_addextendedproperty N'MS_Description', '记录状态(RecordStateEnum)', 'SCHEMA', N'dbo', 'TABLE', N'SysRoleFunction', 'COLUMN', N'RecordState'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新人ID', 'SCHEMA', N'dbo', 'TABLE', N'SysRoleFunction', 'COLUMN', N'UpdaterID'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新人名', 'SCHEMA', N'dbo', 'TABLE', N'SysRoleFunction', 'COLUMN', N'UpdaterName'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新时间', 'SCHEMA', N'dbo', 'TABLE', N'SysRoleFunction', 'COLUMN', N'UpdateTime'
GO
