<template>
	<div id="wrapper">
	<CSideBar v-bind:cMenu="menu" v-on:gantiPage="gantiPage" />

	<!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">
            <!-- Main Content -->
            <div id="content">

            <CTopBar v-bind:namaHalaman="menuName" />

            <!-- Begin Page Content -->
            <div class="container-fluid" style="height: 615px; overflow-y: scroll;">
            <CKasirMain v-if="menu == 'kasir'" />
            <CKelolaProduk v-if="menu == 'kelola-produk'" />
            <CKelolaPengeluaran v-if="menu == 'kelola-pengeluaran'" />
            <CKelolaHutang v-if="menu == 'kelola-hutang'" />
            <CMasterTransaksi v-if="menu == 'master-transaksi'" />
            <CKelolaUser v-if="menu == 'kelola-user'" />
            <CKelolaSatuan v-if="menu == 'kelola-satuan'" />
            </div>
            <!-- /.container-fluid -->

            </div>
            
            <CFooter />
        </div>
        <!-- End of Content Wrapper -->
	</div>    
</template>

<script>
import CSideBar from './CSideBar.vue'
import CFooter from './CFooter.vue'
import CTopBar from './CTopBar.vue'
import CKasirMain from './CKasirMain.vue'
import CKelolaProduk from './CKelolaProduk.vue'
import CKelolaPengeluaran from './CKelolaPengeluaran.vue'
import CKelolaHutang from './CKelolaHutang.vue'
import CMasterTransaksi from './CMasterTransaksi.vue'
import CKelolaUser from './CKelolaUser.vue'
import CKelolaSatuan from './CKelolaSatuan.vue'

export default {
	name: 'KasirPages',
	components: {
		CSideBar,
		CFooter,
		CTopBar,
		CKasirMain,
		CKelolaProduk,
		CKelolaPengeluaran,
		CKelolaHutang,
		CMasterTransaksi,
		CKelolaUser,
		CKelolaSatuan
	},
	data(){
		return{
			menu: '',
			menuName: ''
		}
	},
	created(){
		this.menu = localStorage.getItem('menu') || 'kasir'
		this.menuName = localStorage.getItem('menuName') || 'Welcome!'	
	},
	methods : {
		gantiPage : function(menu, pageName){
			this.menu = menu
			this.menuName = pageName
			localStorage.setItem('menu', menu)
			localStorage.setItem('menuName', pageName)
		}
	}
}
</script>