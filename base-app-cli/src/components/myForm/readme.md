formItems

{
    label           => 表单项名称
    prop            => 表单绑定字段
    align           => 对齐方式 (默认left) left right center
    type            => 表单类型：input select radio dateTime upload textarea
    labelPosition   => 表单名称位置： left top (默认left)
    disabled        => 是否禁用 (默认 false)
    required        => 是否必填 (默认true)
    pattern         => 表单检验正则 (默认 /[\s\S]*/ )
    list            => 下拉数据 label value 形式
    defaultValue    => 默认值
    placeholder     => 占位文本 (默认请输入 请选择)
    maxCount        => 文件上传最大数 (默认不限制)
    requestApi      => 文件上传请求实例 (文件上传必传)
    dateTimeType    => 时间类型(默认完整 datetime) date year-month month-day time datetime datehour
    formatter       => 时间格式化 (默认yyyy-MM-dd hh:mm:ss)
}
