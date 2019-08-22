<template>
    <div class="layout" >

        <!-- <div class="header">
            <h2> 共享打印 </h2> 
        </div> -->

        <div class="main">

            <div class="page1"  v-show="pageindex==1">
                <!-- <input
                    type="file"
                    @change="getFile( upload_file ,$event, 'print_file')"
                    ref="print_file"
                    id="print_file"
                    style="display:none;"
                    accept=".xls,.pdf,.doc,.xlsx,.docx"
                /> -->

                <input
                    type="file"
                    @change="getFile( upload_file ,$event, 'print_file')"
                    ref="print_file"
                    id="print_file"
                    style="display:none;"
                />

                <div>
                    <button class="el-button el-button-primary" @click="backhome"  > 返回首页 </button>

                    <button class="el-button el-button-primary"   @click="selectfile('print_file')"> 选择要打印的文件</button>
                </div>
               

                <div class="progress-wrapper"   v-show="uping" >
                    <div class="progress-progress" :style="uploadStyle"></div>
                    <div class="progress-rate">{{(uploadRate*100).toFixed(2)}}%</div>
                </div>

                <div v-show="upload_file.filename"> 
                    {{upload_file.filename}} ( {{upload_file.size }} {{upload_file.unit}} )
                    <span class="el-button-text" @click="upload_file.filename=''">删除</span>
                    <!-- <div id="box"> </div>   -->

                    <iframe
                        :src="upload_file.url"
                        width="100%"
                        height="650px"
                        frameborder="0">
                    </iframe>
                </div>

                <div class="footer" v-show="upload_file.filename">       
                    <button class="el-button el-button-primary"   @click="pageindex++"> 提交订单 </button>

                    <!-- <button class="el-button el-button-primary"   @click="uploadfile"> 上传文件 </button> -->
                </div>
                
            </div>
            
            <div class="page2" v-show="pageindex==2">
                <div>

                    <div class="row" >
                        <div class="title_col">
                            文件
                        </div>
                        <div class="main_col">
                            {{upload_file.filename}} ( {{upload_file.size }} {{upload_file.unit}} ) 
                        </div>
                    </div>

                    <div class="row" >
                        <div class="title_col">
                            色彩
                        </div>
                        <div class="main_col">
                            <input type="radio" name="color" value="black" v-model="print_args.color"> 黑白
                            <input type="radio" name="color" value="color" v-model="print_args.color"> 彩色
                        
                        </div>
                    </div> 

                    <div class="row" >
                        <div class="title_col">
                            单双面
                        </div>
                        <div class="main_col">
                            <input type="radio" name="side" value="one" v-model="print_args.side"> 单面
                            <input type="radio" name="side" value="two-sided-long-edge" v-model="print_args.side"> 双面长边
                            <input type="radio" name="side" value="two-sided-short-edgee" v-model="print_args.side"> 双面短边
                    
                        </div>
                    </div> 

                    <!-- <div class="row" >
                        <div class="title_col">
                            纸张大小
                        </div>
                        <div class="main_col">
                            <input type="radio" name="pagesize" value="A4" v-model="print_args.pagesize"> A4
                            <input type="radio" name="pagesize" value="A5" v-model="print_args.pagesize"> A5
                            <input type="radio" name="pagesize" value="A3" v-model="print_args.pagesize"> A3
                        
                        </div>
                    </div>  -->

                    <div class="row" >
                        <div class="title_col">
                            份数
                        </div>
                        <div class="main_col">
                            <input type="text" name="qty"  v-model="print_args.qty"> 
                        </div>
                    </div> 

                    <div class="row" >
                        <div class="title_col">
                            支付方式
                        </div>
                        <div class="main_col">
                           <template  v-for="item, ind in pay_types">
                               <input type="radio"   v-model="pay_type"  :value="item.id"  :key="ind"/> {{ item.text }} 
                           </template>

                        </div>
                    </div> 
                    
                </div>

                <div class="footer">
                    <button class="el-button el-button-primary" @click="backhome"  > 返回首页 </button>
                    <button class="el-button el-button-primary"   @click="pageindex--"> 上一步 </button>
                    <button class="el-button el-button-primary"   @click="nativepay"> 立即支付 </button>
                </div>
            
            </div>

            <div class ="page3" v-show="pageindex==3">
                <div  >
                    <div id="qrcode"  ref="qrcode" style="display:inline-block;"></div>
                </div>
                
                <div >
                    {{ print_status}}
                </div>

                <div class="footer">
                    <button class="el-button el-button-primary"  @click="refleshcode_rule" > 刷新支付码 </button>
                    <button class="el-button el-button-primary" @click="backhome"  > 返回首页 </button>
                    <!-- <button class="el-button el-button-primary"  @click="shensu"  v-show="upload_type == 'local'"> 打印失败申诉 </button> -->
                </div>
                
            </div>

        </div>
        
    </div>

</template>



<script>

//import axios from 'axios'
// import conf from '../config_cli'
import QRCode from 'qrcodejs2'
import { setInterval } from 'timers';
import { stringify } from 'querystring';
// import { clearTimeout } from 'timers';
import conf from '../config_cli'


export default {
    data(){
        return {
            pageindex:1,

            upload_file:{  
                filename: "",
                pdffilename:'',
                ufile: null,
                result: "",
      
                size: 0,
                unit: "kb",
                url:''
            },

            print_args:{
                color:'black',
                side:'one',
                pagesize:'A4',
                qty: 1
            },

            total_fee:0.01,

            pay_type:'weixin',
            pay_types:[ {id:'weixin', text:'微信'}],


            qr_url:'', //用于打码支付
            
            upload_type:'local', // local: 直接本地上传文件 , remote：移动端打码远程打开

            payStatus:false,
            print_status_id:0,

            order_id:'',
            timeout:null,

            device_id:'' ,

            fileUploadAPI: conf.uploadhost+ 'uploadapi/doUpload',//"/api/uploadapi/doUpload",
            fileDeleteAPI: conf.uploadhost+ 'uploadapi/delfile',//"/api/uploadapi/doUpload",

            uping: false,
            uploadStyle:{
                            width: '0%'
                        },
            uploadRate:0,


        }
    
    },

    watch:{
        pageindex:function(newval, oldval) {
            if ( newval <3){
                if ( this.timeout) {
                    window.clearInterval(this.timeout)
                  //  clearTimeout( this.timeout)
                    this.timeout =null
                }      
            }
        },

        payStatus:function(newval, oldval) {
            if ( newval ){
                if ( this.print_status_id <1 )
                    this.print_status_id = 1
            }else {
                this.print_status_id = 0;
            }
        },

    },

    computed:{
        print_status(){
            switch( this.print_status_id){
                case 1:
                    return '打印下发中...'

                case 2: 
                    return '打印中...'

                case 3: 
                    return '打印成功'
                case 4:
                    return '打印失败'
                default:
                    return '支付中...'
            }
        }

    },

    methods:{
        backhome(){
            if ( this.timeout){
                window.clearInterval(this.timeout)
                //  clearTimeout( this.timeout)
                this.timeout =null
            }
            console.log(localStorage.getItem("home"))
            window.location.href =localStorage.getItem("home"); 

          //  this.$router.replace({path:'/'});//替换路由，没有历史记录
        },

        shensu(){  //申诉

        },

        selectfile(ref) {
            document.getElementById(ref).click()
        },


        is_valid_file_type($file_type){
            if (($file_type == "image/gif")
                    || ($file_type == "image/jpeg")
                || ($file_type == "image/jpg")
                || ($file_type == "image/png")
                || ($file_type == "image/doc")
                || ($file_type == "application/pdf")
                || ($file_type == "application/wps-office.pptx")
                || ($file_type == "application/wps-office.xlsx")
                || ($file_type == "application/wps-office.docx")
                || ($file_type == "application/wps-office.ppt")
                || ($file_type == "application/vnd.ms-excel")
                || ($file_type == "application/wps-office.doc")
                || ($file_type == "application/msword")
                || ($file_type == "application/vnd.ms-powerpoint")
                || ($file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                || ($file_type == "application/vnd.openxmlformats-officedocument.presentationml.presentation")
                || ($file_type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")){
                return  true ;
            }else{
                return  false;
            }
        },


        async getFile(upload_file , event, ref) {
            var file = event.target.files[0];

            if ( ! this.is_valid_file_type( file.type )){
                alert('不支持的文件')
                return;
            }

            console.log(file);
            
            let filesize =file.size 

            //限制文件大小为100M
            if( filesize >100 *1024*1024 ){
                alert( '上传文件不能超过 100M')
                return 
            }

            //判断图片类型 webp，bmp,jpg,png,tif,gif 等
            let lastindex = event.target.files[0].name.lastIndexOf(".")    
            let extname =  event.target.files[0].name.substring(lastindex)
            extname =extname.toLowerCase();

            
            // if (extname !='.webp' && extname !='.bmp' && extname !='.jpg' && extname !='.jpeg' && extname !='.png'  && extname !='.tif'  && extname !='.gif' && extname !='.ico' ){
            //     alert( event.target.files[0].name  + this.$t('Application.notfiletype') +  '  (ico,bmp,png,gif,tif,jpg,jpeg,webp)')
            //     return 
            // }


            upload_file.ufile = file;
            upload_file.filename = file.name;
            
            upload_file.size = ((filesize* 1.0) / 1024).toFixed(3);
            if (upload_file.size >= 1024) {
                upload_file.size = (upload_file.size / 1024).toFixed(3);
                upload_file.unit = "MB";
            } else {
                upload_file.unit = "KB";
            }
            
            await  this.uploadfile(ref);
            
        },

        
        async uploadfile(ref){

            let vm = this;
            this.uploadRate = 0;
            this.uploadStyle.width = '0%';
            this.uping =true

            //上传文件
            let config = {
                headers: {
                "Content-Type": "multipart/form-data"
                },

                onUploadProgress: function (e) {
                    //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                    //如果lengthComputable为false，就获取不到e.total和e.loaded
                    if (e.lengthComputable) {
                        var rate = vm.uploadRate = e.loaded / e.total;  //已上传的比例
                        if (rate < 1) {
                            //这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
                            //因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
                            //等响应回来时，再将进度设为100%
                            vm.uploadRate = rate;
                            vm.uploadStyle.width = (rate *100).toFixed(2)+ '%';
                        }
                    }
                }

            }

     
            let params =new FormData();
            params.append("file", this.upload_file.ufile); 

            try {
           
                let data =await  this.axios.post(this.fileUploadAPI,params,config);
                data= data.data;
                console.log('upload return: ', JSON.stringify( data))

                if ( data.code !=0){
                    alert(data.msg);
                }

                this.upload_file.url = data.url.file.path
                this.upload_file.pdffilename = data.url.file.pdffilename

                // var box = document.getElementById('box') 
                // var str = `<embed src="${ this.upload_file.url}" type="application/pdf" width="100%" height="700px" ref="emb"  id="emb"/>`; 
                // box.innerHTML = str;   

                console.log( 'upload_file: ' , JSON.stringify( this.upload_file) )
            }
            catch(err){
                this.upload_file.result =err
                console.log('err:', err)
            }


            this.uploadRate = 0;
            this.uploadStyle.width = '0%';
            this.uping =false;

            this.$refs[ref].value = "";

        },


        generateqr(){

            this.$refs['qrcode'].value='';
            var element_div = document.getElementById("qrcode");
		  //window.alert("element_div"+element_div);
		    element_div.innerHTML = "";

            let qrcode = new QRCode('qrcode', { // qrcode  html为标签id
                width: 300, // 长度
                height: 300, // 宽度
                text: this.qr_url, // 内容
            // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas)
            // background: '#f0f'
            // foreground: '#ff0'
            })
 
        },

        nativepay(){  //二维码生成
          
            // let  print_args = { 
            //     color_mode: this.print_args.color,
            //     sides: this.print_args.side,
            //     copys:  this.print_args.qty 
            // }

            let print_args=`color_mode=${this.print_args.color},sides=${this.print_args.side},copys=${this.print_args.qty}`
      

            this.axios.get( this.conf.server +'/printapi/order', {
                params:{
                    total_fee:this.total_fee,
                    dev_id: this.device_id,
                    pay_type: this.pay_type,
                    file_url: this.upload_file.url,
                    filename: this.upload_file.filename,
                    qty: this.upload_file.qty,
                    print_args: JSON.stringify(print_args)
                }
            }).then(res => {

                console.log(res.data)

                this.order_id = res.data.out_trade_no
                this.total_fee = res.data.total_fee     

                console.log('order_id:', this.order_id)

                this.refleshcode_rule()

            })
        	
        },

        refleshcode_rule(){
            let dataPost = {
                out_trade_no:this.order_id, //后台生成的订单号
                total_fee:this.total_fee, //交易金额
                product_id: this.device_id, //'3b6e9e3694a243214afcbebc18121310'  //32位
            }

            this.axios.get(this.conf.server + '/pay/wxpay/unifiedOrder',
                {params: dataPost}
            ).then(res => {
                let data = res.data
                //返回的二维码信息，需要自己转为二维码图片
                this.qr_url = data.code_url
                this.order_id = data.order_id

                this.pageindex=3

                this.generateqr()

                //根据订单号向后台循环查询交易是否成功
                this.CheckBill(data.order_id)
    
                    
            }).catch(err =>{
                console.log(err)
                this.$throwError(err)
            })

        },


        CheckBill (order_id) {
            //参考https://juejin.im/post/5afb873f51882542ac7d6998
            //超过10m内循环
            if ( this.timeout ){
                return
            }

            this.timeout = setInterval( () =>{
                this.axios.get( this.conf.server +'/printapi/getorder', {
                // 向后端请求订单支付信息
                    params:{ order_id: order_id}
                })
                .then(res => {

                    console.log(res.data)

                    if ( res.data.code ){

                        let data = res.data.data;

                        console.log('data:' ,  data)

                        this.print_status_id = data.print_status_id;

                        if ( data.pay_status >0) { //数据库里的交易状态码，1为成功，0为失败
                            this.payStatus = true //交易成功

                            console.log( order_id, ': 支付成功')

                        }else {
                            this.payStatus = false //交易失败
                            this.print_status_id =0;
                        }

                    }else{
                        this.payStatus = false //交易失败
                        this.print_status_id =0;
                        console.log(  res.data.msg)
                    }
                   
                }).catch(err=>{
                    console.log( err)            
                })

            },  5*1000)

        },


    },

    mounted(){
        console.log( this.$route.query)

        // if ( this.$route.query.devid ){
        //     this.device_id =this.$route.query.devid
        // }
        this.device_id =localStorage.getItem("device_id");


        console.log('device_id: ', this.device_id )

        if ( this.$route.query.order_id ){
             this.order_id =this.$route.query.order_id
        }

        if ( this.$route.query.upload_type ){
             this.upload_type =this.$route.query.upload_type
        }

        if (this.$route.query.pageindex) {
            this.pageindex =this.$route.query.pageindex          
        }

        if ( this.pageindex>=3 && this.order_id  ){
            this.CheckBill(this.order_id)
        }

    },

    beforeDestroy () { 
        //触发方式,在console里面打myVue.$destroy();
        //在开始销毁实例时调用。此时实例仍然有功能。
        console.log(" localupload 销毁前");

        if ( this.timeout){
            window.clearInterval(this.timeout)
            //  clearTimeout( this.timeout)
            this.timeout =null
        }


    },



}
</script>

<style scoped>

.layout{
    /*width: 960px;*/
    max-width: 960px;
    margin: 0 auto;
}

.header{
    text-align: center;
}
.main{
    /* position:absolute; */
    margin-top:40px;
}
.footer{
    margin-top: 20px;
}
.el-button {
    
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    margin:10px 20px;
}

.el-button-primary {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
}

.el-button-mini,.el-button-small {
    font-size: 9px;
    border-radius: 3px;
}

.el-button-text {
    color: #409eff;
    background: 0 0;
    padding-left: 0;
    padding-right: 0;
}

.el-button-text:hover{
    cursor: pointer;
    color:white;
    background-color:darkgreen;
}

.row{
    color: #337ab7;
    display: flex;
    display:-webkit-flex;
    flex-wrap: row wrap ;
    justify-content:flex-start;
    align-items:flex-start;
    margin:20px,10px;
    padding-top:30px;
}

.title_col{
    width:150px;
    text-align: left;
    padding-top:10px;
}
.main_col{
    width:100%;
    text-align: left;
    padding-top:10px;
}

#canvas{
    width:500px;
    height: 500px;
}

.progress-wrapper { position: relative; height: 50px; border-radius: 5px; background-color: lightgrey; }
.progress-wrapper .progress-progress { position: absolute; left: 0; top: 0; height: 100%; width: 0%; border-radius: 5px; background-color: darkturquoise; z-index: 1; }
.progress-wrapper .progress-rate { position: relative; text-align: center; font-size: 14px; line-height: 50px; height: 100%; z-index:2;}


</style>