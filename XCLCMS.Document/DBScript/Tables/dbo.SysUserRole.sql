CREATE TABLE [dbo].[SysUserRole]
(
[FK_UserInfoID] [bigint] NOT NULL,
[FK_SysRoleID] [bigint] NOT NULL,
[RecordState] [char] (1) COLLATE Chinese_PRC_CI_AS NOT NULL,
[CreateTime] [datetime] NOT NULL,
[CreaterID] [bigint] NOT NULL,
[CreaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[UpdateTime] [datetime] NOT NULL,
[UpdaterID] [bigint] NOT NULL,
[UpdaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[SysUserRole] ADD CONSTRAINT [AK_KEY_1_SYSUSERR] UNIQUE NONCLUSTERED  ([FK_UserInfoID], [FK_SysRoleID]) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IX_UserInfoID] ON [dbo].[SysUserRole] ([FK_UserInfoID]) ON [PRIMARY]

GO
EXEC sp_addextendedproperty N'MS_Description', '用户角色关系表', 'SCHEMA', N'dbo', 'TABLE', N'SysUserRole', NULL, NULL
GO
EXEC sp_addextendedproperty N'MS_Description', '创建者ID', 'SCHEMA', N'dbo', 'TABLE', N'SysUserRole', 'COLUMN', N'CreaterID'
GO
EXEC sp_addextendedproperty N'MS_Description', '创建者名', 'SCHEMA', N'dbo', 'TABLE', N'SysUserRole', 'COLUMN', N'CreaterName'
GO
EXEC sp_addextendedproperty N'MS_Description', '创建时间', 'SCHEMA', N'dbo', 'TABLE', N'SysUserRole', 'COLUMN', N'CreateTime'
GO
EXEC sp_addextendedproperty N'MS_Description', '角色ID', 'SCHEMA', N'dbo', 'TABLE', N'SysUserRole', 'COLUMN', N'FK_SysRoleID'
GO
EXEC sp_addextendedproperty N'MS_Description', '用户ID', 'SCHEMA', N'dbo', 'TABLE', N'SysUserRole', 'COLUMN', N'FK_UserInfoID'
GO
EXEC sp_addextendedproperty N'MS_Description', '记录状态(RecordStateEnum)', 'SCHEMA', N'dbo', 'TABLE', N'SysUserRole', 'COLUMN', N'RecordState'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新人ID', 'SCHEMA', N'dbo', 'TABLE', N'SysUserRole', 'COLUMN', N'UpdaterID'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新人名', 'SCHEMA', N'dbo', 'TABLE', N'SysUserRole', 'COLUMN', N'UpdaterName'
GO
EXEC sp_addextendedproperty N'MS_Description', '更新时间', 'SCHEMA', N'dbo', 'TABLE', N'SysUserRole', 'COLUMN', N'UpdateTime'
GO
