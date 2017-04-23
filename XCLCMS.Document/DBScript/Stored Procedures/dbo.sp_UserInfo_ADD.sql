
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO







/*****添加用户基本信息*****/ 
CREATE PROCEDURE [dbo].[sp_UserInfo_ADD]
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
		INSERT INTO [UserInfo](
		[UserInfoID],[UserName],[FK_MerchantID],[FK_MerchantAppID],[RealName],[NickName],[Pwd],[Age],[SexType],[Birthday],[Tel],[QQ],[Email],[OtherContact],[AccessType],[AccessToken],[UserState],[UserType],[Remark],[RoleName],[RoleMaxWeight],[RecordState],[CreateTime],[CreaterID],[CreaterName],[UpdateTime],[UpdaterID],[UpdaterName]
		)VALUES(
		@UserInfoID,@UserName,@FK_MerchantID,@FK_MerchantAppID,@RealName,@NickName,@Pwd,@Age,@SexType,@Birthday,@Tel,@QQ,@Email,@OtherContact,@AccessType,@AccessToken,@UserState,@UserType,@Remark,@RoleName,@RoleMaxWeight,@RecordState,@CreateTime,@CreaterID,@CreaterName,@UpdateTime,@UpdaterID,@UpdaterName
		)
		SET @ResultCode=1
	END TRY
	BEGIN CATCH
			SET @ResultMessage= ERROR_MESSAGE() 
			SET @ResultCode=0
	END CATCH
	

END







GO
