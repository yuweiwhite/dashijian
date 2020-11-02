$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    var p = {
        pagenum: 1,   // 页码值
        pagesize: 2,   // 每页显示多少数据
        cate_id: '',   // 文章分类的id
        state: '',    //  文章的状态，可以选已发布、草稿
    }
    initTable();

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    initCate();


    //  获取文章列表的接口函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: p,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    //  补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //  渲染左边下拉选项的值
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                //  使用模板引擎得到想要渲染的数据
                var htmlStr = template('tpl-cate', res)
                // 给下拉选项插入元素
                $('[name=cate_id]').html(htmlStr)
                // layui监听不到后面添加的元素， 需要调用render方法重新调用layui插件
                form.render()
            }
        })
    }
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 拿到下拉选项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 把得到的值赋值给刚开始的对象
        p.cate_id = cate_id;
        p.state = state;
        // 根据最新的筛选渲染文章页面
        initTable()
    })

    //  定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',  // 要渲染到盒子的ID不需要加#号
            count: total, // 总共有多少条数据
            limit: p.pagesize,  // 每页显示多少条数据
            curr: p.pagenum,   // 默认选中第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // jump - 切换分页的回调  触发有2中方式
            // 1.点击页码的时候，会触发jump回调函数
            // 2.只要调用了laypage.render方法就会触发
            jump: function (obj, first) {
                // 把值给p对象赋值
                // obj.curr得到当前页，以便向服务端请求对应页的数据。
                p.pagenum = obj.curr;
                // obj.limit 得到每页显示的条数
                p.pagesize = obj.limit;
                // first是布尔值，使用第二种方法的时候回调用就返回true, 第一种方法返回undefined
                console.log(first);
                if (!first) {
                    initTable();
                }
            }
        })
    }
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length
        console.log(len);
        layer.confirm('确定删除文章吗？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    // 当数据删除完成后，需要判断当前的这一页中，是否还有剩余数据
                    // 如果没有剩余数据了，则让页码值-1之后
                    // 在重新调用initTable 方法
                    if (len === 1) {
                        // 如果len的值等于1，证明删除完毕之后，页面就没有任何数据了，
                        // 页码值最小必须是1
                        p.pagenum = p.pagenum === 1 ? 1 : p.pagenum - 1
                    }
                    initTable();
                }
            })

            layer.close(index);
        });

    })


})