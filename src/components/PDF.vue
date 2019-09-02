<template>
  <div id="container" style="border: 1px solid green;">
    <!-- <div class="pdf-page"> -->
    <div class="foot" v-if="pdfDoc">
      <button class="left" v-if="pageNum>1" @click="onPrevPage">上一页</button>
      <button class="right" v-if="pageNum<pdfDoc.numPages" @click="onNextPage">下一页</button>
      <div id="page-count-container">
        Page
        <div id="pdf-current-page">{{ pageNum }}</div>of
        <div id="pdf-total-pages">{{ this.totalpages }}</div>
      </div>
      <!-- <localupload v-bind:TOTALPAGES='5'></localupload> -->
    </div>
    <canvas id="the-canvas"></canvas>
  </div>
  
</template> 

<script>
import PDFJS from "pdfjs-dist";
import { type } from "os";

export default {
  data() {
    return {
      pdfDoc: null,
      pageNum: 1,
      pageRendering: false,
      pageNumPending: null,
      scale: 0.9,
      currentPage: 1,
      totalpages:10
    
    };
  },

  props: ["src"],

  methods: {
    showPDF(url) {
      if (!url) return;
      // alert("url");
      let _this = this;
      PDFJS.getDocument(url).then(pdf => {
        _this.pdfDoc = pdf;
        let total_pages = pdf.numPages;
        // $("#pdf-current-page").text("1");
        // $("#pdf-total-pages").text(total_pages);
        // var div = document.getElementById("pdf-total-pages");
        // div.innerText=total_pages;
        // var div = $("#pdf-total-pages", div);
        // console.log("#pdf-total-pages", div);
        // console.log("total_pages", total_pages);

        this.totalpages = total_pages;
        // export const totalpages = this.totalpages;
        _this.renderPage(1);
      });
    },

    renderPage(num) {
      this.pageRendering = true;
      let _this = this;
      // 显示当前页数
      // $("#pdf-current-page").text(num);
      this.pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport(_this.scale);
        let canvas = document.getElementById("the-canvas");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: canvas.getContext("2d"),
          viewport: viewport
        };
        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function() {
          _this.pageRendering = false;
          if (_this.pageNumPending !== null) {
            // New page rendering is pending
            this.renderPage(_this.pageNumPending);
            _this.pageNumPending = null;
          }
        });
      });
    },
    queueRenderPage(num) {
      if (this.pageRendering) {
        this.pageNumPending = num;
      } else {
        this.renderPage(num);
      }
    },
    onPrevPage() {
      if (this.pageNum <= 1) {
        return;
      }

      this.pageNum--;

      this.queueRenderPage(this.pageNum);
    },
    onNextPage() {
      if (this.pageNum >= this.pdfDoc.numPages) {
        return;
      }
      this.pageNum++;
      this.queueRenderPage(this.pageNum);
    }
  },

  mounted() {
    this.showPDF(this.src);
  },
  // 监听src的变化
  watch: {
    src: function(newval, oldval) {
      console.log("newval:", newval, "oldval:", oldval);
      this.showPDF(newval);
    }
  }
};
</script>
 
<style scoped>
#container {
  width: 750px;
  display: block;
  margin: 10px auto;
}

/* .pdf-page {
} */

.foot {
  display: block;
  /* position: fixed; */
  /* transform: translate(-50%, 0); */
  /* left: 50%; */
  /* border: 1px solid orange; */
}
#page-count-container {
  border: 1px dashed orangered;
  /* display: inline;
  float:left; */
}

#pdf-current-page {
  display: inline;
}

#pdf-total-pages {
  display: inline;
}
</style>
