$(function() {
    var form = layui.form

    // 验证规则
    form.verify({
        // 原密码
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        // 新密码
        samePwd: function(value) { //value就是新密码输入的值
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        // 确认新密码
        rePwd: function(value) { //value 确认密码框里输入的值
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })


    // 发起ajax请求,绑定提交事件--修改密码 .layui-form表单
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                    // 重置表单
                    //  $('.layui-form') 是jquery元素
                    // $('.layui-form')[0] 是原生DOM元素
                    // 需要把jquery元素转换成DOM元素才能调用这个方法
                $('.layui-form')[0].reset()
            }
        })
    })
})