SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO


CREATE VIEW [dbo].[v_Comments] AS 

SELECT
a.*,
b.MerchantName,
c.MerchantAppName
FROM dbo.Comments AS a WITH(NOLOCK)
INNER JOIN dbo.Merchant AS b WITH(NOLOCK) ON a.FK_MerchantID=b.MerchantID
LEFT JOIN dbo.MerchantApp AS c WITH(NOLOCK) ON a.FK_MerchantAppID=c.MerchantAppID

GO
