<template>
	<div class="row">
		<div class="col-md-4">
            <div class="form-group form-inline">
                <label for="inputBulan">Bulan Transaksi</label>&nbsp;&nbsp;
                <input id="inputBulan" type="month" class="form-control" v-model="defaultBulan">
            </div>
		</div>
        <div class="col-md-2"></div>
		<div class="col-md-6">
		<input id="searchBox" class="form-control ps-0" type="text" placeholder="Cari nama Pelanggan . . ." aria-label="Search" v-model="searchValue"> 
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
                        <template #item-hutang="{hutang}">
                            <div class="hutang-wrapper float-right">
                                {{hutang}}
                            </div>
                        </template>

                        <template #item-action="{id, hutang}">
                            <div class="action-wrapper text-center">
                                <div class="btn-group">
                                    <button class="btn btn-warning" @click="editProduk(id, hutang)" data-toggle="modal" data-target="#exampleModal">Bayar</button>
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
            <h5 class="modal-title" id="exampleModalLabel">Pembayaran Hutang</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="closeModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group">
                <div class="col-md-12 mb-3">
                    <label>Dibayarkan</label>
                    <input class="form-control ps-0" type="text" v-model="hutang">    
                </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="action()">BAYAR</button>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default{
	name: 'CKelolaHutang',
    inject: ['smalltalk'],
    setup() {
        const headers = [
          { text: "Tgl Transaksi", value: "tgl", sortable: true  },
          { text: "Pelanggan", value: "nama", sortable: true },
          { text: "Total Hutang (Rp.)", value: "hutang", sortable: true },
          { text: "Action", value: "action"}
        ];

        return {
          headers
        };
    },
    data(){return{
        searchField: ['tgl', 'nama'],
        searchValue: '',
	listProduk:[],
	idTransaksi: '',
	hutang: '',
    defaultBulan: '',
    cTotal: 0,
    cUangDiserahkan: 0
    }
    },
    mounted(){
        const d = new Date();
        this.defaultBulan = d.getFullYear()+'-'+(((parseInt(d.getMonth())+1) < 10 ? '0' : '') + (parseInt(d.getMonth())+1))
        this.initTransaksi()
    },
    watch: {
        // eslint-disable-next-line
        defaultBulan(val) {
            let date = val.split("-")
            let month = date[1]
            let year = date[0]

            let isReplied = false
            window.api.receive("fromMain", (result) => {
                if(!isReplied){
                    if(result.constructor === Array){
                        let arrayTemp = []
                        const monthNames = this.monthNames;
                        result.forEach(function(item){
                            let tgl = new Date(item.created_at)
                            let df = ((tgl.getDate() < 10 ? '0' : '') + tgl.getDate())+' '+monthNames[tgl.getMonth()]+' '+tgl.getFullYear()

                            arrayTemp.push({
                                id: item.id,
                                tgl: df,
                                nama: item.pelanggan,
                                hutang: item.total - item.uang_diserahkan, 
                                total: item.total,
                                uang_diserahkan: item.uang_diserahkan,
                            })
                        })
                        this.listProduk = arrayTemp
                    }else{
                        this.smalltalk.alert('DB FAIL', result)
                    }
                }
                isReplied = true
            });

            window.api.send("toMain", 
                {func: 'getHutang', 
                month: month,
                year: year});
        }
    },
    methods : {
        editProduk: function(produkId, hutang){
            let isi = null;

            this.idTransaksi = produkId
            this.hutang = hutang

            this.listProduk.forEach(function(item){
                if(item.id == produkId){
                    isi = item
                }
            })

            this.cTotal = isi.total
            this.cUangDiserahkan = isi.uang_diserahkan
        },
        initTransaksi: function(){
            let date = this.defaultBulan.split("-")
            let month = date[1]
            let year = date[0]

            let isReplied = false
            window.api.receive("fromMain", (result) => {
                if(!isReplied){
                    if(result.constructor === Array){
                        let arrayTemp = []
                        const monthNames = this.monthNames;
                        result.forEach(function(item){
                            let tgl = new Date(item.created_at)
                            let df = ((tgl.getDate() < 10 ? '0' : '') + tgl.getDate())+' '+monthNames[tgl.getMonth()]+' '+tgl.getFullYear()

                            arrayTemp.push({
                                id: item.id,
                                tgl: df,
                                nama: item.pelanggan,
                                hutang: item.total - item.uang_diserahkan,  
                                total: item.total,
                                uang_diserahkan: item.uang_diserahkan,
                            })
                        })
                        this.listProduk = arrayTemp
                    }else{
                        this.smalltalk.alert('DB FAIL', result)
                    }
                }
                isReplied = true
            });

            window.api.send("toMain", 
                {func: 'getHutang', 
                month: month,
                year: year});
        },
        action: function(){
            let isReplied = false
            let isHutang = 1

            if ((this.hutang+this.cUangDiserahkan) == this.cTotal) {
                isHutang = 0
            }
            
            window.api.receive("fromMain", (result) => {
                if(!isReplied){
                    if(result == 'OK'){
                        this.smalltalk.alert('Success!', 'Sukses memperbaharui data')
                        this.initTransaksi()
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
                func: 'saveHutang', 
                id: this.idTransaksi,
                ud : this.hutang,
                is_hutang: isHutang
            });
        },
    },
}
</script>