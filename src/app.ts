import express, { Application, Request, Response } from 'express'
import cors from 'cors'

import globallyErrorHandler from './app/middlewares/globallyErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './routes';
import cookieParser from 'cookie-parser'
//npm init -y
//npm install express --save
//npm install mongoose --save
//npm install typescript --save-dev
//npm i cors
//npm i dotenv
//npm run build
//tsc -init
//npm i @types/express
//npm i --save-dev @types/cors
//npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
//npx eslint --init
//npx eslint src .  ||  npm run lint --fix
//npm install babel-eslint --save-dev
//npm install --save-dev prettier
//npx prettier --write src/index.ts
//npm install --save-dev eslint-config-prettier



const app: Application = express()


//parsers
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(cors({origin:['http://localhost:5173']}));


//application router

app.use('/api/v1', router);


const test = async(req: Request, res: Response) => {
  res.send("Hello developer")
  //Promise.reject()
}

app.get('/', test)

app.use(globallyErrorHandler)
app.use(notFound)






export default app
