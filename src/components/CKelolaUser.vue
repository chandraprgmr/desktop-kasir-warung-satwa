<template>
	<div class="row">
		<div class="col-md-6">
		<button class="btn btn-success float-left" data-toggle="modal" data-target="#exampleModal" @click="setModeModal('Tambah')">Tambah User</button>
		</div>
		<div class="col-md-6">
		<input id="searchBox" class="form-control ps-0" type="text" placeholder="Cari nama user . . ." aria-label="Search" v-model="searchValue"> 
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
                              <th>Nama</th>
                              <th>Username</th>
                              <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <CKelolaUserRow v-bind:listProduk="listProduk" v-on:konfirmasiHapus="konfirmasiHapus" v-on:editProduk="editProduk" />
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
            <h5 class="modal-title" id="exampleModalLabel">{{mode}} User</h5>
            <button id="closeModal" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group">
                <div class="col-md-12 mb-3">
                    <label>Nama User</label>
                    <input id="inputNama" class="form-control ps-0" type="text" v-model="nama">    
                </div>
                <div class="col-md-12 mb-3">
                    <label>Username</label>
                    <input class="form-control ps-0" type="text" v-model="username">    
                </div>
                <div class="col-md-12 mb-3">
                    <label>Password</label>
                    <input class="form-control ps-0" type="password" v-model="password">    
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
            <h5 class="modal-title" id="exampleModalLabel">Hapus User</h5>
            <button id="closeHapus" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Anda Yakin ingin menghapus User ini?</p>
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
// import CKelolaUserRow from './CKelolaUserRow.vue'
// import bcrypt from 'bcryptjs'

export default{
	name: 'CKelolaUser',
  inject: ['smalltalk'],
	components : {
      // CKelolaUserRow,
  },
  setup() {
      const headers = [
        { text: "Nama", value: "nama", sortable: true  },
        { text: "Username", value: "username", sortable: true },
        { text: "Action", value: "action"}
      ];

      return {
        headers
      };
  },
  data(){return{
    searchField: ['nama', 'username'],
    searchValue: '',
	listProduk:[],
	mode: 'Edit',
	nama: '',
	username: '',
  password: '',
  generatedPass: '',
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
              {func: 'hapusUser', 
              id: this.konfirmasiHapusId});
      },
      setModeModal: function(mode, produkId){
          this.mode = mode;
          if(this.mode == 'Tambah'){
            document.getElementById("inputNama").focus();
            this.nama = ''
            this.username = ''
            this.password = ''
          }else{
            let isi = null;
            this.listProduk.forEach(function(item){
                if(item.id == produkId){
                    isi = item
                }
            })
            this.id = isi.id
            this.nama = isi.nama
            this.username = isi.username
            this.password = ''
          }
      },
      action: function(){
        var bcrypt = require('bcryptjs');
        let isReplied = false
        window.api.receive("fromMain", (result) => {
          if(!isReplied){
              if(result == 'OK'){
                  this.smalltalk.alert('Success!', 'Sukses memperbaharui data')
                  this.initProduk()
                  document.getElementById('closeModal').click();
              }else if(result == 'NO'){
                  this.smalltalk.alert('Failed!', 'Belum dapat menghapus data')
              }else{
                  this.smalltalk.alert('DB FAIL', result)
              }
          }
          isReplied = true
        });

        window.api.send("toMain", {
            func: 'saveUser', 
            mode: this.mode,
            id : this.id,
            nama : this.nama,
            username : this.username,
            password : this.password == '' ? null : bcrypt.hashSync(this.password, 10)
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
                              nama: item.nama,
                              username: item.username,
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
              {func: 'getUser', 
              search: 'search'});
      }
    },
}
</script>