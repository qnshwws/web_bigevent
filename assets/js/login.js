$(function() {
    // ⭐模块一:注册/登录切换
    // 点击“去注册账号”的链接  
    $('#link_reg').on('click', function() { //只要点了第一个链接就把上面盒子隐藏，并展示下面的盒子
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”的链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })


    // ⭐模块二:自定义验证规则
    // 从 layui 中获取 form 对象
    var form = layui.form
    var layer = layui.layer //提示框

    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'], //数组格式
        // 校验两次密码是否一致的规则
        repwd: function(value) { //function 格式
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            // .reg-box是父节点  []属性选择器
            var pwd = $('.reg-box [name=password]').val()
                // var pwd = $('.reg-box .mm').val()
                //确认密码框的值是value  密码框的值是pwd
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单的提交事件  表单 #form_reg
    $('#form_reg').on('submit', function(e) {
        // 1. 阻止默认的提交行为
        e.preventDefault()
            // 2. 发起Ajax的POST请求
            // $.post('http://www.liulongbin.top:3007/api/reguser', {
            //     username: $('#form_reg [name=username]').val(),
            //     password: $('#form_reg [name=password]').val()
            // }, function(res) {
            //     if (res.status !== 0) {
            //         // return console.log(res.message);
            //         return layer.msg(res.message)

        //     }
        //     // console.log('注册成功!');
        //     layer.msg(res.message)
        //     layer.msg('注册成功，请登录！')
        //         // 模拟人的点击行为
        //     $('#link_login').click()
        // })
        //  代码优化-----------------------------------
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                console.log('注册成功!');
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
                // 模拟人的点击行为
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
            //         // $.post('http://www.liulongbin.top:3007/api/login', { data: $(this).serialize() },
            //         //     function(res) {
            //         //         if (res.status !== 0) {
            //         //             return layer.msg('登录失败！')
            //         //         }
            //         //         layer.msg('登录成功！')
            //         //         console.log(res.token);
            //         //         // localStorage.setItem('token', res.token)
            //         //         // location.href = '/index.html'
            // })

        //     // -----------------------------------------------
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                console.log(res.token);
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })

})