<template>
<tr v-for="(produk, index) in listProduk" :key="index">
    <td class="text-center">{{ produk.tgl }}</td>
    <td>{{ produk.nama }}</td>
    <td class="float-right">{{ produk.hutang }}</td>
    <td class="text-center">
        <button class="btn btn-success" @click="$emit('editProduk', produk.id, produk.hutang)" data-toggle="modal" data-target="#exampleModal">Bayar</button>
    </td>
</tr>	
</template>

<script>
export default{
    name : 'CKelolaHutang',
    emits: ['konfirmasiHapus', 'editProduk'],
    props: ['listProduk'],
}
</script>