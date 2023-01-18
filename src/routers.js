import LoginPage from './components/LoginPage.vue'
import KasirPage from './components/KasirPage.vue'

import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'

// hanya untuk yg ganti component induk
const routes = [
	{
		name: 'LoginPage',
		component: LoginPage,
		path: "/"
	},
	{
		name: 'Kasir',
		component: KasirPage,
		path: "/kasir"
	},
];

const router = createRouter({
	history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
	routes,
});

export default router;