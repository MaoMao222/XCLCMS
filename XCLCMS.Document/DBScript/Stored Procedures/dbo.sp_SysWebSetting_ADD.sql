
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO





CREATE PROCEDURE [dbo].[sp_SysWebSetting_ADD]
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
		INSERT INTO [SysWebSetting](
		[SysWebSettingID],[KeyName],[KeyValue],[TestKeyValue],[UATKeyValue],[PrdKeyValue],[ValueType],[Remark],[FK_MerchantID],[FK_MerchantAppID],[RecordState],[CreateTime],[CreaterID],[CreaterName],[UpdateTime],[UpdaterID],[UpdaterName]
		)VALUES(
		@SysWebSettingID,@KeyName,@KeyValue,@TestKeyValue,@UATKeyValue,@PrdKeyValue,@ValueType,@Remark,@FK_MerchantID,@FK_MerchantAppID,@RecordState,@CreateTime,@CreaterID,@CreaterName,@UpdateTime,@UpdaterID,@UpdaterName
		)

		SET @ResultCode=1
	END TRY 
	BEGIN CATCH
		SET @ResultMessage= ERROR_MESSAGE() 
		SET @ResultCode=0
	END CATCH 

END




GO
