<template>
	<div class="row">
		<div class="col-md-6">
		<button class="btn btn-success float-left" data-toggle="modal" data-target="#exampleModal" @click="setModeModal('Tambah')">Tambah Satuan</button>
		</div>
		<div class="col-md-6">
		<input id="searchBox" class="form-control ps-0" type="text" placeholder="Cari satuan . . ." aria-label="Search" v-model="searchValue"> 
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
                              <th>Satuan</th>
                              <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <CKelolaSatuanRow v-bind:listProduk="listProduk" v-on:konfirmasiHapus="konfirmasiHapus" v-on:editProduk="editProduk" />
                        </tbody>
                    </table> -->
          <EasyDataTable
            header-text-direction="center"
            :headers="headers"
            :items="listProduk"
            :search-field="searchField"
            :search-value="searchValue"
            :rows-per-page="10">
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
            <h5 class="modal-title" id="exampleModalLabel">{{mode}} Satuan</h5>
            <button id="closeModal" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group">
                <div class="col-md-12 mb-3">
                    <label>Satuan</label>
                    <input class="form-control ps-0" type="text" v-model="satuan">    
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
            <h5 class="modal-title" id="exampleModalLabel">Hapus Satuan</h5>
            <button id="closeHapus" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Anda Yakin ingin menghapus Satuan ini?</p>
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
// import CKelolaSatuanRow from './CKelolaSatuanRow.vue'

export default{
	name: 'CKelolaSatuan',
  inject: ['smalltalk'],
	// components : {
  //       CKelolaSatuanRow,
  //   },
  setup() {
      const headers = [
        { text: "Satuan", value: "satuan", sortable: true  },
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
	mode: 'Edit',
	satuan: '',
    konfirmasiHapusId: '',
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
          let isReplied = false
          window.api.receive("fromMain", (result) => {
              console.log(result)
              if(!isReplied){
                  if(result == 'OK'){
                      this.smalltalk.alert('Success!', 'Sukses menghapus data')
                      this.initProduk()
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
              {func: 'hapusSatuan', 
              id: this.konfirmasiHapusId});
        },
        setModeModal: function(mode, produkId){
          this.mode = mode;
          if(this.mode == 'Tambah'){
            this.satuan = ''
          }else{
            let isi = null;
            this.listProduk.forEach(function(item){
                if(item.id == produkId){
                    isi = item
                }
            })
            this.id = isi.id
            this.satuan = isi.satuan
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
              func: 'saveSatuan', 
              mode: this.mode,
              id : this.id,
              satuan : this.satuan,
          });
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
                            satuan: item.satuan,
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
            {func: 'getSatuan', 
            search: 'search'});
      }
    },
}
</script>