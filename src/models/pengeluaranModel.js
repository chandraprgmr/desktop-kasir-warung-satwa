// import connection
import db from "../configdb.js";

// get pengeluaran
export const getPengeluaran = (data, result) => {
    db.query(`SELECT pengeluaran.id, pengeluaran.keterangan, pengeluaran.total,
                pengeluaran.created_at, pengeluaran.tgl_transaksi 
                FROM pengeluaran
                `, 
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
export const searchPengeluaran = (data, result) => {
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

export const savePengeluaran = (data, result) => {
    if(data.mode == 'Tambah'){
        let idTrx = 'TRX'+ Date.now()
        db.query(`INSERT INTO pengeluaran (pengeluaran.id, pengeluaran.keterangan, 
                pengeluaran.total, pengeluaran.tgl_transaksi, pengeluaran.user_id) VALUES 
                (?, ?, ?, ?, ?)
                `, [idTrx, data.keterangan, data.total, data.tgl,
                    data.user_id], (err, results) => {             
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

        db.query(`UPDATE pengeluaran SET pengeluaran.keterangan = ?, pengeluaran.total = ?, 
                pengeluaran.tgl_transaksi = ?, pengeluaran.user_id = ?, pengeluaran.updated_at = ?
                WHERE pengeluaran.id = ? `, [data.keterangan, data.total, data.tgl, 
                    data.user_id, datestring, data.id], (err, results) => {             
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