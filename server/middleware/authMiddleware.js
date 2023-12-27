import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { connection } from '../database/index.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            // Asenkron işlemleri bekleyerek senkron hale getir
            const userResult = await getUserFromDatabase(decoded.userID);
            const reqUser = {
                name: userResult.name,
                email: userResult.email,
                id: userResult.id,
            }
            req.user = reqUser;
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, invalid jwt token" })
        }
    } else {
        res.status(401).json({ message: "Not authorized, no JWT token" })
    }
});

const getUserFromDatabase = async (userId) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM users WHERE id = ?", [userId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]); // query sonucu bir dizi döner, ilk elemanı alarak kullanın
            }
        });
    });
};

export { protect };
