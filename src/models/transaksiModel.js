// import connection
import db from "../configdb.js";

// get barang
export const getTransaksi = (data, result) => {
    db.query(`(SELECT transaksi.id, transaksi.pelanggan, SUM((transaksi_detail.harga_jual * transaksi_detail.qty) 
                - (transaksi_detail.harga_beli * transaksi_detail.qty)) as total, 
                transaksi.is_hutang, transaksi.created_at, uang_diserahkan, '1' as is_pemasukan, potongan 
                FROM transaksi
                LEFT JOIN transaksi_detail ON transaksi.id = transaksi_detail.transaksi_id
                WHERE is_hutang = '0'
                AND (DATE(transaksi.created_at) BETWEEN ? AND ?)
                GROUP BY transaksi.id)
                UNION
                (SELECT pengeluaran.id, nama as pelanggan, total, '0' as is_hutang, tgl_transaksi as created_at,
                '0' as uang_diserahkan, '0' as is_pemasukan, '0' as potongan 
                FROM pengeluaran
                LEFT JOIN user ON user_id = user.id
                WHERE (DATE(tgl_transaksi) BETWEEN ? AND ?))
                ORDER BY created_at DESC
                `, [data.d1, data.d2, data.d1, data.d2],
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

export const saveTransaksi = (data, result) => {
    if(data.mode == 'Tambah'){
        let idTrx = 'TRX'+ Date.now()

        db.query(`INSERT INTO transaksi (id, pelanggan, uang_diserahkan, total, is_hutang, potongan, created_at) VALUES 
                (?, ?, ?, ?, ?, ?, ?)
                `, [idTrx, data.pelanggan, data.diserahkan, data.totalHarga, data.isHutang, data.potongan, data.tanggal], 
                (err, results) => {             
            if(err) {
                result(err, null);
            } else {
                data.items.forEach(function(item){
                    db.query(`INSERT INTO transaksi_detail (transaksi_id, barang_id, qty, harga_beli, harga_jual) 
                    VALUES (?, ?, ?, ?, ?)
                            `, [idTrx, item.id, item.qty, item.harga_beli, item.harga], 
                            (err, results) => {             
                        if(err) {
                            result(err, null);
                        }
                    });
                })
                result(null, 'OK')
            }
        });
    }else{
        let d = new Date();

        let datestring = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " +
        d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

        db.query(`UPDATE user SET user.nama = ?, user.username = ?, user.updated_at = ?
                WHERE user.id = ?
                `, [data.nama, data.username, datestring, data.id], (err, results) => {             
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

export const hapusTransaksi = (data, result) => {
    let idHapus = data.id
    // hapus detail transaksi
    db.query(`DELETE FROM transaksi_detail WHERE transaksi_id = ?
            `, [idHapus], (err, results) => {             
        if(err) {
            result(err, null);
        } else {
            db.query(`DELETE FROM transaksi WHERE id = ?
            `, [idHapus], (err2, results2) => {             
                if(err2) {
                    result(err2, null);
                } else {
                    if(results2.affectedRows > 0){
                        result(null, 'OK')
                    }else{
                        result(null, 'NO')
                    }
                }
            }); 
        }
    });  
}

// get hutang
export const getHutang = (data, result) => {
    db.query(`SELECT transaksi.id, transaksi.pelanggan, total, 
                transaksi.is_hutang, transaksi.created_at, uang_diserahkan 
                FROM transaksi
                WHERE is_hutang = '1'
                AND MONTH(created_at) = ?
                AND YEAR(created_at) = ?
                `, [data.month, data.year],
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

export const saveHutang = (data, result) => {
    let d = new Date();

    let datestring = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " +
    d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

    db.query(`UPDATE transaksi SET transaksi.uang_diserahkan = transaksi.uang_diserahkan + ?, 
            transaksi.updated_at = ?, transaksi.is_hutang = ?
            WHERE transaksi.id = ?
            `, [data.ud, datestring, data.is_hutang, data.id], (err, results) => {             
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