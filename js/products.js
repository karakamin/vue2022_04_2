import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.28/vue.esm-browser.min.js";
import pagination from "./pagination.js";

let apiUrl = "https://vue3-course-api.hexschool.io/v2";
let apiPath = "karakamin-hex";
let productModal = {};
let delProductModal = {};

const app = createApp({
    // 區域註冊
    components: {
        pagination
    },
    data() {
        return {
            products: [],
            tmpProduct: {
                imagesUrl: [],
            },
            // 頁碼
            pagination: {},
            //  isNew 用來判斷是資料新增還是修改
            isNew: false,
        }
    },
    methods: {
        checkUser() {
            let url = `${apiUrl}/api/user/check`;
            axios.post(url)
                // axios.post(`${this.url}/api/user/check`)

                .then((res) => {
                    const { success, message } = res.data;
                    if (success) {
                        this.getProdList();
                    } else {
                        alert(message);
                        window.location = "index.html";
                    }

                }).catch((err) => {
                    alert("權限異常");
                    console.log(err);
                    window.location = "index.html";
                })
        },
        // page = 1 為參數預設值
        getProdList(page = 1) {
            let url = `${apiUrl}/api/${apiPath}/admin/products/?page=${page}`;
            axios.get(url)
                .then((res) => {
                    // console.log(res);
                    const { success, message, products, pagination } = res.data;
                    // 在 success 為 true 時，取得的資料放入 products
                    if (success) {
                        // 產品資訊
                        this.products = products;
                        // 分頁資訊
                        this.pagination = pagination;
                    } else {
                        alert(message);
                    }

                }).catch((err) => {
                    alert("產品清單取得異常");
                })
        },
        openModal(status, product) {
            // console.log(status, product);
            if (status === 'add') {
                this.tmpProduct = {
                    imagesUrl: [],
                }
                productModal.show();
                this.isNew = true;
            } else if (status === 'edit') {
                // 淺拷貝寫法
                // this.tmpProduct = { ...product };

                // 深拷貝寫法                
                this.tmpProduct = JSON.parse(JSON.stringify(product));
                // 可選串連運算子搭配空值合併運算子
                const tmpImagesUrl = this.tmpProduct?.imagesUrl ?? [];
                this.tmpProduct.imagesUrl = tmpImagesUrl;

                // if 判斷
                // if(!this.tmpProduct.imagesUrl){
                //     this.tmpProduct.imagesUrl = [];
                // }

                productModal.show();
                this.isNew = false;
            } else if (status === 'delete') {
                // 待確認為什麼會造成錯誤
                // this.tmpProduct = { ...product };
                this.tmpProduct = JSON.parse(JSON.stringify(product));
                // 可選串連運算子搭配空值合併運算子
                const tmpImagesUrl = this.tmpProduct?.imagesUrl ?? [];
                this.tmpProduct.imagesUrl = tmpImagesUrl;

                delProductModal.show();
            }
        },
    },
    created() {
        //存放token 只需要設定一次
        const tmpToken = document.cookie.replace(
            /(?:(?:^|.*;\s*)loginToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        // console.log(tmpToken);
        //axios預設headers
        axios.defaults.headers.common["Authorization"] = tmpToken;

        this.checkUser()
    },
    mounted() {
        // 新增修改的 modal 視窗
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            // 不能使用鍵盤操作
            keyboard: false,
            backdrop: false
        });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            // 不能使用鍵盤操作
            keyboard: false,
            backdrop: false
        });
    },
});
// 全域註冊元件
app.component('productModal', {
    props: ['tmpProduct', 'isNew'],
    template: '#templateForProductModal',
    methods: {
        // 新增與修改產品
        updateProduct() {
            let url = `${apiUrl}/api/${apiPath}/admin/product`;
            let method = 'post';

            if (!this.isNew) {
                url = `${apiUrl}/api/${apiPath}/admin/product/${this.tmpProduct.id}`;
                method = 'put';
            }
            axios[method](url, { data: this.tmpProduct })
                .then((res) => {
                    const { success, message } = res.data;
                    if (success) {
                        alert(message);
                        //  新增完成後重新取得產品列表
                        this.$emit('get-products');
                        // 關閉 modal 視窗
                        productModal.hide();
                    } else {
                        alert(message);
                        productModal.hide();
                    }
                }).catch((err) => {
                    const { message } = err.data;
                    console.log(err);
                    alert(message);
                    productModal.hide();
                })
        },

    },
});
//  全域註冊元件-刪除 modal
app.component('delModal', {
    props: ['tmpProduct'],
    template: '#templateDelModal',
    methods: {
        deleteProduct() {
            let url = `${apiUrl}/api/${apiPath}/admin/product/${this.tmpProduct.id}`;

            axios.delete(url)
                .then((res) => {
                    const { success, message } = res.data;
                    if (success) {
                        alert(message);
                        // 刪除完成後重新取得產品列表
                        this.$emit('get-products');
                        // 關閉 modal 視窗
                        delProductModal.hide();
                    } else {
                        alert(message);
                        delProductModal.hide();
                    }
                }).catch((err) => {
                    const { message } = err.data;
                    console.log(err);
                    alert(`${message}執行刪除失敗`);
                    delProductModal.hide();
                })
        }
    },

});

app.mount("#app");
