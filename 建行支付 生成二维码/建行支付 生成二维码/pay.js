//var MERCHANTID ='105584073990033';              //UAT--可用防钓鱼接口
//var POSID='100000415';                 			//分行代码
var MERCHANTID = '105000759989591';
var POSID = '041265093';
var BRANCHID='442000000'; 
var ORDERID=Math.round(Math.random()*100000)+1;	//'001';
var PAYMENT='0.01';
var CURCODE='01';
var TXCODE='530550';
var REMARK1='';
var REMARK2='';
//var RETURNTYPE='1';
var RETURNTYPE='2';
var TIMEOUT='';
//var PUB32TR2='bd0f9a0658b5640c37378787020111';
var PUB32TR2='c60968eeb3ec741e68a8269b020111';

//var bankURL='http://128.128.96.175:8001/app/ccbMain?CCB_IBSVersion=V5'; //sit
var bankURL = 'https://ibsbjstar.ccb.com.cn/CCBIS/ccbMain?CCB_IBSVersion=V6';

//以下内容不要轻易改动
var strMD5;
var URL;

function setValue(){
	var objMERCHANTID=document.getElementById("MERCHANTID");
	objMERCHANTID.value=MERCHANTID;
	var objPOSID=document.getElementById("POSID");
	objPOSID.value=POSID;	
	var objBRANCHID=document.getElementById("BRANCHID");
	objBRANCHID.value=BRANCHID;
	var objORDERID=document.getElementById("ORDERID");
	objORDERID.value=ORDERID;
	var objPAYMENT=document.getElementById("PAYMENT");
	objPAYMENT.value=PAYMENT;
	var objCURCODE=document.getElementById("CURCODE");
	objCURCODE.value=CURCODE;
	var objTXCODE=document.getElementById("TXCODE");
	objTXCODE.value=TXCODE;
	var objREMARK1=document.getElementById("REMARK1");
	objREMARK1.value=REMARK1;
	var objREMARK2=document.getElementById("REMARK2");
	objREMARK2.value=REMARK2;
	var objRETURNTYPE=document.getElementById("RETURNTYPE");
	objRETURNTYPE.value=RETURNTYPE;
	var objTIMEOUT=document.getElementById("TIMEOUT");
	objTIMEOUT.value=TIMEOUT;

	document.getElementById("PUB32TR2").value = PUB32TR2;
	
	var objsendB=document.getElementById("sendB");
	objsendB.disabled=true;	
}

function make(){
	var tmp;
	var tmp0;

	MERCHANTID=document.getElementById("MERCHANTID").value;
	POSID=document.getElementById("POSID").value;
	BRANCHID=document.getElementById("BRANCHID").value;
	ORDERID=document.getElementById("ORDERID").value;
	PAYMENT=document.getElementById("PAYMENT").value;
	CURCODE=document.getElementById("CURCODE").value;
	TXCODE=document.getElementById("TXCODE").value;
	REMARK1=document.getElementById("REMARK1").value;
	REMARK2=document.getElementById("REMARK2").value;
	RETURNTYPE=document.getElementById("RETURNTYPE").value;
	TIMEOUT=document.getElementById("TIMEOUT").value;
	
	bankURL=document.getElementById("bankURL").value;
	
	    
	tmp = 'MERCHANTID='+MERCHANTID+'&POSID='+POSID+'&BRANCHID='+BRANCHID+'&ORDERID='+ORDERID;
	tmp += '&PAYMENT='+PAYMENT+'&CURCODE='+CURCODE+'&TXCODE='+TXCODE+'&REMARK1='+REMARK1;
	tmp += '&REMARK2='+REMARK2+'&RETURNTYPE='+RETURNTYPE+'&TIMEOUT='+TIMEOUT;

	tmp0 = tmp;
	tmp += '&PUB='+document.getElementById("PUB32TR2").value;

	URL = bankURL+'&'+tmp0+'&MAC='+hex_md5(tmp);
    
	document.getElementById("encry").value=tmp;
    document.getElementById("result").value=URL;

	//document.getElementById("MACSTR").innerHTML = tmp;

	document.getElementById("MAC").value = hex_md5(tmp);
	
	//打开提交按钮
	document.getElementById("result").value=URL;
	document.getElementById("sendB").disabled=false;

	//封闭MD5生成按钮
    document.getElementById("makeMd5").disabled=true;
}

function go( sendUrl){
	var objMD5form=document.getElementById("MD5form2");
	objMD5form.method="post";
	objMD5form.action=sendUrl;
	objMD5form.submit();
}

function newRest(){
   window.MD5form.sendB.disabled =true ;
   window.MD5form.makeMd5.disabled = false;

   window.MD5form.MERCHANTID.value=MERCHANTID;
   window.MD5form.POSID.value=POSID;
   window.MD5form.BRANCHID.value=BRANCHID;
   window.MD5form.ORDERID.value=Math.round(Math.random()*100000)+1;
   window.MD5form.PAYMENT.value=PAYMENT;
   window.MD5form.CURCODE.value=CURCODE;
   window.MD5form.TXCODE.value=TXCODE;
   window.MD5form.REMARK1.value=REMARK1;
   window.MD5form.REMARK2.value=REMARK2;
   window.MD5form.bankURL.value=bankURL;
   //window.MD5form.reset();
}