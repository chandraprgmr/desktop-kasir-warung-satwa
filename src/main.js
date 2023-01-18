// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import router from "./routers"
import smalltalk from 'smalltalk'
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

// createApp(App)
// 	.use(router)
// 	.mount('#app');

const myGlobalVariables = {
	data(){
		return {
			modal: false,
			monthNames : ["Januari", "Februari", "Maret", 
				"April", "Mei", "Juni", "Juli", "Agustus", 
				"September", "Oktober", "November", "Desember"],
		}
	}
}

createApp(App)
	.use(router)
	.component('EasyDataTable', Vue3EasyDataTable)
	.provide('smalltalk', smalltalk)
	.mixin(myGlobalVariables)
	.mount('#app');

// const app = createApp(App).use(router);
// app.mixin(myGlobalVariables);
// app.mount('#app');