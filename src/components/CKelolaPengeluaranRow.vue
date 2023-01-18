<template>
<tr v-for="(produk, index) in listProduk" :key="index">
    <td>{{ produk.tgl }}</td>
    <td class="text-center" width="10%">{{ produk.keterangan }}</td>
    <td class="float-right">
        {{ produk.total }}
    </td>
    <td class="text-center">
        <div class="btn-group">
            <button class="btn btn-info" @click="$emit('editProduk', produk.id)" data-toggle="modal" data-target="#exampleModal">Edit</button>
            <button class="btn btn-danger" @click="$emit('konfirmasiHapus', produk.id)" data-toggle="modal" data-target="#hapusModal">Hapus</button>
        </div>
    </td>
</tr>	
</template>

<script>
export default{
    name : 'CKelolaPengeluaranRow',
    emits: ['konfirmasiHapus', 'editProduk'],
    props: ['listProduk'],
}
</script>