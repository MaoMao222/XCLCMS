SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[sp_Comments_ADD]
@CommentsID bigint,
@ObjectType char(3),
@FK_ObjectID bigint,
@UserName nvarchar(50),
@Email varchar(100),
@ParentCommentID bigint,
@GoodCount int,
@MiddleCount int,
@BadCount int,
@Contents nvarchar(2000),
@VerifyState char(3),
@Remark nvarchar(200),
@FK_MerchantID bigint,
@FK_MerchantAppID bigint,
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
	INSERT INTO [Comments](
	[CommentsID],[ObjectType],[FK_ObjectID],[UserName],[Email],[ParentCommentID],[GoodCount],[MiddleCount],[BadCount],[Contents],[VerifyState],[Remark],[FK_MerchantID],[FK_MerchantAppID],[RecordState],[CreateTime],[CreaterID],[CreaterName],[UpdateTime],[UpdaterID],[UpdaterName]
	)VALUES(
	@CommentsID,@ObjectType,@FK_ObjectID,@UserName,@Email,@ParentCommentID,@GoodCount,@MiddleCount,@BadCount,@Contents,@VerifyState,@Remark,@FK_MerchantID,@FK_MerchantAppID,@RecordState,@CreateTime,@CreaterID,@CreaterName,@UpdateTime,@UpdaterID,@UpdaterName
	)
SET @ResultCode=1
END TRY
BEGIN CATCH
	SET @ResultMessage= ERROR_MESSAGE() 
	SET @ResultCode=0
END CATCH
GO
