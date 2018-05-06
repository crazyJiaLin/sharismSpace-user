<template>
    <div>
        <h1>外部调用UEditor的多图上传和附件上传示例</h1>
        
        <button type="button" id="j_upload_img_btn">多图上传</button>
        <ul id="upload_img_wrap"></ul>
        
        <button type="button" id="j_upload_file_btn">附件上传</button>
        <ul id="upload_file_wrap"></ul>
        
        <!-- 加载编辑器的容器 -->
        <textarea id="uploadEditor" style="display: none;"></textarea>
    </div>
</template>

<script>
    export default{
        methods : {
            
        },
        mounted(){
            // 实例化编辑器，这里注意配置项隐藏编辑器并禁用默认的基础功能。
            var uploadEditor = UE.getEditor("uploadEditor", {
                    isShow: false,
                    focus: false,
                    enableAutoSave: false,
                    autoSyncData: false,
                    autoFloatEnabled:false,
                    wordCount: false,
                    sourceEditor: null,
                    scaleEnabled:true,
                    toolbars: [["insertimage", "attachment"]]
                });
            uploadEditor.ready(function () {
                // 监听插入图片
                uploadEditor.addListener("beforeInsertImage", _beforeInsertImage);
                // 监听插入附件
                uploadEditor.addListener("afterUpfile",_afterUpfile);
            });
            document.getElementById('j_upload_img_btn').onclick = function () {
            var dialog = uploadEditor.getDialog("insertimage");
                dialog.title = '多图上传';
                dialog.render();
                dialog.open();
            };
            
            document.getElementById('j_upload_file_btn').onclick = function () {
                var dialog = uploadEditor.getDialog("attachment");
                dialog.title = '附件上传';
                dialog.render();
                dialog.open();
            };
            function _beforeInsertImage(t, result) {
                var imageHtml = '';
                for(var i in result){
                    imageHtml += '<li><img src="'+result[i].src+'" alt="'+result[i].alt+'" height="150"></li>';
                }
                document.getElementById('upload_img_wrap').innerHTML = imageHtml;
            }
            function _afterUpfile(t, result) {
                var fileHtml = '';
                for(var i in result){
                    fileHtml += '<li><a href="'+result[i].url+'" target="_blank">'+result[i].url+'</a></li>';
                }
                document.getElementById('upload_file_wrap').innerHTML = fileHtml;
            }
        }
    }
</script>