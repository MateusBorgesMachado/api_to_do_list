
import express from 'express'
import { envs } from './envs'
import { usuarioRoutes } from "./routes/usuario.routes";
import { authRoutes } from "./routes/auth.routes";

import { Router } from 'express';
import { tarefaRoutes } from './routes';

const app = express();

const route = Router()

app.use(express.json())

app.use('/usuarios', usuarioRoutes);
app.use('/auth', authRoutes);
app.use('/tarefas', tarefaRoutes)

app.use(route)


app.listen(envs.PORT, () => console.log(`Servidor rodando na porta ${envs.PORT}`))