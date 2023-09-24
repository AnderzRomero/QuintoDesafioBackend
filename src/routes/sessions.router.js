import { Router } from "express";
import UserManager from "../dao/mongo/managers/usersManager.js";

const router = Router();
const usersServices = new UserManager();

// EndPoint para crear un usuario y almacenarlo en la Base de Datos
router.post('/register', async (req, res) => {

    const { firstName, lastName, email, age, password } = req.body;
    if (!firstName || !lastName || !email || !age || !password) return res.status(400).send({ status: "error", error: "Valores incompletos" })

    const newUser = { firstName, lastName, email, age, password };
    const result = await usersServices.create(newUser);
    res.status(200).send({ status: "success", message: "Usuario registrado correctamente", payload: result._id });
})

// EndPoint para logearse con el usuario
router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Valores incompletos" })

    const user = await usersServices.getBy({ email, password });
    if (!user) return res.status(400).send({ status: "error", error: "Credenciales Incorrectas" });
    req.session.user = user;
    res.status(200).send({ status: "success", message: "logeado correctamente" });
})

// EndPoint para Finalizar la session
router.get('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error);
        }
        return res.redirect('/');
    });
})

export default router;