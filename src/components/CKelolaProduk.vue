<template>
	<div class="row">
		<div class="col-md-6">
		<button class="btn btn-success float-left" data-toggle="modal" data-target="#exampleModal" @click="setModeModal('Tambah')">Tambah Produk</button>
		</div>
		<div class="col-md-6">
		<input id="searchBox" class="form-control ps-0" type="text" placeholder="Cari nama produk . . ." aria-label="Search" v-model="searchValue"> 
		</div>
	</div>
	<br>
	<div class="row">
		<div class="col-md-12">
			<div class="card">
				<div class="card-body">
					<!-- <table class="table table-striped" id="myTable">
                        <thead>
                            <tr>
                              <th>Kode</th>
                              <th>Nama Barang</th>
                              <th>Satuan</th>
                              <th>Harga Modal (Rp.)</th>
                              <th>Harga Jual (Rp.)</th>
                              <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <CKelolaProdukRow v-bind:listProduk="listProduk" v-on:konfirmasiHapus="konfirmasiHapus" v-on:editProduk="editProduk" />
                        </tbody>
                    </table> -->
                    <EasyDataTable
                        header-text-direction="center"
                        :headers="headers"
                        :items="listProduk"
                        :search-field="searchField"
                        :search-value="searchValue"
                        :rows-per-page="10">
                        <template #item-harga_modal="{harga_modal}">
                            <div class="total-wrapper float-right">
                                {{harga_modal}}
                            </div>
                        </template>

                        <template #item-harga_jual="{harga_jual}">
                            <div class="total-wrapper float-right">
                                {{harga_jual}}
                            </div>
                        </template>

                        <template #item-action="{id}">
                            <div class="action-wrapper text-center">
                                <div class="btn-group">
                                    <button class="btn btn-info" @click="editProduk(id)" data-toggle="modal" data-target="#exampleModal">Edit</button>
                                    <button class="btn btn-danger" @click="konfirmasiHapus(id)" data-toggle="modal" data-target="#hapusModal">Hapus</button>
                                </div>
                            </div>
                        </template>
                    </EasyDataTable>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Tambah Edit -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{mode}} Produk</h5>
            <button id="closeModal" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group">
                <div class="col-md-12 mb-3">
                    <label>Nama Barang</label>
                    <input class="form-control ps-0" type="text" v-model="namaBarang">    
                </div>
                <div class="col-md-12 mb-3">
                    <label>Kode (Opt)</label>
                    <input class="form-control ps-0" type="text" v-model="kode">    
                </div>
                <div class="col-md-12 mb-3">
                    <label>Satuan</label>
                    <select class="form-control ps-0" v-model="satuan">
                        <option v-for="(s, i) in listSatuan" :value="s.id" :key="i">{{ s.satuan }}</option>
                    </select>
                </div>
                <div class="col-md-12 mb-3">
                    <label>Harga Modal (Rp. )</label>
                    <input class="form-control ps-0" type="text" v-model="hargaModal">    
                </div>
                <div class="col-md-12 mb-3">
                    <label>Harga Jual (Rp. )</label>
                    <input class="form-control ps-0" type="text" v-model="hargaJual">    
                </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="action">SAVE</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Tambah Edit -->
    <div class="modal fade" id="hapusModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Hapus Produk</h5>
            <button id="closeHapus" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Anda Yakin ingin menghapus Produk ini?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="hapusProduk">OK</button>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
// import CKelolaProdukRow from './CKelolaProdukRow.vue'

export default{
	name: 'CKelolaProduk',
    inject: ['smalltalk'],
	// components : {
        // 'CKelolaProdukRow' : CKelolaProdukRow,
        // DataTable
    // },
    setup() {
        const headers = [
          { text: "Kode", value: "kode", sortable: true  },
          { text: "Nama Barang", value: "nama", sortable: true },
          { text: "Satuan", value: "satuan_show"},
          { text: "Harga Modal (Rp.)", value: "harga_modal", sortable: true },
          { text: "Harga Jual (Rp.)", value: "harga_jual", sortable: true },
          { text: "Action", value: "action"}
        ];

        return {
          headers
        };
    },
    data(){return{
        listProduk:[],
        searchField: ['kode', 'nama'],
        searchValue: '',
    listSatuan:[],
	mode: 'Edit',
	namaBarang: '',
	kode: '',
	satuan: '',
	hargaModal: '',
	hargaJual: '',
    id: '',
    }
    },
    mounted(){
        this.initProduk()
    },
    methods : {
        editProduk: function(produkId){
            this.setModeModal('Edit', produkId)
        },
        konfirmasiHapus: function(produkId){
            this.konfirmasiHapusId = produkId
        },
        hapusProduk: function(){
            let khi = this.konfirmasiHapusId
            this.listProduk = this.listProduk.filter(function(item) {
                return item.id !== khi
            })
            document.getElementById('closeHapus').click();
        },
        setModeModal: function(mode, produkId){
            this.initSatuan()
            this.mode = mode;
            if(this.mode == 'Tambah'){
				this.kode = ''
				this.satuan = ''
				this.hargaModal = ''
				this.hargaJual = ''
				this.namaBarang = ''
            }else{
                let isi = null;
                this.listProduk.forEach(function(item){
                    if(item.id == produkId){
                        isi = item
                    }
                })
                this.id = isi.id
                this.kode = isi.kode
                this.satuan = isi.satuan
                this.hargaModal = isi.harga_modal
                this.hargaJual = isi.harga_jual
                this.namaBarang = isi.nama
            }
        },
        action: function(){
            let isReplied = false
            window.api.receive("fromMain", (result) => {
                if(!isReplied){
                    if(result == 'OK'){
                        this.smalltalk.alert('Success!', 'Sukses memperbaharui data')
                        this.initProduk()
                        document.getElementById('closeModal').click();
                    }else if(result == 'NO'){
                        this.smalltalk.alert('Failed!', 'Belum dapat memperbaharui data')
                    }else{
                        this.smalltalk.alert('DB FAIL', result)
                    }
                }
                isReplied = true
            });

            window.api.send("toMain", {
                func: 'saveBarang', 
                mode: this.mode,
                id : this.id,
                kode : this.kode,
                satuan_id : this.satuan,
                harga_beli : this.hargaModal,
                harga_jual : this.hargaJual,
                nama : this.namaBarang,
            });
        },
        initSatuan: function(){
            let isRepliedSatuan = false
            window.api.receive("fromMain", (result) => {
                if(!isRepliedSatuan){
                    if(result != []){
                        let arrayTemp = []
                        result.forEach(function(item){
                            arrayTemp.push({
                                id: item.id,
                                satuan: item.satuan,
                            })
                        })

                        this.listSatuan = arrayTemp
                    }else{
                        this.smalltalk.alert('Failed!', 'Tidak dapat mengambil data')
                    }
                }
                isRepliedSatuan = true
            });
            window.api.send("toMain", {func: 'getSatuan'});
        },
        initProduk: function(){
            let isReplied = false
            window.api.receive("fromMain", (result) => {
                if(!isReplied){
                    if(result.constructor === Array){
                        let arrayTemp = []
                        result.forEach(function(item){
                            arrayTemp.push({
                                id: item.id,
                                kode: item.kode,
                                nama: item.nama,
                                satuan: item.satuan_id,
                                satuan_show: item.satuan,
                                harga_modal: item.harga_beli,
                                harga_jual: item.harga_jual
                            })
                        })

                        this.listProduk = arrayTemp
                    }else{
                        console.log(result)
                        this.smalltalk.alert('DB FAIL', result)
                    }
                }
                isReplied = true
            });
            window.api.send("toMain", 
                {func: 'getBarang', 
                search: 'search'});
        }
    },
}
</script>