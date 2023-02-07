import e from 'express'
import config from 'config'
import mongoose from "mongoose";
import router from "./routes/authRoutes.js";

mongoose.set('strictQuery', true)
const app = e()

app.use('/api/auth', router )

async function run() {
    try {
        await mongoose.connect(config.get('DB_URL'))
        app.listen(config.get('port'), () => {
            console.log(`Server listens http://${config.get('host')}:${config.get('port')}`)
        })
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }

}
run()

