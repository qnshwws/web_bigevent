$(function() {
    var layer = layui.layer

    var form = layui.form

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() { //初始化文章分类列表数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) { //渲染表格数据--模板引擎
                // console.log(res);
                // 参数1:模板的id; 参数2:要渲染的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr) //往tbody里面填充元素
            }
        })
    }

    // 为添加类别按钮绑定点击事件--弹出层 #btnAddCate添加类别按钮
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1, //0有确定按钮
            area: ['500px', '250px'], //为弹出层指定宽高
            title: '添加文章分类', //标题
            content: $('#dialog-add').html() //#dialog-add弹出层
        })
    })

    // 因为这个表单是通过动js态添加到网页的,只有当点击按钮才追加,所以不能直接绑定表单for-add(因为绑定时还没有元素)所以需要代理
    // $('#form-add').on('submit', , function(e) { 这样不行
    // 只能通过过代理的形式， 为 form - add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })


    // 通过代理的形式，为 btn-edit 按钮绑定点击事件--弹出层
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
            // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);
                form.val('form-edit', res.data) //需要先在html添加lay-filter
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit) //关闭弹出层
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件 btn-delete删除按钮 
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id') //获取自定义属性--需要先设置data-id
            // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) { //发请求删数据
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index) //关闭层
                    initArtCateList() //刷新数据
                }
            })
        })
    })

})