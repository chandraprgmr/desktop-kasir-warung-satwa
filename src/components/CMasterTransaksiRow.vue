<template>
<tr v-for="(produk, index) in listProduk" :key="index">
    <td class="text-center">{{ produk.tgl }}</td>
    <td>{{ produk.nama }}</td>
    <td>
        <span class="float-right">{{ produk.pengeluaran }}</span>
    </td>
    <td class="float-right">
        <span class="float-right">{{ produk.pemasukan }}</span>
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
    name : 'CKelolaProdukRow',
    emits: ['konfirmasiHapus', 'editProduk'],
    props: ['listProduk'],
}
</script>