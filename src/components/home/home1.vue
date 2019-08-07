<template>
  <div class="hello">
    <h3>{{ msg }}</h3>


    <mt-index-list>
      <!-- <mt-index-section index="A">
        <mt-cell title="Aaron"></mt-cell>
        <mt-cell title="Alden"></mt-cell>
        <mt-cell title="Austin"></mt-cell>
      </mt-index-section>
      <mt-index-section index="B">
        <mt-cell title="Baldwin"></mt-cell>
        <mt-cell title="Braden"></mt-cell>
      </mt-index-section>

      <mt-index-section index="Z">
        <mt-cell title="Zack"></mt-cell>
        <mt-cell title="Zane"></mt-cell>
      </mt-index-section> -->

      <mt-cell  v-for="(item,indexList) in datalist" :key="indexList"  @click.native="getdata(item)"   >
          <div class="gtmitem" >
             <div  class="title">  {{item.name}} </div>

             <div class="location">
               {{item.location}}
             </div>

             <div class="clear"></div>
          </div>
      </mt-cell>


    </mt-index-list>

  </div>
</template>

<script>

export default {
  name: 'Home1',
  data: function() {
    return {
      msg: 'Home1',
      datalist:[{name:'1',url:'#',location:19},{name:'2',url:'#',location:19},{name:'3',url:'#',location:19}]
    }
  },

  methods:{
    getdata:function(item){
      console.log(item.name);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.gtmitem {
  position:relative;
}

.gtmitem .title {
  width: 50px;
  float:left;
}
.gtmitem .location {
  width:50px;
  float:right;
}
hr{
  margin-bottom: 5px;
  margin-top: 5px;
}

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
