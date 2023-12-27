import asyncHandler from "express-async-handler";
import { connection } from "../database/index.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// @description Auth/user/set token
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    connection.query("select * from users where email =?", [email], async (error, results) => {
        if (results.length > 0) {
            const isCorrect = await bcrypt.compare(password, results[0].password);
            if (isCorrect) {
                generateToken(res, results[0].id);
                res.status(200).json({
                    id: results[0].id,
                    name: results[0].name,
                    email: results[0].email
                })
            } else {
                res.status(401).json({ message: 'Incorrect password' });
            }
        } else {
            res.status(401).json({ message: 'Invalid email' });
        }
    })
})

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    connection.query("select * from users where email = ?", [email], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.status(400).json({ message: 'User already exits' });
        } else {
            connection.query("insert into users (name,email, password) values (?, ?, ?)", [name, email, hashPassword], (err, results) => {
                if (err) throw err;
                generateToken(res, results.insertId);
                res.status(200).json({ message: 'User register successfully' });
            })
        }
    });
})

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'User logout' });
})


const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
    }
    res.status(200).json(user);
})

const updateUserProfile = asyncHandler(async (req, res) => {
    connection.query('update users set name= ?, email= ? where id= ?', // parola güncellemesi şuan için aktive edilmedi. hashed password ile güncelle
        [req.body.name, req.body.email, req.user.id],
        (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Profile updated successfully' });
            } else {
                res.status(400).json({ message: 'update profile error' });
            }
        }
    )

})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}