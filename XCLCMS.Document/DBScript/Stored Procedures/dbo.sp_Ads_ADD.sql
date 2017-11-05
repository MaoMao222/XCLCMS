
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[sp_Ads_ADD]
@AdsID BIGINT,
@Code VARCHAR(50),
@AdsType CHAR(3),
@Title NVARCHAR(200),
@Contents NVARCHAR(MAX),
@AdWidth INT,
@AdHeight INT,
@URL VARCHAR(500),
@URLOpenType CHAR(3),
@StartTime DATETIME,
@EndTime DATETIME,
@NickName NVARCHAR(50),
@Email VARCHAR(100),
@QQ VARCHAR(50),
@Tel VARCHAR(50),
@OtherContact NVARCHAR(500),
@Remark NVARCHAR(500),
@FK_MerchantID BIGINT,
@FK_MerchantAppID BIGINT,
@RecordState CHAR(1),
@CreateTime DATETIME,
@CreaterID BIGINT,
@CreaterName NVARCHAR(50),
@UpdateTime DATETIME,
@UpdaterID BIGINT,
@UpdaterName NVARCHAR(50),

@ResultCode INT OUTPUT,
@ResultMessage NVARCHAR(1000) OUTPUT

 AS 
 BEGIN TRY
		INSERT INTO [Ads](
		[AdsID],[Code],[AdsType],[Title],[Contents],[AdWidth],[AdHeight],[URL],[URLOpenType],[StartTime],[EndTime],[NickName],[Email],[QQ],[Tel],[OtherContact],[Remark],[FK_MerchantID],[FK_MerchantAppID],[RecordState],[CreateTime],[CreaterID],[CreaterName],[UpdateTime],[UpdaterID],[UpdaterName]
		)VALUES(
		@AdsID,@Code,@AdsType,@Title,@Contents,@AdWidth,@AdHeight,@URL,@URLOpenType,@StartTime,@EndTime,@NickName,@Email,@QQ,@Tel,@OtherContact,@Remark,@FK_MerchantID,@FK_MerchantAppID,@RecordState,@CreateTime,@CreaterID,@CreaterName,@UpdateTime,@UpdaterID,@UpdaterName
		)
		SET @ResultCode=1
END TRY
BEGIN CATCH
	SET @ResultMessage= ERROR_MESSAGE() 
	SET @ResultCode=0
END CATCH
GO
