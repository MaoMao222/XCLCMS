SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[sp_Comments_Update]
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
	UPDATE [Comments] SET 
	ObjectType=@ObjectType , FK_MerchantID=@FK_MerchantID ,
	[FK_ObjectID] = @FK_ObjectID,[UserName] = @UserName,[Email] = @Email,[ParentCommentID] = @ParentCommentID,[GoodCount] = @GoodCount,[MiddleCount] = @MiddleCount,[BadCount] = @BadCount,[Contents] = @Contents,[VerifyState] = @VerifyState,[Remark] = @Remark,[FK_MerchantAppID] = @FK_MerchantAppID,[RecordState] = @RecordState,[CreateTime] = @CreateTime,[CreaterID] = @CreaterID,[CreaterName] = @CreaterName,[UpdateTime] = @UpdateTime,[UpdaterID] = @UpdaterID,[UpdaterName] = @UpdaterName
	WHERE CommentsID=@CommentsID
	SET @ResultCode=1
END TRY
BEGIN CATCH
	SET @ResultMessage= ERROR_MESSAGE() 
	SET @ResultCode=0
END CATCH
GO
