import jwt from 'jsonwebtoken';

const generateToken = (res, userID) => {
    const token = jwt.sign({ userID }, process.env.SECRET_KEY, {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSites: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
}

export default generateToken;