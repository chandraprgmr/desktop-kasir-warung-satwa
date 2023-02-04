<template>
	<div class="row">
		<div class="col-md-6">
            <div class="form-group form-inline">
                <label for="inputTanggal">Waktu Transaksi</label>&nbsp;&nbsp;
                <Datepicker v-model="date" range :enable-time-picker="false" />
            </div>
		</div>
        <div class="col-md-2">
            <button class="btn btn-warning float-right" @click="downloadExcel()">Download Laporan</button>
        </div>
		<div class="col-md-4">
		<input id="searchBox" class="form-control ps-0" type="text" placeholder="Cari transaksi . . ." aria-label="Search" v-model="searchValue"> 
		</div>
	</div>
	<br>
	<div class="row">
		<div class="col-md-12" style="height: 425px; overflow: auto;">
			<div class="card">
				<div class="card-body">
                    <EasyDataTable
                        header-text-direction="center"
                        :headers="headers"
                        :items="listProduk"
                        :search-field="searchField"
                        :search-value="searchValue"
                        :rows-per-page="10">
                        <template #item-pengeluaran="{pengeluaran}">
                            <div class="pengeluaran-wrapper float-right">
                                {{pengeluaran}}
                            </div>
                        </template>

                        <template #item-pemasukan="{pemasukan}">
                            <div class="pemasukan-wrapper float-right">
                                {{pemasukan}}
                            </div>
                        </template>

                        <template #item-detail-barang="{detail_barang}">
                            <div class="detail-barang-wrapper float-left">
                                <p class="p-table" v-for="db of detail_barang.split('***')" v-bind:key="db">
                                    {{db}}
                                </p>
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
    <br>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h3>Total Pengeluaran : Rp. {{pengeluaran}}</h3>
                        </div>
                        <div class="col-md-6">
                            <h3>Total Pendapatan : Rp. {{pemasukan}}</h3>
                        </div>
                    </div>
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
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
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
                    <input class="form-control ps-0" type="text" v-model="satuan">    
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
            <button type="button" class="btn btn-primary">BAYAR</button>
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
            <p>Anda Yakin ingin menghapus Transaksi ini?</p>
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
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref, onMounted } from 'vue';
import { saveAs } from 'file-saver'

export default{
	name: 'CMasterTransaksi',
    inject: ['smalltalk'],
	components : {
        Datepicker 
    },
    data(){return{
        searchField: ['nama'],
        searchValue: '',
        listProduk:[],
	mode: 'Edit',
	namaBarang: '',
	kode: '',
	satuan: '',
	hargaModal: '',
	hargaJual: '',
    konfirmasiHapusId: '',
    pemasukan: 0,
    pengeluaran: 0
    }
    },
    setup(){
        const date = ref();

        onMounted(() => {
            const today = new Date();
            date.value = [today, today];
        })

        const headers = [
          { text: "Tgl Transaksi", value: "tgl", sortable: true  },
          { text: "Partisipan", value: "nama", sortable: true },
          { text: "Pengeluaran (Rp.)", value: "pengeluaran", sortable: true },
          { text: "Pemasukan (Rp.)", value: "pemasukan", sortable: true },
          { text: "Keterangan", value: "detail-barang", sortable: false },
          { text: "Action", value: "action"}
        ];
        
        return {
            date,
            headers
        }
    },
    mounted(){
        this.initTransaksi()
    },
    watch: {
        // eslint-disable-next-line
        date(val) {
            let d1 = new Date(val[0])
            let d2 = new Date(val[1])
            let df1 = d1.getFullYear()+'-'+(d1.getMonth()+1)+'-'+d1.getDate()+' 00:00:00'
            let df2 = d2.getFullYear()+'-'+(d2.getMonth()+1)+'-'+d2.getDate()+' 23:59:59'

            let isReplied = false
            const mn = this.monthNames;
            window.api.receive("fromMain", (result) => {
                if(!isReplied){
                    if(result.constructor === Array){
                        let arrayTemp = []
                        let totalPemasukan = 0
                        let totalPengeluaran = 0
                        result.forEach(function(item){
                            let pemasukan = 0
                            let pengeluaran = 0
                            let tgl = new Date(item.created_at)
                            let df = ((tgl.getDate() < 10 ? '0' : '') + tgl.getDate())+' '+mn[tgl.getMonth()]+' '+tgl.getFullYear()

                            if(item.is_pemasukan == 1){
                                pemasukan = item.total - item.potongan
                            }else{
                                pengeluaran = item.total
                            }

                            arrayTemp.push({
                                id: item.id,
                                tgl: df,
                                nama: item.pelanggan,
                                pengeluaran: item.is_pemasukan == 0 ? pengeluaran : 0,
                                pemasukan: item.is_pemasukan == 1 ? pemasukan : 0,
                                detail_barang: item.detail_barang
                            })

                            totalPemasukan += pemasukan
                            totalPengeluaran += pengeluaran
                        })
                        console.log(arrayTemp)
                        this.listProduk = arrayTemp
                        this.pemasukan = totalPemasukan
                        this.pengeluaran = totalPengeluaran
                    }else{
                        this.smalltalk.alert('DB FAIL', result)
                    }
                }
                isReplied = true
            });

            window.api.send("toMain", 
                {func: 'getTransaksi', 
                d1: df1,
                d2: df2});
        }
    },
    methods : {
        async downloadExcel() {
            const ExcelJS = require('exceljs')
            const workbook = new ExcelJS.Workbook()
            workbook.creator = 'Kasir Warung Satwa'

            let d1 = new Date(this.date[0])
            let d2 = new Date(this.date[1])
            let df1 = d1.getDate()+' '+this.monthNames[d1.getMonth()]+' '+d1.getFullYear()
            let df2 = d2.getDate()+' '+this.monthNames[d2.getMonth()]+' '+d2.getFullYear()

            const worksheet = workbook.addWorksheet('Laporan Transaksi')

            worksheet.columns = [
                { header: 'Tgl Transaksi', key: 'tgl' },
                { header: 'Partisipan', key: 'nama' },
                { header: 'Pengeluaran', key: 'pengeluaran' },
                { header: 'Pemasukan', key: 'pemasukan' }
            ]
            
            this.listProduk.forEach(function(produk){
                worksheet.addRow({
                    tgl: produk.tgl, 
                    nama: produk.nama, 
                    pengeluaran: produk.pengeluaran, 
                    pemasukan: produk.pemasukan
                });
            })

            const buffer = await workbook.xlsx.writeBuffer()
            saveAs(new Blob([buffer]), `Tx Warung-Satwa `+df1+` - `+df2+`.xlsx`)

            let st = this.smalltalk
            setTimeout(function () {
                st.alert('Download Complete!', 'File berhasil disimpan')
            }, 1000);
        },
        editProduk: function(produkId){
            this.setModeModal('Edit', produkId)
        },
        konfirmasiHapus: function(produkId){
            this.konfirmasiHapusId = produkId
        },
        hapusProduk: function(){
            let isReplied = false
            window.api.receive("fromMain", (result) => {
                console.log(result)
                if(!isReplied){
                    if(result == 'OK'){
                        this.smalltalk.alert('Success!', 'Sukses menghapus data')
                        this.initTransaksi()
                        document.getElementById('closeHapus').click();
                    }else if(result == 'NO'){
                        this.smalltalk.alert('Failed!', 'Belum dapat menghapus data')
                    }else{
                        this.smalltalk.alert('DB FAIL', result)
                    }
                }
                isReplied = true
            });
            window.api.send("toMain", 
                {func: 'hapusTransaksi', 
                id: this.konfirmasiHapusId});
        },
        setModeModal: function(mode, produkId){
            this.mode = mode;
            if(this.mode == 'Tambah'){
				this.kode = ''
				this.satuan = ''
				this.hargaModal = ''
				this.hargaJual = ''
				this.namaBarang = ''
            }else{
            return produkId
            }
        },
        initTransaksi: function(){
            let d1 = new Date(this.date[0])
            let d2 = new Date(this.date[1])
            let df1 = d1.getFullYear()+'-'+(d1.getMonth()+1)+'-'+d1.getDate()+' 00:00:00'
            let df2 = d2.getFullYear()+'-'+(d2.getMonth()+1)+'-'+d2.getDate()+' 23:59:59'

            let isReplied = false
            const mn = this.monthNames;
            window.api.receive("fromMain", (result) => {
                if(!isReplied){
                    if(result.constructor === Array){
                        let arrayTemp = []
                        let totalPemasukan = 0
                        let totalPengeluaran = 0
                        result.forEach(function(item){
                            let pemasukan = 0
                            let pengeluaran = 0
                            let tgl = new Date(item.created_at)
                            let df = ((tgl.getDate() < 10 ? '0' : '') + tgl.getDate())+' '+mn[tgl.getMonth()]+' '+tgl.getFullYear()

                            if(item.is_pemasukan){
                                pemasukan = item.total - item.potongan
                            }else{
                                pengeluaran = item.total
                            }
                            arrayTemp.push({
                                id: item.id,
                                tgl: df,
                                nama: item.pelanggan,
                                pengeluaran: !item.is_pemasukan ? pengeluaran : 0,
                                pemasukan: item.is_pemasukan ? pemasukan : 0,
                                detail_barang: item.detail_barang
                            })

                            totalPemasukan += pemasukan
                            totalPengeluaran += pengeluaran
                        })
                        this.listProduk = arrayTemp
                        this.pemasukan = totalPemasukan
                        this.pengeluaran = totalPengeluaran
                    }else{
                        this.smalltalk.alert('DB FAIL', result)
                    }
                }
                isReplied = true
            });

            window.api.send("toMain", 
                {func: 'getTransaksi', 
                d1: df1,
                d2: df2});
        }
    },
}
</script>