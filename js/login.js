import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.28/vue.esm-browser.min.js";

let apiUrl = "https://vue3-course-api.hexschool.io/v2";
let apiPath = "karakamin-hex";

const app = createApp({
    data() {
        return{
            user:{
                username : "",
                password : "",
            },
        }
    },
    methods: {
        login() {
            let url = `${apiUrl}/admin/signin`;
            axios.post(url, this.user)
            .then((res) => {
                // console.log(res);
                const { token, expired,message } = res.data;

                //寫入 cookie
                document.cookie = `loginToken=${token};expires=${new Date(expired)}; path=/`;
                alert(message);
                window.location = "products.html";
            }).catch((err) => {
                const { message } = err.data;
                alert(message);

            })            
        },
    },

});
app.mount("#app");