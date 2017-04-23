
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO















/*****更新用户基本信息*****/  
CREATE PROCEDURE [dbo].[sp_UserInfo_Update]
@UserInfoID BIGINT,
@UserName VARCHAR(50),
@FK_MerchantID BIGINT,
@FK_MerchantAppID BIGINT,
@RealName NVARCHAR(50),
@NickName NVARCHAR(50),
@Pwd VARCHAR(50),
@Age INT,
@SexType CHAR(1),
@Birthday DATETIME,
@Tel VARCHAR(50),
@QQ VARCHAR(50),
@Email VARCHAR(100),
@OtherContact NVARCHAR(500),
@AccessType VARCHAR(50),
@AccessToken VARCHAR(100),
@UserState CHAR(1),
@UserType char(3),
@Remark NVARCHAR(1000),
@RoleName NVARCHAR(100),
@RoleMaxWeight INT,
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
	UPDATE [UserInfo] SET 
	UserName=@UserName , FK_MerchantID=@FK_MerchantID , RealName=@RealName , NickName=@NickName ,
	[FK_MerchantAppID] = @FK_MerchantAppID,[Pwd] = @Pwd,[Age] = @Age,[SexType] = @SexType,[Birthday] = @Birthday,[Tel] = @Tel,[QQ] = @QQ,[Email] = @Email,[OtherContact] = @OtherContact,[AccessType] = @AccessType,[AccessToken] = @AccessToken,[UserState] = @UserState,[UserType]=@UserType,[Remark] = @Remark,[RoleName] = @RoleName,[RoleMaxWeight] = @RoleMaxWeight,[RecordState] = @RecordState,[CreateTime] = @CreateTime,[CreaterID] = @CreaterID,[CreaterName] = @CreaterName,[UpdateTime] = @UpdateTime,[UpdaterID] = @UpdaterID,[UpdaterName] = @UpdaterName
	WHERE UserInfoID=@UserInfoID

	
		SET @ResultCode=1
	END TRY
	BEGIN CATCH
		SET @ResultMessage= ERROR_MESSAGE() 
		SET @ResultCode=0	
	END CATCH

END






GO
