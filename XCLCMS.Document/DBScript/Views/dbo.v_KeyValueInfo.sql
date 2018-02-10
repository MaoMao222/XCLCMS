
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO





CREATE VIEW [dbo].[v_KeyValueInfo] AS 

WITH info AS (
SELECT
a.*,
b.MerchantName,
c.MerchantAppName,
d.ProductName AS ProductName,
(
	SELECT CAST(FK_TypeID AS VARCHAR)+',' FROM dbo.KeyValueInfoType WITH(NOLOCK) WHERE FK_KeyValueInfoID=a.KeyValueInfoID FOR XML PATH('')
) AS KeyValueInfoTypeIDs,
(
	SELECT CAST(bb.DicName AS VARCHAR)+',' FROM dbo.KeyValueInfoType AS aa WITH(NOLOCK) 
	INNER JOIN dbo.SysDic AS bb WITH(NOLOCK)  ON aa.FK_TypeID=bb.SysDicID
	WHERE aa.FK_KeyValueInfoID=a.KeyValueInfoID FOR XML PATH('')
) AS KeyValueInfoTypeNames
FROM dbo.KeyValueInfo AS a WITH(NOLOCK)
INNER JOIN dbo.Merchant AS b WITH(NOLOCK) ON a.FK_MerchantID=b.MerchantID
LEFT JOIN dbo.MerchantApp AS c WITH(NOLOCK) ON a.FK_MerchantAppID=c.MerchantAppID
LEFT JOIN dbo.Product AS d WITH(NOLOCK) ON a.FK_ProductID=d.ProductID
)
SELECT
a.Code ,
a.Contents ,
a.CreaterID ,
a.CreaterName ,
a.CreateTime ,
a.FK_MerchantAppID ,
a.FK_MerchantID ,
a.FK_ProductID ,
a.FK_UserID ,
a.KeyValueInfoID ,
a.MerchantAppName ,
a.MerchantName ,
a.ProductName ,
a.RecordState ,
a.Remark ,
a.UpdaterID ,
a.UpdaterName ,
a.UpdateTime ,
a.UserName,

SUBSTRING(a.KeyValueInfoTypeIDs,0,LEN(a.KeyValueInfoTypeIDs)) AS KeyValueInfoTypeIDs ,
SUBSTRING(a.KeyValueInfoTypeNames,0,LEN(a.KeyValueInfoTypeNames)) AS KeyValueInfoTypeNames
FROM info AS a



GO
