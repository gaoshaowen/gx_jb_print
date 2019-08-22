<template>
    
<div class="layout"> 
    <div class="header">
        <div class="partnerSwiper">
          <swiper :options="swiperOption" ref="mySwiper">
           
            <swiper-slide v-for="(item,index) in swipers" :key="index">
                <img :src="item.img"  class="swiperimg"/>
            </swiper-slide>
           
            <div class="swiper-pagination"  slot="pagination"></div>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
            <div class="swiper-scrollbar"   slot="scrollbar"></div>
          </swiper>
        </div>
    </div>
    <div class="main flexbox">

        <div class="flexitem">
            <a href="#" @click.prevent="localupload">
                 <img :src="conf.virtualpath +'static/img/usb.jpg'"  class="usbimg" />
            </a>
            <h2>
                U盘上传
            </h2>
        </div>

        <div class="flexitem">
            <div>
                <div id="qrcode"  style="display:inline-block;"></div>
            </div>
            <h2>
                手机上传
            </h2>
        </div>
        
    </div>

    <div class="footer">
        <img :src="conf.virtualpath +'static/img/shangbiao.jpg'"  />
    </div>

</div> 

</template>

<script>

import QRCode from 'qrcodejs2'
import conf from '../config_cli'
import { setInterval } from 'timers';
import uuid from '../utils/uuid'

export default {
    data(){
        return{
            swiperOption: {
                // 如果需要分页器
                pagination: {
                  el:'.swiper-pagination',
                  type: 'bullets',  
                  clickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
                  hideOnClick: true, //默认分页器会一直显示。这个选项设置为true时点击Swiper会隐藏/显示分页器。
                },
                notNextTick: true,
                // 如果需要自动播放
                autoplay : {
                  delay:3000,
                  disableOnInteraction:false,  //用户操作swiper之后，是否禁止autoplay。
                  //reverseDirection: true,   //开启反向自动轮播。
                },
                // 如果需要前进后退按钮
                navigation: {
                  nextEl: '.swiper-button-next', //前进按钮的css选择器或HTML元素。
                  prevEl: '.swiper-button-prev', //后退按钮的css选择器或HTML元素。
                  hideOnClick: true, //点击slide时显示/隐藏按钮
                },
                // 如果需要滚动条
                scrollbar: {
                  el: '.swiper-scrollbar',
                  hide: true, //滚动条是否自动隐藏。默认：false，不会自动隐藏。
                  draggable: true, //该参数设置为true时允许拖动滚动条。
                  snapOnRelease: true, //如果设置为false，释放滚动条时slide不会自动贴合。
                  dragSize: 10, //设置滚动条指示的尺寸。默认'auto': 自动，或者设置num(px)。
                },
                effect:"coverflow",
                grabCursor : true,
                setWrapperSize :true,
                mousewheelControl : true,
                observeParents:true,

            },

            swipers:[
                {url:'static/lunbo',img: conf.virtualpath +'static/lunbo/1.jpg'},
                {url:'static/lunbo',img:conf.virtualpath +'static/lunbo/2.jpg'},
                {url:'static/lunbo',img:conf.virtualpath +'static/lunbo/3.jpg'}
            ],

            device_id:'3b6e9e3694a243214afcbebc18121310',

        }
    },

        // 如果你需要得到当前的swiper对象来做一些事情，你可以像下面这样定义一个方法属性来获取当前的swiper对象，同时notNextTick必须为true
    computed: {
        swiper() {
          return this.$refs.mySwiper.swiper
        }
    },

    methods:{

        localupload(){ //导航到本地
            if (  this.timeout)
            {
                window.clearTimeout(this.timeout)
                this.timeout =null 
            }
            this.$router.push('/localupload?devid=' + this.device_id)
        },

        generateqr(device_id){
           
            let url = window.location.href;
            let index = url.indexOf('?')

            if ( index>0){
                url =url.substring(0, index)
            }

            let qr_code=  url + 'RemoteUpload?devid=' +device_id
            console.log( 'qr_code:', qr_code)    
        
            let qrcode = new QRCode('qrcode', { // qrcode  html为标签id
                width: 200, // 长度
                height: 200, // 宽度
                text: qr_code, // 内容
            // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas)
            // background: '#f0f'
            // foreground: '#ff0'
            })
 
        },


        myrefresh(){
            // 自升级
            window.location.reload();
        }

      
    },

    mounted() {

        this.timeout = setTimeout(this.myrefresh , 3600000); //指定1fen刷新一次

        setInterval( ()=>{
            //可以写获取轮播图片,

        } , 30000)  //每分钟获取一次


        //鼠标覆盖停止自动切换
        this.swiper.el.onmouseover = function () {
            this.swiper.autoplay.stop();
        };

        //鼠标离开开始自动切换
        this.swiper.el.onmouseout = function () {
            this.swiper.autoplay.start();
        };

        
        if ( this.$route.query.devid ){
            this.device_id =this.$route.query.devid
        }else{
            this.device_id = uuid.uuidv1().replace(/-/g,'')
        }

        console.log('home device_id: ', this.device_id )
        localStorage.setItem("device_id", this.device_id);

        localStorage.setItem("home", window.location.href); 


        this.$socket.emit('login',{devid:this.device_id });


        //接收服务端的信息
        this.sockets.subscribe('login_back', (data) => {
            console.log('login_back:', data)

        })

    
        this.sockets.subscribe('openremoteupload', (data) => {

            if ( this.timeout)
            {
                window.clearTimeout(this.timeout)
                this.timeout =null 
            }

            this.$router.push('/remoteupload2?devid=' + this.device_id)
            
        })


        //得到设备ID
        this.generateqr(this.device_id)
 
    }




}
</script>

<style  scoped>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

	html,body{
		height: 100%;
        text-align:center
	}

    .layout{
        /* width: 1400px; */
        margin: 0 auto;
        position: absolute; 
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
        
       
    }

    .header{
        margin: 0 auto;
        /* background-color: red; */
        top:0px;
        height:50%;
        min-height: 300px;
        width:100%; 
        overflow: hidden;
        background-color: white; 
    }

    .main{
        margin: 40px auto;
        /* position: absolute; */
        height: 30%;
        width: 100%; 
        width:100%; 
        min-height: 250px;
        bottom: 41px;
        background-color: white; 
        margin-bottom: 0px;
    }
    .footer{

        position: absolute;
        width: 100%;
        min-height: 36px;
        bottom: 0px;
        /* background-color: blue; */
        overflow: hidden;
        z-index: -1;
    }

    .flexbox{
 
        display:-webkit-flex;
        display:flex;
        flex-wrap: row wrap ;
        justify-content:space-around;
        align-items:flex-start;
    } 

    .flexitem{
        box-sizing: border-box;
        display: inline-block;
  
       
        width: 360px;
        height:250px;
        overflow: hidden;
       
    }

    .swiperimg{
        max-height: 300px;
    } 

    .usbimg{
        width: 200px;
        height: 200px;
    }

    h2{
        margin-top:3px;
        color:dimgray;
    }


</style>