<template>
  <div id="app">
    
    <router-view></router-view>

  </div>
</template>

<script>
export default {
  name: 'App',
  data: function () {
    return {

      device_id:'3b6e9e3694a243214afcbebc18121310',

      
    }

  },

  methods:{




  },

  mounted() {

    // if ( this.$route.query.devid ){
    //     this.device_id =this.$route.query.devid
    // }

    // console.log('app device_id: ', this.device_id )
    // localStorage.setItem("device_id", this.device_id);


  },


}
</script>

<style>
*{
  margin:0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

a{
  text-decoration: none;
}
.clear{
   clear: both;
}
</style>
