
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO





















CREATE PROC [dbo].[sp_GenerateID](
	@ResultCode INT OUTPUT,
	@ResultMessage NVARCHAR(1000) OUTPUT,

	@IDType CHAR(3),
	@Remark NVARCHAR(100),
	@IDValue BIGINT OUT,
	@IDCode BIGINT OUT
) AS
--生成ID值
BEGIN
	BEGIN TRAN trans
	
	BEGIN TRY
		
		--用户信息ID
		IF(@IDType='USR')
		BEGIN
			SELECT @IDValue=ISNULL(MAX(IDValue),100)+1 FROM dbo.GenerateID WHERE IDType=@IDType
			SET @IDCode=CAST('100'+CAST(@IDValue AS VARCHAR) AS BIGINT)
		END
		--评论
		ELSE IF (@IDType='CMT')
		BEGIN
			SELECT @IDValue=ISNULL(MAX(IDValue),100)+1 FROM dbo.GenerateID WHERE IDType=@IDType
			SET @IDCode=CAST('101'+CAST(@IDValue AS VARCHAR) AS BIGINT)		        
		END
		--系统配置ID
		ELSE IF(@IDType='SET')
		BEGIN
			SELECT @IDValue=ISNULL(MAX(IDValue),100)+1 FROM dbo.GenerateID WHERE IDType=@IDType
			SET @IDCode=CAST('200'+CAST(@IDValue AS VARCHAR) AS BIGINT)
		END
		--系统字典
		ELSE IF(@IDType='DIC')
		BEGIN
			SELECT @IDValue=ISNULL(MAX(IDValue),100)+1 FROM dbo.GenerateID WHERE IDType=@IDType
			SET @IDCode=CAST('300'+CAST(@IDValue AS VARCHAR) AS BIGINT)
		END
		--系统功能
		ELSE IF(@IDType='FUN')
		BEGIN
			SELECT @IDValue=ISNULL(MAX(IDValue),100)+1 FROM dbo.GenerateID WHERE IDType=@IDType
			SET @IDCode=CAST('400'+CAST(@IDValue AS VARCHAR) AS BIGINT)
		END
		--角色
		ELSE IF(@IDType='RLE')
		BEGIN
			SELECT @IDValue=ISNULL(MAX(IDValue),100)+1 FROM dbo.GenerateID WHERE IDType=@IDType
			SET @IDCode=CAST('500'+CAST(@IDValue AS VARCHAR) AS BIGINT)		
		END
		--商户信息
		ELSE IF(@IDType='MER')
		BEGIN
			SELECT @IDValue=ISNULL(MAX(IDValue),100)+1 FROM dbo.GenerateID WHERE IDType=@IDType
			SET @IDCode=CAST('600'+CAST(@IDValue AS VARCHAR) AS BIGINT)		
		END		
		--附件
		ELSE IF(@IDType='ATT')
		BEGIN
			SELECT @IDValue=ISNULL(MAX(IDValue),100)+1 FROM dbo.GenerateID WHERE IDType=@IDType
			SET @IDCode=CAST('700'+CAST(@IDValue AS VARCHAR) AS BIGINT)		
		END		
		--文章信息
		ELSE IF(@IDType='ART')
		BEGIN
			SELECT @IDValue=ISNULL(MAX(IDValue),100)+1 FROM dbo.GenerateID WHERE IDType=@IDType
			SET @IDCode=CAST('800'+CAST(@IDValue AS VARCHAR) AS BIGINT)		
		END		
		--商户应用信息
		ELSE IF(@IDType='MEP')
		BEGIN
			SELECT @IDValue=ISNULL(MAX(IDValue),100)+1 FROM dbo.GenerateID WHERE IDType=@IDType
			SET @IDCode=CAST('900'+CAST(@IDValue AS VARCHAR) AS BIGINT)		
		END
		--友情链接
		ELSE IF(@IDType='LIK')
		BEGIN
			SELECT @IDValue=ISNULL(MAX(IDValue),100)+1 FROM dbo.GenerateID WHERE IDType=@IDType
			SET @IDCode=CAST('901'+CAST(@IDValue AS VARCHAR) AS BIGINT)		
		END
		--标签
		ELSE IF(@IDType='TAG')
		BEGIN
			SELECT @IDValue=ISNULL(MAX(IDValue),100)+1 FROM dbo.GenerateID WHERE IDType=@IDType
			SET @IDCode=CAST('902'+CAST(@IDValue AS VARCHAR) AS BIGINT)		
		END
		--广告位
		ELSE IF(@IDType='ADS')
		BEGIN
			SELECT @IDValue=ISNULL(MAX(IDValue),100)+1 FROM dbo.GenerateID WHERE IDType=@IDType
			SET @IDCode=CAST('903'+CAST(@IDValue AS VARCHAR) AS BIGINT)		
		END
		
		INSERT INTO dbo.GenerateID ( IDType, IDValue,IDCode,CreateTime, Remark ) VALUES(@IDType,@IDValue,@IDCode,GETDATE(),@Remark)	
	
		SET @ResultCode=1
		COMMIT TRAN
	
	END TRY
	BEGIN CATCH
	
		SET @ResultMessage= ERROR_MESSAGE() 
		SET @ResultCode=0
		ROLLBACK TRAN		
		
	END CATCH

	
END



















GO
