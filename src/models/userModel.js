// import connection
import db from "../configdb.js";

// get barang
export const login = (data, result) => {
    db.query("SELECT * FROM user WHERE username = ?", 
        [data.username], (err, results) => {             
        if(err) {
            result(err, null);
        } else {
            if(results.length > 0){
                result(null, results)
            }else{
                result(null, 0)
            }
        }
    });   
}

// get user
export const getUser = (data, result) => {
    db.query(`SELECT id, nama, username 
                FROM user
                WHERE deleted_at IS NULL
                `, [data.search],
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

export const saveUser = (data, result) => {
    if(data.mode == 'Tambah'){
        console.log(data)
        db.query(`INSERT INTO user (user.nama, user.username, user.password) VALUES 
                (?, ?, ?)
                `, [data.nama, data.username, data.password], (err, results) => {             
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

        if (data.password === null) {
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
        }else{
            db.query(`UPDATE user SET user.nama = ?, user.username = ?, user.password = ?, user.updated_at = ?
                WHERE user.id = ?
                `, [data.nama, data.username, data.password, datestring, data.id], (err, results) => {             
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
}

export const hapusUser = (data, result) => {
    let d = new Date();

    let datestring = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " +
    d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

    db.query(`UPDATE user SET user.deleted_at = ?
            WHERE user.id = ?
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