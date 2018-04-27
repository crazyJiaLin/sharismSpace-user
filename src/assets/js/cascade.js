/**
 * Cascade 瀑布流自封装组件
 * author : cjl
 * Last-Update-Date : 2018-4-23
 */
// 实例化代码
 //实例化瀑布流组件
//  this.Cascade = new Cascade({
//     cascadeWrapper : '#cascade-wrapper',    //父容器，需要根据父容器宽度进行排序
//     itemSelector : '.photo-item-wrapper',   //item选择器，是cascadeWrapper下的子标签
//     itemWidth : 250,    //item宽度
//     marginLeft : 20,    //每个item左右边距
//     marginTop : 25,     //每个item上下边距
//     resetSpeed : 150,         //重新排布瀑布流运动速度，毫秒
//     arrangeSpeed : 150,        //开始排布瀑布流运动速度，毫秒
// });
window.Cascade = (function(window,$){
    
    function Obj(options){
        this.setParams(options);
        this.init();
    }

    Obj.prototype = {
        constructor : Obj,
        setParams(options){    
            // console.log(options);
            //组件参数接收
            this.cascadeWrapper = $(options.cascadeWrapper);    //瀑布流父容器
            this.itemSelector = options.itemSelector || null;   //瀑布流排序内容
            this.itemWidth = options.itemWidth; //item元素宽度
            this.marginLeft = options.marginLeft; 
            this.marginTop = options.marginTop; 
            this.resetSpeed = options.resetSpeed;       //重新排布瀑布流运动速度，毫秒
            this.arrangeSpeed = options.arrangeSpeed; //开始排布瀑布流运动速度，毫秒

            //通过获取的参数设置全局变量
            this.wrapperWidth = this.cascadeWrapper.outerWidth();   //父容器的宽度
            this.colCount = Math.floor(this.wrapperWidth/(this.itemWidth + this.marginLeft));    //每行应该放几个
            //初始left偏移量（为了元素能够在容器中居中排布）
            this.initLeft = (this.wrapperWidth - (this.colCount*this.itemWidth + (this.colCount-1)*this.marginLeft))/2; 

            this.timer = null;  //为了获取节点开设的定时器
            this.compareArr = [];   //设置全局变量，来存放上次操作的index
            
        },
        init(){     //组件入口函数
            
        },
        resetCascade(index,callback){
            let that = this;
            if(index == 0){ //如果是第一次，将所有类名去掉,重新获取宽度以及初始化参数
                //通过获取的参数设置全局变量
                that.wrapperWidth = that.cascadeWrapper.outerWidth();   //父容器的宽度
                that.colCount = Math.floor(that.wrapperWidth/(that.itemWidth + that.marginLeft));    //每行应该放几个
                //初始left偏移量（为了元素能够在容器中居中排布）
                that.initLeft = (that.wrapperWidth - (that.colCount*that.itemWidth + (that.colCount-1)*that.marginLeft))/2; 
                that.compareArr = [];   //设置全局变量，来存放上次操作的index
                that.photoList.removeClass('reset');
            }
            if(index >= that.photoList.length){  //停止递归条件，当index值达到节点伪数组长度
                //递归结束前，重新设置父容器高度
                let maxHeight = that.photoList.eq(0).position().top + that.photoList.eq(0).outerHeight();
                for(let i=0;i<that.photoList.length;i++){
                    let curHeight = that.photoList.eq(i).position().top + that.photoList.eq(i).outerHeight();
                    if(curHeight > maxHeight){  //如果当前的比最小的小，进行互换
                        maxHeight = curHeight;
                    }
                }
                that.cascadeWrapper.css({
                    height : maxHeight + 'px'
                });
                return callback('重新排序完成');    //当所有排序执行完成后，执行回调函数
            }   
            if(that.photoList.eq(index).hasClass('reset')){
                // console.log(index + ' 节点已经排序过了');   
                return that.resetCascade(++index,callback);
            }
            if(that.compareArr.length < that.colCount){   //第一行，不设置top
                that.photoList.eq(index).addClass('reset').animate({   //开始动画
                    opacity : 1,
                    top : 0,
                    left : that.initLeft + index*(that.itemWidth + that.marginLeft)
                },that.resetSpeed,function(){   //动画速度300毫秒，运动结束后进行下一个运动
                    // console.log('第一行');
                    that.compareArr.push(index);
                    return that.resetCascade(++index,callback);
                });
            }else{  //第二到最后，开始设置top
                let oldIndex = that.compareArr[0];   //最小元素索引
                //最小元素top+高度
                let minHeight = that.photoList.eq(oldIndex).position().top + that.photoList.eq(oldIndex).outerHeight();
                // let maxHeight = that.photoList.eq(oldIndex).position().top + that.photoList.eq(oldIndex).outerHeight();
                //最小元素left
                let positionLeft = that.photoList.eq(oldIndex).position().left;
                for(let i=0;i<that.compareArr.length;i++){
                    let curHeight = that.photoList.eq(that.compareArr[i]).position().top + that.photoList.eq(that.compareArr[i]).outerHeight();
                    if(curHeight < minHeight){  //如果当前的比最小的小，进行互换
                        oldIndex = that.compareArr[i];
                        minHeight = curHeight;
                        positionLeft = that.photoList.eq(that.compareArr[i]).position().left;
                    }
                }
                                        
                // console.log(oldIndex);
                let curTop = minHeight + that.marginTop;     //当前插入元素应该设置的top
                //最后判断一下新添加元素和最大高度谁大，
                // let latestDOMHeight = curTop + that.photoList.eq(index).outerHeight();
                // console.log(latestDOMHeight,maxHeight);
                // if(latestDOMHeight > maxHeight){
                //     maxHeight = latestDOMHeight;
                //     let wrapperCurHeight = that.cascadeWrapper.outerHeight();
                //     if(maxHeight > wrapperCurHeight){
                //         that.cascadeWrapper.css({
                //             height : maxHeight + 'px'
                //         });
                //     }
                    
                // }
                that.photoList.eq(index).addClass('reset').animate({   //通过获取的这些参数，给当前DOM设置位置
                    opacity : 1,
                    top : curTop + 'px',
                    left : positionLeft
                },that.resetSpeed,function(){
                    // console.log('第'+index+'个');
                    that._replaceElementFromArr(that.compareArr,oldIndex,index);
                    return that.resetCascade(++index,callback);
                });                        
            } 
        },
        arrangeDOM(index,callback){
            let that = this;
            clearTimeout(that.timer);
            that.timer = setTimeout(function(){  //只有使用了定时器，才能获取到动态节点
                that.photoList = that.cascadeWrapper.find(that.itemSelector);
                if(index >= that.photoList.length){  //停止递归条件，当index值达到节点伪数组长度
                    return callback('排序执行完成');    //当所有排序执行完成后，执行回调函数
                }   

                if(that.photoList.eq(index).hasClass('arranged')){
                    // console.log(index + ' 节点已经排序过了');   
                    return that.arrangeDOM(++index,callback);
                }

                if(that.compareArr.length < that.colCount){   //第一行，不设置top
                    that.photoList.eq(index).addClass('arranged').animate({   //开始动画
                        opacity : 1,
                        top : 0,
                        left : that.initLeft + index*(that.itemWidth + that.marginLeft)
                    },that.arrangeSpeed,function(){   //动画速度300毫秒，运动结束后进行下一个运动
                        // console.log('第一行');
                        that.compareArr.push(index);
                        return that.arrangeDOM(++index,callback);
                    });
                }else{  //第二到最后，开始设置top
                    let oldIndex = that.compareArr[0];   //最小元素索引
                    //最小元素top+高度
                    let minHeight = that.photoList.eq(oldIndex).position().top + that.photoList.eq(oldIndex).outerHeight();
                    let maxHeight = that.photoList.eq(oldIndex).position().top + that.photoList.eq(oldIndex).outerHeight();
                    //最小元素left
                    let positionLeft = that.photoList.eq(oldIndex).position().left;
                    for(let i=0;i<that.compareArr.length;i++){
                        let curHeight = that.photoList.eq(that.compareArr[i]).position().top + that.photoList.eq(that.compareArr[i]).outerHeight();
                        if(curHeight < minHeight){  //如果当前的比最小的小，进行互换
                            oldIndex = that.compareArr[i];
                            minHeight = curHeight;
                            positionLeft = that.photoList.eq(that.compareArr[i]).position().left;
                        }else{  //如果当前的比最大的大，设置最大高度，设置父元素高度
                            maxHeight = curHeight;
                        }
                    }
                                            
                    // console.log(oldIndex);
                    let curTop = minHeight + that.marginTop;     //当前插入元素应该设置的top
                    //最后判断一下新添加元素和最大高度谁大，
                    let latestDOMHeight = curTop + that.photoList.eq(index).outerHeight();
                    // console.log(latestDOMHeight,maxHeight);
                    if(latestDOMHeight > maxHeight){
                        maxHeight = latestDOMHeight;
                        let wrapperCurHeight = that.cascadeWrapper.outerHeight();
                        if(maxHeight > wrapperCurHeight){
                            that.cascadeWrapper.css({
                                height : maxHeight + 'px'
                            });
                        }
                        
                    }
                    that.photoList.eq(index).addClass('arranged').animate({   //通过获取的这些参数，给当前DOM设置位置
                        opacity : 1,
                        top : curTop + 'px',
                        left : positionLeft
                    },that.arrangeSpeed,function(){
                        // console.log('第'+index+'个');
                        that._replaceElementFromArr(that.compareArr,oldIndex,index);
                        return that.arrangeDOM(++index,callback);
                    });                        
                }     

                
            },0);
        },
        _replaceElementFromArr(arr,oldVal,newVal){   //工具方法，将数组中oldval替换为newval
            // console.log(arr);
            for(let i=0; i<arr.length; i++){
                if(arr[i] == oldVal){
                    arr[i] = newVal;
                    return true;    //替换成功
                }
            }
            return false;   //替换失败
        }
    };

    return Obj;
})(window,jQuery);