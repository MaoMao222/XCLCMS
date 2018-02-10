
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[sp_KeyValueInfo_Update]
@KeyValueInfoID BIGINT,
@Code VARCHAR(50),
@FK_ProductID BIGINT,
@FK_MerchantID BIGINT,
@FK_MerchantAppID BIGINT,
@FK_UserID BIGINT,
@UserName NVARCHAR(50),
@Contents VARCHAR(MAX),
@Remark VARCHAR(1000),
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
	UPDATE [KeyValueInfo] SET 
	Code=@Code , FK_MerchantID=@FK_MerchantID ,
	[FK_ProductID] = @FK_ProductID,[FK_MerchantAppID] = @FK_MerchantAppID,[FK_UserID] = @FK_UserID,[UserName] = @UserName,[Contents] = @Contents,[Remark] = @Remark,[RecordState] = @RecordState,[CreateTime] = @CreateTime,[CreaterID] = @CreaterID,[CreaterName] = @CreaterName,[UpdateTime] = @UpdateTime,[UpdaterID] = @UpdaterID,[UpdaterName] = @UpdaterName
	WHERE KeyValueInfoID=@KeyValueInfoID
	SET @ResultCode=1
END TRY
BEGIN CATCH
	SET @ResultMessage= ERROR_MESSAGE() 
	SET @ResultCode=0
END CATCH
GO
