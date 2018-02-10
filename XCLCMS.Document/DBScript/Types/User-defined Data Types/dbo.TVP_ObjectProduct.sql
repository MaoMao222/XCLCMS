CREATE TYPE [dbo].[TVP_ObjectProduct] AS TABLE
(
[ObjectType] [char] (3) COLLATE Chinese_PRC_CI_AS NULL,
[FK_ObjectID] [bigint] NULL,
[FK_ProductID] [bigint] NULL,
[RecordState] [char] (1) COLLATE Chinese_PRC_CI_AS NULL,
[CreateTime] [datetime] NULL,
[CreaterID] [bigint] NULL,
[CreaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL,
[UpdateTime] [datetime] NULL,
[UpdaterID] [bigint] NULL,
[UpdaterName] [nvarchar] (50) COLLATE Chinese_PRC_CI_AS NULL
)
GO
