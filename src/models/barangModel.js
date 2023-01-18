// import connection
import db from "../configdb.js";

// get barang
export const getBarang = (data, result) => {
    db.query(`SELECT barang.id, barang.nama, barang.harga_beli, 
                barang.harga_jual, barang.satuan_id, barang.kode, satuan.satuan FROM barang
                LEFT JOIN satuan ON satuan_id = satuan.id
                WHERE barang.deleted_at IS NULL`, 
                (err, results) => {             
        if(err) {
            result(err, null);
        } else {
            if(results.length > 0){
                result(null, results)
            }else{
                result(null, [])
            }
        }
    });   
}

// get barang
export const searchBarang = (data, result) => {
    if(data.search == ''){
        db.query(`SELECT barang.id, barang.nama, barang.harga_beli, 
                barang.harga_jual, barang.satuan_id, barang.kode, satuan.satuan FROM barang
                LEFT JOIN satuan ON satuan_id = satuan.id
                WHERE barang.deleted_at IS NULL
                ORDER BY barang.nama
                LIMIT 15`,
                (err, results) => {             
            if(err) {
                result(err, null);
            } else {
                if(results.length > 0){
                    result(null, results)
                }else{
                    result(null, [])
                }
            }
        });
    }else{
        db.query(`SELECT barang.id, barang.nama, barang.harga_beli, 
                barang.harga_jual, barang.satuan_id, barang.kode, satuan.satuan FROM barang
                LEFT JOIN satuan ON satuan_id = satuan.id
                WHERE barang.deleted_at IS NULL
                AND (barang.nama LIKE ? OR barang.kode = ?)
                ORDER BY barang.nama
                LIMIT 15`,
                ['%'+data.search+'%', '%'+data.search+'%'], 
                (err, results) => {             
            if(err) {
                result(err, null);
            } else {
                if(results.length > 0){
                    result(null, results)
                }else{
                    result(null, [])
                }
            }
        });
    }   
}

export const saveBarang = (data, result) => {
    if(data.mode == 'Tambah'){
        db.query(`INSERT INTO barang (barang.nama, barang.harga_beli, 
                barang.harga_jual, barang.satuan_id, barang.kode) VALUES 
                (?, ?, ?, ?, ?)
                `, [data.nama, data.harga_beli, data.harga_jual, 
                    data.satuan_id, data.kode], (err, results) => {             
            if(err) {
                result(err, null);
            } else {
                result(null, 'OK')
            }
        });
    }else{
        let d = new Date();

        let datestring = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " +
        d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

        db.query(`UPDATE barang SET barang.nama = ?, barang.harga_beli = ?, 
                barang.harga_jual = ?, barang.satuan_id = ?, barang.kode = ?, barang.updated_at = ?
                WHERE barang.id = ? `, [data.nama, data.harga_beli, data.harga_jual, 
                    data.satuan_id, data.kode, datestring, data.id], (err, results) => {             
            if(err) {
                result(err, null);
            } else {
                if(results.changedRows > 0){
                    result(null, 'OK')
                }else{
                    result(null, 'NO')
                }
            }
        });
    }   
}