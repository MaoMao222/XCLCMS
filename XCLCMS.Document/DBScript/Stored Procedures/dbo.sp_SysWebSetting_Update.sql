
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO





CREATE PROCEDURE [dbo].[sp_SysWebSetting_Update]
@SysWebSettingID BIGINT,
@KeyName VARCHAR(100),
@KeyValue VARCHAR(2000),
@TestKeyValue VARCHAR(2000),
@UATKeyValue VARCHAR(2000),
@PrdKeyValue VARCHAR(2000),
@ValueType char(3),
@Remark VARCHAR(1000),
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

BEGIN 
	BEGIN TRY 
		UPDATE [SysWebSetting] SET 
		 KeyName=@KeyName , FK_MerchantID=@FK_MerchantID ,
		[KeyValue] = @KeyValue,[TestKeyValue] = @TestKeyValue,[UATKeyValue] = @UATKeyValue,[PrdKeyValue] = @PrdKeyValue,[ValueType]=@ValueType,[Remark] = @Remark,[FK_MerchantAppID] = @FK_MerchantAppID,[RecordState] = @RecordState,[CreateTime] = @CreateTime,[CreaterID] = @CreaterID,[CreaterName] = @CreaterName,[UpdateTime] = @UpdateTime,[UpdaterID] = @UpdaterID,[UpdaterName] = @UpdaterName
		WHERE SysWebSettingID=@SysWebSettingID

		SET @ResultCode=1
	END TRY
	BEGIN CATCH
		SET @ResultMessage= ERROR_MESSAGE() 
		SET @ResultCode=0	
	END CATCH

END

 






GO
