SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[sp_KeyValueInfo_Update]
@KeyValueInfoID bigint,
@Code varchar(50),
@KeyValueType char(3),
@FK_ProductID bigint,
@FK_MerchantID bigint,
@FK_MerchantAppID bigint,
@FK_UserID bigint,
@UserName nvarchar(50),
@Contents varchar(MAX),
@Remark varchar(1000),
@RecordState char(1),
@CreateTime datetime,
@CreaterID bigint,
@CreaterName nvarchar(50),
@UpdateTime datetime,
@UpdaterID bigint,
@UpdaterName nvarchar(50),

@ResultCode INT OUTPUT,
@ResultMessage NVARCHAR(1000) OUTPUT
 AS 
 BEGIN TRY
	UPDATE [KeyValueInfo] SET 
	Code=@Code , FK_MerchantID=@FK_MerchantID ,
	[KeyValueType] = @KeyValueType,[FK_ProductID] = @FK_ProductID,[FK_MerchantAppID] = @FK_MerchantAppID,[FK_UserID] = @FK_UserID,[UserName] = @UserName,[Contents] = @Contents,[Remark] = @Remark,[RecordState] = @RecordState,[CreateTime] = @CreateTime,[CreaterID] = @CreaterID,[CreaterName] = @CreaterName,[UpdateTime] = @UpdateTime,[UpdaterID] = @UpdaterID,[UpdaterName] = @UpdaterName
	WHERE KeyValueInfoID=@KeyValueInfoID
	SET @ResultCode=1
END TRY
BEGIN CATCH
	SET @ResultMessage= ERROR_MESSAGE() 
	SET @ResultCode=0
END CATCH
GO
