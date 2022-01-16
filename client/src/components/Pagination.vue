<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li :class="['page-item', pageNum === 0 ? 'disabled' : '']">
        <a class="page-link" @click="prevPage" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li :class="['page-item', pageNum == i-1 ? 'active' : '']" :key="i" v-for="(i) in pageCount">
        <a class="page-link" @click="pageNum=i-1">{{i}}</a>
      </li>
      <!--<li class="page-item"><a class="page-link" href="#">2</a></li>
      <li class="page-item"><a class="page-link" href="#">3</a></li> -->
      <li :class="['page-item', pageNum >= pageCount - 1 ? 'disabled' : '']">
        <a class="page-link" @click="nextPage" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  name: 'PageComponent',
  data () {
    return {
      pageNum: 0
    }
  },
  props: {
    pageSize: {
      type: Number,
      required: false,
      default: 10
    },
    totalCount: {
      type: String,
      required: true
    }
  },
  methods: {
    nextPage () {
      this.pageNum += 1
    },
    prevPage () {
      this.pageNum -= 1
    }
  },
  computed: {
    pageCount () {
      console.log('this.totalCount==' + this.totalCount)
      const listLeng = this.totalCount
      const listSize = this.pageSize
      let page = Math.floor(listLeng / listSize)
      if (listLeng % listSize > 0) page += 1
      /*
      아니면 page = Math.floor((listLeng - 1) / listSize) + 1;
      이런식으로 if 문 없이 고칠 수도 있다!
      */
      console.log('this.pageNum===' + this.pageNum)
      const start = this.pageNum * this.pageSize
      const end = start + this.pageSize
      const pgInfo = []
      pgInfo.push(start)
      pgInfo.push(end)
      this.$emit('paging-list', pgInfo) // start, end 값 부모 페이지에 전달
      return page
    }
  }
}
</script>
