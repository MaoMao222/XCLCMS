
--上一篇
SELECT TOP 1 * FROM dbo.Article as tb_Article WITH(NOLOCK) 
WHERE PublishTime<@@PublishTime AND ArticleID<>@@ArticleID  AND FK_MerchantID=@@FK_MerchantID AND FK_MerchantAppID=@@FK_MerchantAppID
@(Model.ArticleRecordState)  
ORDER BY PublishTime DESC

--下一篇
SELECT TOP 1 * FROM dbo.Article as tb_Article WITH(NOLOCK)  
WHERE PublishTime>@@PublishTime  AND ArticleID<>@@ArticleID AND  FK_MerchantID=@@FK_MerchantID AND FK_MerchantAppID=@@FK_MerchantAppID  
@(Model.ArticleRecordState)  
ORDER BY PublishTime ASC

--同类其它文章（top n）
SELECT 
DISTINCT
TOP (@@TopCount)
tb_Article.* 
FROM dbo.Article AS tb_Article WITH(NOLOCK) 
INNER JOIN dbo.ArticleType AS b  WITH(NOLOCK) ON tb_Article.ArticleID=b.FK_ArticleID
INNER JOIN (
	SELECT DISTINCT FK_TypeID FROM dbo.ArticleType WITH(NOLOCK) WHERE FK_ArticleID=@@ArticleID AND RecordState='N'
) AS c ON b.FK_TypeID=c.FK_TypeID
WHERE tb_Article.ArticleID<>@@ArticleID  AND tb_Article.FK_MerchantID=@@FK_MerchantID AND tb_Article.FK_MerchantAppID=@@FK_MerchantAppID
@(Model.ArticleRecordState)  
ORDER BY tb_Article.PublishTime DESC