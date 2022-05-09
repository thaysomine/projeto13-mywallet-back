import database from "../database.js";

export default async function validToken(req, res, next) {
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    if(!token) return res.sendStatus(401);

    try {
        const session = await database.collection('sessions').findOne({token});
        if(!session) return res.sendStatus(401);

        const user = await database.collection('balances').find({user: session.user}).toArray();
        if(!user) return res.sendStatus(404);

        console.log('user', user);
        user.map(item => {
            delete item._id;
            delete item.user;
        });
        res.locals.user = user;
        next();
    } catch {
            res.status(404).send('TOKEN inválido');
            console.log('TOKEN inválido');
        }
}