<template>
<tr v-for="(produk, index) in listProduk" :key="index">
    <td class="text-center" width="10%">{{ index+1 }}</td>
    <td>{{ produk.nama }}</td>
    <td class="text-center" width="10%">{{ produk.satuan }}</td>
    <td class="float-right">
        {{ produk.harga }}
    </td>
    <td class="text-center" width="10%">
        <input class="form-control" type="number" v-model="produk.qty" @input="$emit('kalibrasiTotal', produk.id)">
    </td>
    <td width="20%">
        <input class="form-control" type="text" v-model="produk.totalHarga" @keyup="$emit('kalibrasiQty', produk.id)">
    </td>
    <td class="text-center">
        <button class="btn btn-danger" @click="$emit('hapusProduk', produk.id)">Hapus</button>
    </td>
</tr>	
</template>

<script>
export default{
    name : 'CKasirMainRow',
    emits: ['hapusProduk', 'kalibrasiTotal', 'kalibrasiQty'],
    props: ['listProduk'],
}
</script>