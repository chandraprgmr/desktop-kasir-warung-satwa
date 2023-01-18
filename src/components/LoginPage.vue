<template>
    <div class="container">

        <!-- Outer Row -->
        <div class="row justify-content-center">

            <div class="col-xl-5 col-lg-6 col-md-5">
                <div class="card o-hidden border-0 shadow-lg my-login">
                    <div class="card-body p-0">
                        <!-- Nested Row within Card Body -->
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="p-5">
                                    <div class="text-center">
                                        <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                    </div>
                                    <div style="text-align: center;">
                                        <img src="../assets/logo.png" width="150">
                                    </div>
                                    <form class="user">
                                        <div class="form-group">
                                            <input type="text" class="form-control form-control-user"
                                                id="exampleInputEmail" aria-describedby="Username"
                                                placeholder="Username" v-model="username">
                                        </div>
                                        <div class="form-group">
                                            <input type="password" class="form-control form-control-user"
                                                id="exampleInputPassword" placeholder="Password" v-model="password">
                                        </div>
                                        <button @click.prevent="login()" class="btn btn-primary btn-user btn-block">
                                            Login
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    </div>
</template>
<script>
export default {
	name: 'LoginPages',
    inject: ['smalltalk'],
    data(){
        return{
            username: '',
            password: ''
        }
    },
    mounted(){
        document.getElementById("exampleInputEmail").focus();
    },
	methods: {
		login: function(){
            let isReplied = false
            let pwd = this.password
            window.api.receive("fromMain", (data) => {
                if(!isReplied){
                    if(data){
                        var bcrypt = require('bcryptjs');
                        if (bcrypt.compareSync(pwd, data[0].password)) {
                            const wm = ['Selamat bekerja kembali!', 'Have a nice day!', 'Selamat datang masa depan bangsa!', 'Sudah makan belum?', 'Yuk semangat yukk!', 'Annyeonghaseyo!']
                            let sayWhat = wm[Math.floor(Math.random() * wm.length)]
                            this.smalltalk
                                .alert('Welcome!', sayWhat)
                                .then(() => {
                                    this.$router.push({name:'Kasir'})
                                    localStorage.setItem('appUserId', data[0].id)
                                    localStorage.setItem('appUserNama', data[0].nama)
                                })
                        }else{
                            this.smalltalk.alert('Failed!', 'Username atau Password salah!')
                        }
                    }else{
                        this.smalltalk.alert('Failed!', 'User tidak ditemukan!')
                    }
                }
                isReplied = true
            });
            window.api.send("toMain", 
                {func: 'login', 
                username: this.username, 
                password: this.password});
		}
	}
}
</script>