// import connection
import db from "../configdb.js";

// get satuan
export const getSatuan = (data, result) => {
    db.query(`SELECT id, satuan FROM satuan
        WHERE deleted_at IS NULL`, (err, results) => {             
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

export const saveSatuan = (data, result) => {
    if(data.mode == 'Tambah'){
        db.query(`INSERT INTO satuan (satuan.satuan) VALUES 
                (?)
                `, [data.satuan], (err, results) => {             
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

        db.query(`UPDATE satuan SET satuan.satuan = ?, satuan.updated_at = ?
                WHERE satuan.id = ?
                `, [data.satuan, datestring, data.id], (err, results) => {             
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

export const hapusSatuan = (data, result) => {
    let d = new Date();

    let datestring = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " +
    d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

    db.query(`UPDATE satuan SET satuan.deleted_at = ?
            WHERE satuan.id = ?
            `, [datestring, data.id], (err, results) => {             
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