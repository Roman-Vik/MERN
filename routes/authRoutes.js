import {Router} from "express";
import config from 'config'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {check, validationResult} from 'express-validator'
import User from "../models/User.js";

const router = Router()

//'/api/auth/reg'
router.post('/reg',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длинна пароля 4 символа').isLength({min: 4})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array(),
                    mess: 'Некорректные данные при регистрации'
                })
            }
            const {email, password} = req.body
            const candidate = await User.findOne({email: email})
            if (candidate) {
                return res.status(400).json({mess: "Такой пользователь уже существует"})
            }
            const hashedPass = await bcrypt.hash(password, 12)
            const user = new User({email, hashedPass})
            await user.save()

            res.status(201).json({mess: "Пользователь создан"})

        } catch (e) {
            res.status(500).json({mess: "Что-то пошло не так попробуйте снова"})
        }

    })


//'/api/auth/log'
router.post('/log',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array(),
                    mess: 'Некорректные данные при входе в систему'
                })
            }
            const {email, password} = req.body
            const user = await User.findOne({email, password})

            if (!user) {
                return res.status(400).json({mess: "Такого пользователя не существует"})
            }
            //совпадают ли пароли
            const isMatchPass = await bcrypt.compare(password, user.password)
            if (!isMatchPass) {
                return res.status(400).json({mess: "Не верный пароль, попробуйте снова"})
            }

            const token = jwt.sign(
                {userId: user.id},//id пользователя
                config.get('jwtSecret'), //уникальный ключ
                {expiresIn:'1h'} // через какое время закончить токен
            )

            res.json({token, userId: user.id})

        } catch (e) {
            res.status(500).json({mess: "Что-то пошло не так попробуйте снова"})
        }
    })

export default router