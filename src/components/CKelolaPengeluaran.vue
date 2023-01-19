<template>
	<div class="row">
		<div class="col-md-6">
		<button class="btn btn-success float-left" data-toggle="modal" data-target="#exampleModal" @click="setModeModal('Tambah')">Tambah Pengeluaran</button>
		</div>
		<div class="col-md-6">
		<input id="searchBox" class="form-control ps-0" type="text" placeholder="Cari pengeluaran . . ." aria-label="Search" v-model="searchValue"> 
		</div>
	</div>
	<br>
	<div class="row">
		<div class="col-md-12">
			<div class="card">
				<div class="card-body">
                    <EasyDataTable
                        header-text-direction="center"
                        :headers="headers"
                        :items="listProduk"
                        :search-field="searchField"
                        :search-value="searchValue"
                        :rows-per-page="10">
                        <template #item-total="{total}">
                            <div class="total-wrapper float-right">
                                {{total}}
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
                    <label>Tgl Transaksi</label>
                    <input class="form-control ps-0" type="date" v-model="tgl">    
                </div>
                <div class="col-md-12 mb-3">
                    <label>Keterangan Pengeluaran</label>
                    <input class="form-control ps-0" type="text" v-model="keterangan">    
                </div>
                <div class="col-md-12 mb-3">
                    <label>Pengeluaran (Rp. )</label>
                    <input class="form-control ps-0" type="text" v-model="total">    
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
            <h5 class="modal-title" id="exampleModalLabel">Hapus Pengeluaran</h5>
            <button id="closeHapus" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Anda Yakin ingin menghapus data Pengeluaran ini?</p>
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
export default {
	name: 'CKelolaPengeluaran',
    inject: ['smalltalk'],
    setup() {
        const headers = [
          { text: "Tgl Transaksi", value: "tgl", sortable: true  },
          { text: "Pengeluaran", value: "keterangan", sortable: true },
          { text: "Total (Rp.)", value: "total", sortable: true },
          { text: "Action", value: "action"}
        ];

        return {
          headers
        };
    },
    data(){return{
        searchField: ['tgl', 'keterangan', 'total'],
        searchValue: '',
        listProduk:[],
    listSatuan:[],
	mode: 'Edit',
	tgl: '',
	keterangan: '',
	total: '',
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
            this.mode = mode;
            if(this.mode == 'Tambah'){
                let tgl = new Date()
                // date format yyyy-mm-dd
                let df = tgl.getFullYear()+'-'+(((parseInt(tgl.getMonth())+1) < 10 ? '0' : '') + (parseInt(tgl.getMonth())+1))+'-'+((tgl.getDate() < 10 ? '0' : '') + tgl.getDate())
				this.tgl = df
				this.keterangan = ''
				this.total = ''
            }else{
                let isi = null;
                this.listProduk.forEach(function(item){
                    if(item.id == produkId){
                        isi = item
                    }
                })
                let tgl = new Date(isi.created_at)
                // date format yyyy-mm-dd
                let df = tgl.getFullYear()+'-'+(((parseInt(tgl.getMonth())+1) < 10 ? '0' : '') + (parseInt(tgl.getMonth())+1))+'-'+((tgl.getDate() < 10 ? '0' : '') + tgl.getDate())
                
                this.id = isi.id
                this.tgl = df
                this.keterangan = isi.keterangan
                this.total = isi.total
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
                func: 'savePengeluaran', 
                mode: this.mode,
                id: this.id,
                keterangan : this.keterangan,
                total : this.total,
                tgl : this.tgl,
                user_id : localStorage.getItem("appUserId"),
            });
        },
        initProduk: function(){
            let isReplied = false
            window.api.receive("fromMain", (result) => {
                if(!isReplied){
                    if(result.constructor === Array){
                        let arrayTemp = []
                        // let arrayVault = []
                        // const monthNames = this.monthNames
                        result.forEach(function(item){
                            let tgl = new Date(item.tgl_transaksi)
                            let df = tgl.getFullYear()+'-'+(((parseInt(tgl.getMonth())+1) < 10 ? '0' : '') + (parseInt(tgl.getMonth())+1))+'-'+((tgl.getDate() < 10 ? '0' : '') + tgl.getDate())

                            arrayTemp.push({
                                id: item.id,
                                keterangan: item.keterangan,
                                total: item.total,
                                tgl: df,
                                created_at: item.tgl_transaksi,
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
                {func: 'getPengeluaran', 
                search: 'search'});
        }
    },
}
</script>