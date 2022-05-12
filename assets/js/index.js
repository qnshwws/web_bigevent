$(function() {
    // 调用 getUserInfo 获取用户基本信息
    getUserInfo()

    var layer = layui.layer

    // 点击按钮，实现退出功能
    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出 confirm-询问框
        // icon--显示指定什么图标  title--指定标题
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token')
                // 2. 重新跳转到登录页面
            location.href = '/login.html'

            // 关闭 confirm 询问框
            layer.close(index)
        })
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },  优化---统一设置请求头
        success: function(res) {
                if (res.status !== 0) { // 请求失败
                    return layui.layer.msg('获取用户信息失败！')
                }
                // 调用 renderAvatar 渲染用户的头像
                renderAvatar(res.data)
                    // console.log(res);
            }
            // 不论成功还是失败，最终都会调用 complete 回调函数
            // complete: function(res) {
            //     console.log('执行了 complete 回调：')
            //     console.log(res)
            //         // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 1. 强制清空 token
            //         localStorage.removeItem('token')
            //             // 2. 强制跳转到登录页面
            //         location.href = '/login.html'
            //     }
            // }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1. 获取用户的名称  nickname昵称  username登录名
    var name = user.nickname || user.username
        // 2. 设置欢迎的文本 #welcome是span元素
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 3. 按需渲染用户的头像  user_pic图片头像>text-avatar文本头像
    if (user.user_pic !== null) { //有user_pic图片头像
        // 3.1 渲染图片头像
        $('.layui-nav-img') //.layui-nav-img图片头像
            .attr('src', user.user_pic)
            .show()
        $('.text-avatar').hide() //隐藏文本头像
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide() //隐藏图片头像
        var first = name[0].toUpperCase() //用户名字第一个英文字符转大写
        $('.text-avatar')
            .html(first)
            .show()
    }
}