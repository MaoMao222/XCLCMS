
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO






CREATE PROCEDURE [dbo].[sp_SysLog_ADD]
@SysLogID BIGINT OUTPUT,
@LogLevel VARCHAR(50),
@LogType VARCHAR(50),
@RefferUrl VARCHAR(1000),
@Url VARCHAR(1000),
@Code VARCHAR(50),
@Title VARCHAR(500),
@Contents VARCHAR(4000),
@ClientIP VARCHAR(50),
@Remark VARCHAR(2000),
@FK_MerchantID BIGINT,
@FK_MerchantAppID BIGINT,
@CreateTime DATETIME,

@ResultCode INT OUTPUT,
@ResultMessage NVARCHAR(1000) OUTPUT

 AS 
 	BEGIN
		BEGIN TRY 
			INSERT INTO [SysLog](
			[LogLevel],[LogType],[RefferUrl],[Url],[Code],[Title],[Contents],[ClientIP],[Remark],[FK_MerchantID],[FK_MerchantAppID],[CreateTime]
			)VALUES(
			@LogLevel,@LogType,@RefferUrl,@Url,@Code,@Title,@Contents,@ClientIP,@Remark,@FK_MerchantID,@FK_MerchantAppID,@CreateTime
			)
			SET @ResultCode=1
			SET @SysLogID=SCOPE_IDENTITY()
		END TRY
		BEGIN CATCH
			SET @ResultMessage= ERROR_MESSAGE() 
			SET @ResultCode=0		
		END CATCH
	END







GO
