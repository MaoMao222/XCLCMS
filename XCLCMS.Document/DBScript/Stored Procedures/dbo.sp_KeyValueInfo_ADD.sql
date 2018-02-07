SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[sp_KeyValueInfo_ADD]
@KeyValueInfoID BIGINT,
@Code VARCHAR(50),
@KeyValueType CHAR(3),
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
	INSERT INTO [KeyValueInfo](
	[KeyValueInfoID],[Code],[KeyValueType],[FK_ProductID],[FK_MerchantID],[FK_MerchantAppID],[FK_UserID],[UserName],[Contents],[Remark],[RecordState],[CreateTime],[CreaterID],[CreaterName],[UpdateTime],[UpdaterID],[UpdaterName]
	)VALUES(
	@KeyValueInfoID,@Code,@KeyValueType,@FK_ProductID,@FK_MerchantID,@FK_MerchantAppID,@FK_UserID,@UserName,@Contents,@Remark,@RecordState,@CreateTime,@CreaterID,@CreaterName,@UpdateTime,@UpdaterID,@UpdaterName
	)
	SET @ResultCode=1
END TRY
BEGIN CATCH
	SET @ResultMessage= ERROR_MESSAGE() 
	SET @ResultCode=0
END CATCH
GO
