<template>
	<ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        <!-- Sidebar - Brand -->
        <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
            <div class="sidebar-brand-text mx-3">Warung Satwa</div>
        </a>

        <!-- Divider -->
        <hr class="sidebar-divider my-0">

        <li v-for="(menu, index) of menus" class="nav-item" :key="index" v-bind:class="{active: cMenu === menu.id}" @click="$emit('gantiPage', menu.id, menu.text)">
            <a class="nav-link">
                <i class="fas fa-fw" :class="menu.icon"></i>
                <span>{{ menu.text }}</span>
            </a>
        </li>

    </ul>
</template>
<script>
	export default{
		name: 'CSideBar',
        props: ['cMenu'],
        emits : ['gantiPage'], 
        data(){
            return {
                menus: [
                    {
                        id: 'kasir',
                        text: 'Kasir',
                        link: '/kasir',
                        icon: 'fa-cash-register'
                    },
                    {
                        id: 'kelola-pengeluaran',
                        text: 'Kelola Pengeluaran',
                        link: '/kelola-pengeluaran',
                        icon: 'fa-hand-holding-dollar'
                    },
                    {
                        id: 'kelola-produk',
                        text: 'Kelola Produk',
                        link: '/kelola-produk',
                        icon: 'fa-boxes-stacked'
                    },
                    {
                        id: 'kelola-hutang',
                        text: 'Kelola Hutang',
                        link: '/kelola-hutang',
                        icon: 'fa-receipt'
                    },
                    {
                        id: 'master-transaksi',
                        text: 'Master Transaksi',
                        link: '/master-transaksi',
                        icon: 'fa-money-bill-transfer'
                    },
                    {
                        id: 'kelola-user',
                        text: 'Kelola User',
                        link: '/kelola-user',
                        icon: 'fa-users'
                    },
                    {
                        id: 'kelola-satuan',
                        text: 'Kelola Satuan',
                        link: '/kelola-satuan',
                        icon: 'fa-scale-balanced'
                    },
                ]
            }
        }
	}
</script>