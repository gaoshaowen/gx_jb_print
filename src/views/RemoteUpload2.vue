<template>
  <div class="layout">
    <!-- <div class="header">
            <h2> 共享打印 </h2> 
    </div>-->

    <div class="main">
      <div class="page1" v-show="pageindex==1">
        <div>
          <button class="el-button el-button-primary" @click="backhome">返回首页</button>
        </div>

        <h2 v-show="upload_file.filename.length ==0">手机端正在上传文件......</h2>

        <div v-show="upload_file.filename">
          {{upload_file.filename}} ( {{upload_file.size }} {{upload_file.unit}} )
          <span
            class="el-button-text"
            @click="upload_file.filename=''"
          >删除</span>
          <!-- <div id="box"> </div>      -->
          <!-- <iframe :src="upload_file.url" width="100%" height="650px" frameborder="0"></iframe> -->
          <pdf v-bind:src="upload_file.url"></pdf>
        </div>

        <div class="footer" v-show="upload_file.filename">
          <button class="el-button el-button-primary" @click="pageindex++">提交订单</button>
        </div>
      </div>

      <div class="page2" v-show="pageindex==2">
        <div>
          <div class="row">
            <div class="title_col">文件</div>
            <div
              class="main_col"
            >{{upload_file.filename}} ( {{upload_file.size }} {{upload_file.unit}} )</div>
          </div>

          <div class="row">
            <div class="title_col">色彩</div>
            <div class="main_col">
              <input type="radio" name="color" value="black" v-model="print_args.color" /> 黑白
              <input type="radio" name="color" value="color" v-model="print_args.color" />
              彩色
            </div>
          </div>

          <div class="row">
            <div class="title_col">单双面</div>
            <div class="main_col">
              <input type="radio" name="side" value="one" v-model="print_args.side" /> 单面
              <input
                type="radio"
                name="side"
                value="two-sided-long-edge"
                v-model="print_args.side"
              /> 双面长边
              <input
                type="radio"
                name="side"
                value="two-sided-short-edgee"
                v-model="print_args.side"
              />
              双面短边
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
          </div>-->

          <div class="row">
            <div class="title_col">份数</div>
            <div class="main_col">
              <!-- <input type="text" name="qty" v-model="print_args.qty" /> -->
              <button class="select_nums" @click="downNumber">-</button>
              <span>{{ print_args.qty }}</span>
              <button class="select_nums" @click="upNumber">+</button>
            </div>
          </div>
          <!-- 添加页数 -->
          <div class="row">
            <div class="title_col">文件页数</div>
            <!-- 获取pdf的总页数 -->
            <div class="main_col">
              <!-- 直接传入pdf文件的url，拿到总页数，不调用PDF.vue组件 -->

              <span>{{ totalpages }}</span>
            </div>
          </div>

          <!-- 打印的总页数（份数*文件页数 -->
          <div class="row">
            <div class="title_col">总页数</div>
            <div class="main_col">
              <span>{{ print_args.qty * totalpages }}</span>
            </div>
          </div>

          <!-- 总金额 = 单价*份数*总页数-->
          <div class="row">
            <div class="title_col">总金额</div>
            <div class="main_col">
              <span>{{ total_fee * print_args.qty * totalpages }}</span>
            </div>
          </div>

          <div class="row">
            <div class="title_col">支付方式</div>
            <div class="main_col">
              <template v-for="item, ind in pay_types">
                <input type="radio" v-model="pay_type" :value="item.id" :key="ind" />
                {{ item.text }}
              </template>
            </div>
          </div>
        </div>

        <div class="footer">
          <button class="el-button el-button-primary" @click="backhome">返回首页</button>
          <button class="el-button el-button-primary" @click="pageindex--">上一步</button>
          <button class="el-button el-button-primary" @click="nativepay">立即支付</button>
        </div>
      </div>

      <div class="page3" v-show="pageindex==3">
        <div>
          <div id="qrcode" ref="qrcode" style="display:inline-block;"></div>
        </div>

        <div>{{ print_status}}</div>

        <div class="footer">
          <button class="el-button el-button-primary" @click="refleshcode_rule">刷新支付码</button>
          <button class="el-button el-button-primary" @click="backhome">返回首页</button>
          <!-- <button class="el-button el-button-primary"  @click="shensu" > 打印失败申诉 </button> -->
        </div>
      </div>
    </div>
  </div>
</template>



<script>
//import axios from 'axios'
// import conf from '../config_cli'
import QRCode from "qrcodejs2";
//import { clearScreenDown } from 'readline';
// import { clearTimeout } from 'timers';
import pdf from "../components/PDF";
import PDFJS from "pdfjs-dist";

export default {
  components: {
    pdf
  },
  data() {
    return {
      pageindex: 1,
      totalpages: 0,
      upload_file: {
        filename: "",
        pdffilename: "",
        size: 0,
        unit: "kb",
        url: ""
      },

      print_args: {
        color: "black",
        side: "one",
        pagesize: "A4",
        qty: 1
      },

      total_fee: 0.01,

      pay_type: 1,
      pay_types: [{ id: 1, text: "微信" }],

      qr_url: "", //用于打码支付

      payStatus: false,
      retryCount: 0,
      print_status_id: 0,

      order_id: "",
      timeout: null,

      device_id: "",

      msg1: "hello "
    };
  },

  watch: {
    pageindex: function(newval, oldval) {
      if (newval < 3) {
        if (this.timeout) {
          window.clearInterval(this.timeout);
          //  clearTimeout( this.timeout)
          this.timeout = null;
        }
      }
    },

    payStatus: function(newval, oldval) {
      if (newval) {
        if (this.print_status_id < 1) this.print_status_id = 1;
      } else {
        this.print_status_id = 0;
      }
    }
  },

  computed: {
    print_status() {
      switch (this.print_status_id) {
        case 1:
          return "打印下发中...";

        case 2:
          return "打印中...";

        case 3:
          return "打印成功";
        case 4:
          return "打印失败";
        default:
          return "支付中...";
      }
    }
  },

  methods: {
    //   添加打印份数选择的函数
    downNumber() {
      if (this.print_args.qty > 1) {
        this.print_args.qty--;
      }
    },
    upNumber() {
      this.print_args.qty++;
    },

    backhome() {
      if (this.timeout) {
        window.clearInterval(this.timeout);
        this.timeout = null;
      }

      window.location.href = localStorage.getItem("home");
      //this.$router.replace({path:'/'});//替换路由，没有历史记录
    },

    shensu() {
      //申诉
    },

    generateqr() {
      this.$refs["qrcode"].value = "";
      var element_div = document.getElementById("qrcode");
      //window.alert("element_div"+element_div);
      element_div.innerHTML = "";

      let qrcode = new QRCode("qrcode", {
        // qrcode  html为标签id
        width: 300, // 长度
        height: 300, // 宽度
        text: this.qr_url // 内容
        // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas)
        // background: '#f0f'
        // foreground: '#ff0'
      });
    },

    nativepay() {
      //二维码生成

      let print_args = `color_mode=${this.print_args.color},sides=${this.print_args.side},copys=${this.print_args.qty}`;

      this.axios
        .get(this.conf.server + "/printapi/order", {
          params: {
            total_fee: this.total_fee,
            dev_id: this.device_id,
            pay_type: this.pay_type,
            file_url: this.upload_file.url,
            filename: this.upload_file.filename,
            qty: this.print_args.qty,
            print_args: print_args
          }
        })
        .then(res => {
          console.log(res.data);

          this.order_id = res.data.out_trade_no;
          this.total_fee = res.data.total_fee;
          // ======直接通过pdf文件的url拿到总页数======
          PDFJS.getDocument(this.upload_file.url).then(pdf => {
            this.totalpages = pdf.numPages;
          });
          alert(this.totalpages);
          console.log("order_id:", this.order_id);

          this.refleshcode_rule();
        });
    },

    refleshcode_rule() {
      let dataPost = {
        out_trade_no: this.order_id, //后台生成的订单号
        total_fee: this.total_fee, //交易金额
        product_id: this.device_id //'3b6e9e3694a243214afcbebc18121310'  //32位
      };

      this.axios
        .get(this.conf.server + "/pay/wxpay/unifiedOrder", { params: dataPost })
        .then(res => {
          let data = res.data;
          //返回的二维码信息，需要自己转为二维码图片
          this.qr_url = data.code_url;
          this.order_id = data.order_id;

          this.pageindex = 3;

          this.generateqr();

          //根据订单号向后台循环查询交易是否成功
          this.CheckBill(data.order_id);
        })
        .catch(err => {
          console.log(err);
          this.$throwError(err);
        });
    },

    CheckBill(order_id) {
      //参考https://juejin.im/post/5afb873f51882542ac7d6998
      //超过10m内循环
      if (this.timeout) {
        return;
      }

      this.timeout = window.setInterval(() => {
        this.axios
          .get(this.conf.server + "/printapi/getorder", {
            // 向后端请求订单支付信息
            params: { order_id: order_id }
          })
          .then(res => {
            console.log(res.data);

            if (res.data.code) {
              let data = res.data.data;

              console.log("data:", data);

              this.print_status_id = data.print_status_id;

              if (data.pay_status > 0) {
                //数据库里的交易状态码，1为成功，0为失败
                this.payStatus = true; //交易成功

                console.log(order_id, ": 支付成功");
              } else {
                this.payStatus = false; //交易失败
                this.print_status_id = 0;
              }
            } else {
              this.payStatus = false; //交易失败
              this.print_status_id = 0;
              console.log(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }, 5 * 1000);
    }
  },

  mounted() {
    console.log(this.$route.query);

    if (this.$route.query.devid) {
      this.device_id = this.$route.query.devid;
    }

    console.log("device_id: ", this.device_id);

    if (this.$route.query.order_id) {
      this.order_id = this.$route.query.order_id;
    }

    if (this.$route.query.pageindex) {
      this.pageindex = this.$route.query.pageindex;
    }

    if (this.pageindex >= 3 && this.order_id) {
      this.handleCheckBill(this.order_id);
    }

    this.$socket.emit("login", { devid: this.device_id });

    //接收服务端的信息
    this.sockets.subscribe("tongbufile", data => {
      console.log("tongbufile:", data);

      this.upload_file = data.upload_file;
      this.pageindex = 1;
    });
  },

  beforeDestroy() {
    //触发方式,在console里面打myVue.$destroy();
    //在开始销毁实例时调用。此时实例仍然有功能。
    console.log(" localupload 销毁前");

    if (this.timeout) {
      window.clearInterval(this.timeout);
      //  clearTimeout( this.timeout)
      this.timeout = null;
    }
  }
};
</script>

<style scoped>
.layout {
  /*width: 960px;*/
  max-width: 960px;
  margin: 0 auto;
}

.header {
  text-align: center;
}
.main {
  /* position:absolute; */
  margin-top: 40px;
}
.footer {
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
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  margin: 10px 20px;
}

.el-button-primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

.el-button-mini,
.el-button-small {
  font-size: 9px;
  border-radius: 3px;
}

.el-button-text {
  color: #409eff;
  background: 0 0;
  padding-left: 0;
  padding-right: 0;
}

.el-button-text:hover {
  cursor: pointer;
  color: white;
  background-color: darkgreen;
}

.row {
  color: #337ab7;
  display: flex;
  display: -webkit-flex;
  flex-wrap: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 20px, 10px;
  padding-top: 30px;
}

.title_col {
  width: 150px;
  text-align: left;
  padding-top: 10px;
}
.main_col {
  width: 100%;
  text-align: left;
  padding-top: 10px;
}

#canvas {
  width: 500px;
  height: 500px;
}
.select_nums {
  width: 30px;
  background: orange;
  /* border: 0.5px inset chocolate; */
  /* border-radius: 50%; */
}
</style>
