<template>
<tr v-for="(produk, index) in listProduk" :key="index">
    <td>{{ produk.nama }}</td>
    <td class="text-center" width="10%">{{ produk.username }}</td>
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
    name : 'CKelolaUserRow',
    emits: ['konfirmasiHapus', 'editProduk'],
    props: ['listProduk'],
}
</script>