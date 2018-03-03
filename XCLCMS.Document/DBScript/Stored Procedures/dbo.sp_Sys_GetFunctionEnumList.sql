
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO






CREATE PROC [dbo].[sp_Sys_GetFunctionEnumList] AS 
--生成模块功能的c# 枚举
BEGIN

DECLARE @str VARCHAR(MAX)=''
DECLARE @br VARCHAR(2)=CHAR(13)+CHAR(10)

;WITH FuncInfo AS (
	SELECT
	*,
	(
		SELECT TOP 1 FunctionName FROM dbo.SysFunction AS b WITH(NOLOCK)  WHERE b.SysFunctionID=a.ParentID
	) AS ParentName
	FROM dbo.v_SysFunction AS a  WITH(NOLOCK) WHERE a.IsLeaf=1 AND a.RecordState='N'
)
SELECT
@str=@str+('/// <summary>'+@br+'///'+ (ISNULL(ParentName,'')+'-'+ISNULL(FunctionName,''))+@br+'/// </summary>'+@br+'[Description("'+(ISNULL(ParentName,'')+'-'+ISNULL(FunctionName,''))+'")]'+@br+ISNULL(code,'') +'=' +CAST(SysFunctionID AS VARCHAR)+',')+@br
FROM FuncInfo ORDER BY ParentID ASC

SELECT @str

END




GO
