
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[sp_Orders_Update]
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
@FlowStatus int,
@Version int,
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
	DECLARE @curVersion INT=0
	SELECT @curVersion=[Version] FROM dbo.Orders WHERE OrderID=@OrderID

	IF(@Version<>@curVersion)
	BEGIN
			RAISERROR('该订单已被其它任务更新，请重新加载订单信息后再进行修改！',16,1)
	END

	SET @Version=@Version+1

	UPDATE [Orders] SET 
	 FK_MerchantID=@FK_MerchantID ,
	[FK_ProductID] = @FK_ProductID,[FK_MerchantAppID] = @FK_MerchantAppID,[FK_UserID] = @FK_UserID,[UserName] = @UserName,[Price] = @Price,[PayStatus] = @PayStatus,[PayType] = @PayType,[DealDoneTime] = @DealDoneTime,[FlowStatus] = @FlowStatus,[Version] = @Version,[Remark] = @Remark,[RecordState] = @RecordState,[CreateTime] = @CreateTime,[CreaterID] = @CreaterID,[CreaterName] = @CreaterName,[UpdateTime] = @UpdateTime,[UpdaterID] = @UpdaterID,[UpdaterName] = @UpdaterName
	WHERE OrderID=@OrderID
	SET @ResultCode=1
END TRY
BEGIN CATCH
	SET @ResultMessage= ERROR_MESSAGE() 
	SET @ResultCode=0
END CATCH

GO
