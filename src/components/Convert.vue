<template>
  <div class="container">
    <form>
      <div class="form-group">
        <div class="row">
          <div class="col-md-6">
            <h3 class="text-muted">{{rawText.title}}</h3>
            <textarea
              class="form-control"
              v-bind:placeholder="rawText.placeholder"
              v-model="rawText.text"
            ></textarea>
            <button
              type="button"
              class="btn btn-success btn-block"
              v-bind:disabled="!btnClear"
              @click="clear"
            >清 空</button>
          </div>

          <div class="col-md-6">
            <h3 class="text-muted">{{convertText.title}}</h3>
            <!-- <textarea class="form-control" v-model="convertText.text"></textarea> -->
            <editor
              style="font-size: 15px"
              v-model="convertText.text"
              @init="editorInit"
              lang="python"
              theme="monokai"
              height="450px"
              :options="{enableSnippets:true,enableBasicAutocompletion: true,enableLiveAutocompletion: true}"
            ></editor>

            <div class="row">
              <div class="col-md-6">
                <button
                  type="button"
                  class="btn btn-success btn-block"
                  v-bind:disabled="!btnCopy"
                  v-clipboard:copy="convertText.text"
                  v-clipboard:success="copySuccess"
                >复 制</button>
              </div>
              <div class="col-md-6">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  v-bind:disabled="!btnCopy"
                  @click="excuteCode"
                >调 试</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <div class="debug-window">
      <img class="center-block" v-if="loading" src="static/loading.gif">
      <textarea class="form-control" v-if="debugText.show" v-model="debugText.text"></textarea>
    </div>
      <label class="text-muted" style="font-size: 10px">@by mocobk-2018</label>
    <!-- <label class="text-muted" style="font-size: 10px">@by mocobk-2018</label> -->
  </div>
</template>

<script>
import api from "../../config/api";

export default {
  name: "convert",
  components: {
    editor: require("vue2-ace-editor")
  },
  data() {
    return {
      loading: false,
      rawText: {
        title: "Raw Text",
        placeholder: "输入 Fiddler raw 格式文本 或 Curl 命令",
        text: ""
      },
      convertText: {
        title: "Python Requests",
        text: ""
      },
      debugText: {
        show: false,
        text: ""
      },
      btnClear: false,
      btnCopy: false
    };
  },
  watch: {
    "rawText.text": function(newVal, oldVal) {
      if (this.rawText.text.length > 20) {
        this.getCode();
      }
      if (this.rawText.text.length > 0) {
        this.btnClear = true;
      } else {
        this.btnClear = false;
        this.convertText.text = "";
      }
    },
    "convertText.text": function(newVal, oldVal) {
      if (this.convertText.text.length > 0) {
        this.btnCopy = true;
      } else {
        this.btnCopy = false;
      }
    }
  },
  methods: {
    editorInit: function() {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/python"); //language
      require("brace/theme/monokai");
      require("brace/snippets/python"); //snippet
    },
    clear: function() {
      this.rawText.text = "";
      this.convertText.text = "";
      this.debugText.show = false;
      this.loading = false;
    },
    copySuccess: function(e) {
      this.$toast("复制成功！", 2000);
    },
    getCode: function() {
      this.$http
        .post(
          api.getCode,
          { text: this.rawText.text },
          { emulateJSON: true } //将参数为form data传递，默认json
        )
        .then(
          data => {
            this.convertText.text = data.body;
          },
          error => {
            this.$toast("网络请求出错！请检查", 2000);
          }
        );
    },
    excuteCode: function() {
      console.log(api.excuteCode);
      this.debugText.text = "";
      this.debugText.show = true;
      this.loading = true;
      this.$http
        .post(
          api.excuteCode,
          { text: this.convertText.text },
          { emulateJSON: true } //将参数为form data传递，默认json
        )
        .then(
          data => {
            // console.log(data);
            this.loading = false;
            this.debugText.text = data.bodyText;
            this.debugText.show = true;
          },
          error => {
            this.$toast("网络请求出错！请检查", 2000);
            this.loading = false;
          }
        );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  max-width: 85%;
  margin-top: 10px;
  position: relative;
}
.debug-window{
  position: relative;
  width: 100%;
}
.center-block {
  display: block;
  margin-left: -4%;
  position: absolute;
  top: 40%;
  left: 50%;
}
textarea {
  min-height: 100px;
  width: 100%;
  white-space: nowrap; /*强制不换行显示*/
}
form textarea {
  min-height: 450px;
}
.btn {
  margin-top: 15px;
}
</style>
