export default {
    // 外部傳入分頁資訊，利用 pages 接收
    //  由內到外使用 emit
    props: ['pages'],
    template : `<nav aria-label="Page navigation example">
    <ul class="pagination justify-content-end pt-5">
      <li class="page-item" :class="{ disabled: !pages.has_pre }"
        @click="$emit('get-product',pages.current_page -1 )">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" 
        :class="{ active: page === pages.current_page }"
        v-for="page in pages.total_pages" :key="page + 'page'">
        <a class="page-link" href="#" 
            @click="$emit('get-product', page)">{{ page }}</a></li>
      <li class="page-item" :class="{ disabled: !pages.has_next }" 
        @click="$emit('get-product', pages.current_page + 1)">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`
}