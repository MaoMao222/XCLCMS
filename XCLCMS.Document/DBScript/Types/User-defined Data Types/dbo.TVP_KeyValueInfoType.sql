CREATE TYPE [dbo].[TVP_KeyValueInfoType] AS TABLE
(
[FK_KeyValueInfoID] [bigint] NULL,
[FK_TypeID] [bigint] NULL,
[RecordState] [char] (1) COLLATE Chinese_PRC_CI_AS NULL,
[CreateTime] [datetime] NULL,
[CreaterID] [bigint] NULL,
[CreaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[UpdateTime] [datetime] NULL,
[UpdaterID] [bigint] NULL,
[UpdaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL
)
GO
