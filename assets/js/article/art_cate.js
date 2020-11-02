$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList();
    var indexAdd = null;
    //  渲染页面的调用函数+ 接口
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('请求失败')
                }
                var htmlStr = template('del', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 给添加图书绑定点击事件 
    $('#btnAddCate').on('click', function () {
        // 利用插件弹出显示框
        indexAdd = layer.open({
            // type  没有按钮
            type: 1,
            // 设置弹出框的大小
            area: ['500px', '250px'],
            title: '添加文章分类',
            // 弹出框的内容
            content: $('#dialog-add').html()
        });

    })
    // 添加图书弹出框的submit事件 利用事件委托
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // 调用添加图书接口
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('请求文章失败')
                }
                layer.msg('添加文章成功')
                // 渲染页面
                initArtCateList()
                // 关闭弹出窗口
                layer.close(indexAdd)
            }
        })
    })
    var indexEdit = null;
    // 给编辑按钮绑定点击事件， 利用事件委托
    $('tbody').on('click', '#btn-edit', function () {
        // 利用插件方法显示弹窗
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // 获取自定义属性
        var id = $(this).attr('data-id')
        // 调用更新文章信息接口
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章失败')
                }
                // 
                form.val('form-edit', res.data)
            }
        })
    })
    //  编辑表单submit的事件 ，
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        // 调用更新分类信息的接口
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败')
                }
                layer.msg('更新分类信息成功')
                // 调用渲染页面函数
                initArtCateList()
                // 关闭弹出窗口
                layer.close(indexEdit)
            }
        })
    })

    $('tbody').on('click', '#btn-delete', function () {    // 拿到自定义属性的值
        var id = $(this).siblings('button').attr('data-id')
        // 利用插件弹窗
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            // 调用删除文章接口
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    //  渲染页面
                    initArtCateList()
                    //关闭弹窗
                    layer.close(index);
                }
            })


        });
    })

})