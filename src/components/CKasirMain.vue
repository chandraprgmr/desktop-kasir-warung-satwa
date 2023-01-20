<template>
    <div class="row">
        <div class="col-md-8">
            <div class="card border-left-success">
                <div class="card-body">
                    <div class="input-group">
                        <div class="col-md-12 mb-3">
                            <label>Cari Produk <small>(F3)</small></label>
                            <input id="searchBar" autocomplete="off" class="form-control ps-0" type="text" placeholder="Ketik nama produk . . ." v-model="search" @focus="$event.target.select()">
                            <div v-if="modal" id="cv-autocomplete">
                                <ul>
                                    <li v-for="(s,i) in list" v-bind:key="i" @click="setSelected(s)">
                                        {{ s.kode + ' - ' + s.nama +' ('+s.satuan_show+')' }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <button class="btn btn-warning btn-block" @click="tambahItem()">TAMBAH</button>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card border-left-success">
                <div class="card-body">
                    <h3 class="float-right"><b>Total Transaksi</b></h3>
                    <br><br>
                    <p class="float-right totalHarga">Rp. {{ getTotalHarga }}</p>
                </div>
            </div>
        </div>
    </div>

    <br>

    <div class="row">
        <div class="col-md-12" style="height: 360px; overflow: auto">
            <div class="card">
                <div class="card-body">
                    <table class="table table-striped" id="table-kasir">
                        <thead>
                            <tr>
                              <th>No</th>
                              <th>Nama Barang</th>
                              <th>Satuan</th>
                              <th>Harga (Rp.)</th>
                              <th>Qty</th>
                              <th>Total Harga (Rp.)</th>
                              <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <CKasirMainRow v-bind:listProduk="listProduk" v-on:hapusProduk="hapusProduk" v-on:kalibrasiTotal="kalibrasiTotal" v-on:kalibrasiQty="kalibrasiQty" />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <br>
    <div class="col-md-12">
       <button class="btn btn-warning btn-block" data-toggle="modal" data-target="#exampleModal" @click="bukaModal">SELESAIKAN TRANSAKSI</button>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Info Transaksi</h5>
            <button id="closeModal" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group">
                <div class="col-md-12 mb-3">
                    <label>Tanggal Transaksi</label>
                    <input class="form-control ps-0" type="date" v-model="tanggal">    
                </div>
                <div class="col-md-12 mb-3">
                    <label>Uang Diserahkan (Rp.)</label>
                    <input class="form-control ps-0" type="text" v-model="diserahkan">    
                </div>
                <div class="col-md-12 mb-3">
                    <label>Potongan (Rp.)</label>
                    <input class="form-control ps-0" type="text" v-model="potongan">    
                </div>
                <div class="col-md-12 mb-3">
                    <label>Kembalian (Rp.)</label>
                    <input class="form-control ps-0" type="text" v-model="getKembalian">    
                </div>
                <div class="col-md-12 mb-3">
                    <label>Nama Pelanggan (Opt)</label>
                    <input class="form-control ps-0" type="text" v-model="pelanggan">    
                </div>
                <div class="col-md-12 mb-3">
                    <label>Hutang</label>
                    <input class="form-control" style="width: 9%" type="checkbox" v-model="isHutang">    
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

    <button v-show="false" id="closeAutocomplete" @click="closeAutocomplete()">Close</button> 
</template>

<script>
import CKasirMainRow from './CKasirMainRow.vue'
import shortcut from "../shortcut.js";

export default{
    name : 'CKasirMain',
    inject: ['smalltalk'],
    components : {
        'CKasirMainRow' : CKasirMainRow,
    },
    data(){
        return{
            mode: 'Tambah',
            listProduk: [],
            list: [],
            search: '',
            selected: null,
            tanggal: '',
            potongan: 0,
            totalHarga: 0,
            diserahkan: 0,
            pelanggan: '',
            isHutang: false
        }
    },
    mounted(){
        document.getElementById("searchBar").focus();
        this.initSearch('')
    },
    watch: {
        search(value) {
            this.modal = true
            this.initSearch(value)
        },
        getTotalHarga(value){
            this.diserahkan = value
        }
    },
    methods : {
        bukaModal: function(){
            let tgl = new Date()
            // date format yyyy-mm-dd
            let df = tgl.getFullYear()+'-'+(((parseInt(tgl.getMonth())+1) < 10 ? '0' : '') + (parseInt(tgl.getMonth())+1))+'-'+((tgl.getDate() < 10 ? '0' : '') + tgl.getDate())
            this.tanggal = df
        },
        tambahItem: function(){
            let sid = this.selected.id
            let masuk = false
            this.listProduk.filter(function(item) {
                if(item.id == sid){
                    item.qty += 1
                    masuk = true
                }
            })

            if (!masuk) {
                this.listProduk.push(this.selected)
            }
        },
        hapusProduk: function(produkId){
            this.listProduk = this.listProduk.filter(function(item) {
                return item.id !== produkId
            })
        },
        kalibrasiTotal: function(produkId){
            this.listProduk.filter(function(item) {
                if(item.id == produkId){
                    item.totalHarga = item.harga * item.qty
                }
            })
        },
        kalibrasiQty: function(produkId){
            this.listProduk.filter(function(item) {
                if(item.id == produkId){
                    item.qty = item.totalHarga / item.harga
                    item.qty = Math.round(item.qty * 10) / 10
                }
            })
        },
        setSelected: function(produk){
            this.selected = {
                id: produk.id, 
                kode: produk.kode, 
                nama: produk.nama, 
                satuan: produk.satuan_show, 
                satuan_id: produk.satuan,
                harga_beli: produk.harga_beli, 
                harga: produk.harga_jual,
                qty: 1, 
                totalHarga: produk.harga_jual
            }
            this.search = produk.kode + ` - `+produk.nama + ` (` + produk.satuan_show + `)`
            this.modal = false
        },
        initSearch: function(search){
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
                                harga_beli: item.harga_beli,
                                harga_jual: item.harga_jual
                            })
                        })

                        this.list = arrayTemp
                    }else{
                        console.log(result)
                        this.smalltalk.alert('DB FAIL', result)
                    }
                }
                isReplied = true
            });
            window.api.send("toMain", 
                {func: 'searchBarang', 
                search: search});
        },
        closeAutocomplete: function() {
            this.modal = false
        },
        action: function(){
            let isReplied = false
            let listBeli = []

            window.api.receive("fromMain", (result) => {
                if(!isReplied){
                    if(result == 'OK'){
                      this.smalltalk.alert('Success!', 'Sukses memperbaharui data')
                      this.listProduk = []
                      document.getElementById('closeModal').click();
                    }else if(result == 'NO'){
                      this.smalltalk.alert('Failed!', 'Belum dapat memperbaharui data')
                    }else{
                      this.smalltalk.alert('DB FAIL', result)
                    }
                }
                isReplied = true
            });

            this.listProduk.forEach(function(produk){
                console.log(produk)
                listBeli.push({
                    id: produk.id, 
                    kode: produk.kode, 
                    nama: produk.nama, 
                    satuan: produk.satuan_id, 
                    harga: produk.harga, 
                    harga_beli: produk.harga_beli, 
                    qty: produk.qty, 
                    totalHarga: produk.totalHarga
                })
            })

            window.api.send("toMain", {
              func: 'saveTransaksi', 
              mode: this.mode,
              tanggal: this.tanggal,
              pelanggan : this.pelanggan,
              diserahkan : this.diserahkan,
              totalHarga : this.getTotalHarga,
              potongan : this.potongan,
              isHutang: this.isHutang,
              items: listBeli 
            });
        },
    }, 
    computed : {
        getTotalHarga: function(){
            let th = 0
            this.listProduk.forEach(function(lp){
                th += parseInt(lp.totalHarga)
            })
            if(isNaN(th)){
                th = 0
            }
            return th;
        },
        getKembalian: function(){
            let kembalian = 0
            let potongan = isNaN(this.potongan) || this.potongan === '' ? 0 : this.potongan
            kembalian = parseInt(this.diserahkan - this.getTotalHarga) + parseInt(potongan)
            return kembalian;
        }
    }
}

shortcut.add("F3", function() {
    document.getElementById("searchBar").focus();
});

shortcut.add("esc", function() {
    document.getElementById("closeAutocomplete").click();
});
</script>