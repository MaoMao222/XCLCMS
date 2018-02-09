
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[sp_Product_Update]
@ProductID bigint,
@FK_MerchantID bigint,
@FK_MerchantAppID bigint,
@ProductName nvarchar(200),
@Description nvarchar(MAX),
@Price decimal(18,2),
@SaleType char(3),
@SaleTitle nvarchar(50),
@PayedActionType char(3),
@PayedRemark nvarchar(2000),
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
	UPDATE [Product] SET 
	FK_MerchantID=@FK_MerchantID , ProductName=@ProductName ,
	[FK_MerchantAppID] = @FK_MerchantAppID,[Description] = @Description,[Price] = @Price,[SaleType] = @SaleType,[SaleTitle] = @SaleTitle,[PayedActionType] = @PayedActionType,[PayedRemark] = @PayedRemark,[Remark] = @Remark,[RecordState] = @RecordState,[CreateTime] = @CreateTime,[CreaterID] = @CreaterID,[CreaterName] = @CreaterName,[UpdateTime] = @UpdateTime,[UpdaterID] = @UpdaterID,[UpdaterName] = @UpdaterName
	WHERE ProductID=@ProductID
	SET @ResultCode=1
END TRY
BEGIN CATCH
	SET @ResultMessage= ERROR_MESSAGE() 
	SET @ResultCode=0
END CATCH

GO
