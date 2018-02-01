SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[sp_Product_Update]
@ProductID BIGINT,
@FK_MerchantID BIGINT,
@FK_MerchantAppID BIGINT,
@ProductName NVARCHAR(200),
@Description NVARCHAR(MAX),
@Price decimal(18,2),
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
	UPDATE [Product] SET 
	FK_MerchantID=@FK_MerchantID , ProductName=@ProductName, 
	[FK_MerchantAppID] = @FK_MerchantAppID,[Description] = @Description,[Price]=@Price,[Remark] = @Remark,[RecordState] = @RecordState,[CreateTime] = @CreateTime,[CreaterID] = @CreaterID,[CreaterName] = @CreaterName,[UpdateTime] = @UpdateTime,[UpdaterID] = @UpdaterID,[UpdaterName] = @UpdaterName
	WHERE ProductID=@ProductID
	SET @ResultCode=1
END TRY
BEGIN CATCH
	SET @ResultMessage= ERROR_MESSAGE() 
	SET @ResultCode=0
END CATCH
GO
