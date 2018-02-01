
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO




CREATE VIEW [dbo].[v_Orders] AS 
SELECT
a.*,
b.MerchantName,
c.MerchantAppName,
d.ProductName,
d.Price AS ProductPrice,
d.Description AS ProductDesc
FROM dbo.Orders AS a WITH(NOLOCK)
INNER JOIN dbo.Merchant AS b WITH(NOLOCK) ON a.FK_MerchantID=b.MerchantID
LEFT JOIN dbo.MerchantApp AS c WITH(NOLOCK) ON a.FK_MerchantAppID=c.MerchantAppID
LEFT JOIN dbo.Product AS d WITH(NOLOCK) ON a.FK_ProductID=d.ProductID






GO
