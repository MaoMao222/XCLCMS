
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[sp_Ads_Update]
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
		UPDATE [Ads] SET 
		Code=@Code ,
		Title=@Title,
		FK_MerchantID=@FK_MerchantID ,
		[AdsType] = @AdsType,[Contents] = @Contents,[AdWidth] = @AdWidth,[AdHeight] = @AdHeight,[URL] = @URL,[URLOpenType] = @URLOpenType,[StartTime] = @StartTime,[EndTime] = @EndTime,[NickName] = @NickName,[Email] = @Email,[QQ] = @QQ,[Tel] = @Tel,[OtherContact] = @OtherContact,[Remark] = @Remark,[FK_MerchantAppID] = @FK_MerchantAppID,[RecordState] = @RecordState,[CreateTime] = @CreateTime,[CreaterID] = @CreaterID,[CreaterName] = @CreaterName,[UpdateTime] = @UpdateTime,[UpdaterID] = @UpdaterID,[UpdaterName] = @UpdaterName
		WHERE AdsID=@AdsID
		SET @ResultCode=1
END TRY
BEGIN CATCH
	SET @ResultMessage= ERROR_MESSAGE() 
	SET @ResultCode=0
END CATCH
GO
