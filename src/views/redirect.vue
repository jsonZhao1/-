<script>
import {endTimer} from "@/utils/yyh";

export default {
  created() {
    // endTimer()
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
