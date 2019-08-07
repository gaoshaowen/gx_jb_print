<template>
  <div class="hello">
    <router-view></router-view>
    <mt-tabbar  v-model="tabname" fixed>
      <mt-tab-item id="tab1">
        <img slot="icon" src="../assets/222-square_green.png">
        tab1
      </mt-tab-item>
      <mt-tab-item id="tab2">
        <img slot="icon" src="../assets/223-square_red.png">
        tab2
      </mt-tab-item>
      <mt-tab-item id="tab3">
        <img slot="icon" src="../assets/222-square_green.png">
        tab3
      </mt-tab-item>
    </mt-tabbar>

  </div>
</template>

<script>
import Vue from 'vue'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
// import Vuex from 'vuex';

//Vue.use(Vuex);
Vue.use(Mint);

// var store = Vuex.Store({
//   state:{
//     count:0
//   },
//   mutations:{
//     add:function(state){
//       state.count++;
//     },
//     remove:function(state){
//       state.count--;
//     }
//   }
// });


export default {
  name: 'Home',
  data: function() {
    return {
      msg: 'Home',
      //选中的tabbar值message为外面页面传入的值selected
      tabname:this.selected,
      //这里使用的icon图标为图片，所以需要加图片改变的传入，若使用阿里图标，则不用加
      atabs:this.tabs,

    }
  },
  props:{
      selected:{type: String, default:'tab1'  },
      tabs:Array,
  },
  watch: {
    tabname: function (val, oldVal) {
      // 这里就可以通过 val 的值变更来确定去向
      switch(val){
        case 'tab1':
          this.$router.push('/home/home1');
          break;
        case 'tab2':
          this.$router.push('/home/home2');
          break;
        case 'tab3':
        this.$router.push('/home/home3');
        break;

      }
    }

  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
