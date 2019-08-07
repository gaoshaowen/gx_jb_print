const tenpay = require('tenpay')
const axios = require('axios')
const conf = require('./config_svr')

const wechatConfig = {
    appid: 'xxxx',
    mchid: 'xxxx',
    partnerKey: 'xxxx',
    notify_url: conf.host+ `/notify`, //微信异步通知的地址
}
const wechatApi = new tenpay(wechatConfig)

async function unifiedOrder(ctx) {
  //传过来的total_fee单位为：元，传给微信要转化为分
  const {out_trade_no, total_fee, product_id} = ctx.request.body
  let sceneInfoObj = {
      h5_info: {
          type:"Wap",
          wap_url:conf.host,
          wap_name: "赞赏"
      }
  }
  function get_ip () { //获取用户的真实ip
  let ip = ctx.request.get("X-Real-IP") || ctx.request.get("X-Forwarded-For") || ctx.request.ip
      if (ip.split(',').length > 0) {
          ip = ip.split(',')[0]
      }
      return ip
  }
  let fee = total_fee || 5
  if (product_id) {  //pc端扫码---要求必须有produce_id字段
      let result = await wechatApi.unifiedOrder({
          out_trade_no: out_trade_no, //商户内部订单号
          body: 'xxxxxxxxxxxxx',
          total_fee: fee*100, //订单金额(单位：分)
          trade_type: 'NATIVE', //pc扫码模式二
          product_id: product_id,
          spbill_create_ip: get_ip() //ip地址
      })
      ctx.response.status = 201
      ctx.response.body = {next: result.code_url, order_id: result.out_trade_no}
  } else { //手机h5支付
  let result = await wechatApi.unifiedOrder({
      out_trade_no: out_trade_no, //商户内部订单号
      body: 'xxxxxxxxxxxx',
      total_fee: fee*100, //订单金额(单位：分)
      trade_type: 'MWEB',
      spbill_create_ip: get_ip(), //ip地址
      scene_info: JSON.stringify(sceneInfoObj) //场景信息
  })
  ctx.response.status = 302
  ctx.response.type = 'json'
  ctx.response.body = {next: result.mweb_url}
  }
}


async function notifyVerify(ctx) {
  let info = ctx.request.weixin //微信返回的信息

  let total_fee, order_status
  //根据订单号去后台取详细数据
  await axios({
    method:'get',
    url: 'order/',
    params: {
      order_id: info.out_trade_no
    }
  }).then((res) => {
    total_fee = res.data.fee //金额
    order_status = res.data.order_status //交易完成状态，1表示已完成，0表示未完成
  })
  // 在`node-tenpay`源码中已校验签名，所以这里只需要校验金额
  if (order_status !== 0){  
    ctx.reply('订单已支付')
  }else if (info.total_fee === total_fee) {
    //交易成功，记录入库
    try{
      await axios.post({
        url: conf.host+ '/printapi/order/finish/',
        data: {
          order_id: info.out_trade_no,  //订单号
          notify_trade_no: info.transaction_id, //微信交易流水号
          order_status: 1, //交易状态
        }
      })
      ctx.reply('') //回复微信商户接收通知成功并校验成功
    }catch (e) {
      ctx.reply(e)
      throw new Error(e)
    }
  } else {
    ctx.reply('金额不一致')
  }
}

module.exports = {unifiedOrder, wechatApi, notifyVerify}
