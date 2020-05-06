import bcrypt from "bcrypt";

export default (password) =>
    new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if(err) {
                return reject(err);
            } else {
                return resolve(hash);
            }
        });
    });