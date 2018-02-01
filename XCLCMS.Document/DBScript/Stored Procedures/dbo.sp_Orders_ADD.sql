SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[sp_Orders_ADD]
@OrderID bigint,
@FK_ProductID bigint,
@FK_MerchantID bigint,
@FK_MerchantAppID bigint,
@FK_UserID bigint,
@UserName nvarchar(50),
@Price decimal(18,2),
@PayStatus char(3),
@PayType char(3),
@DealDoneTime datetime,
@Remark varchar(1000),
@RecordState char(1),
@FlowStatus int,
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
	INSERT INTO [Orders](
	[OrderID],[FK_ProductID],[FK_MerchantID],[FK_MerchantAppID],[FK_UserID],[UserName],[Price],[PayStatus],[PayType],[DealDoneTime],[Remark],[RecordState],[FlowStatus],[CreateTime],[CreaterID],[CreaterName],[UpdateTime],[UpdaterID],[UpdaterName]
	)VALUES(
	@OrderID,@FK_ProductID,@FK_MerchantID,@FK_MerchantAppID,@FK_UserID,@UserName,@Price,@PayStatus,@PayType,@DealDoneTime,@Remark,@RecordState,@FlowStatus,@CreateTime,@CreaterID,@CreaterName,@UpdateTime,@UpdaterID,@UpdaterName
	)
	SET @ResultCode=1
END TRY
BEGIN CATCH
	SET @ResultMessage= ERROR_MESSAGE() 
	SET @ResultCode=0
END CATCH
GO
