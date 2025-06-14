const express = require("express");
const express_EJS_Layout = require("express-ejs-layouts");
const cookieParser = require('cookie-parser');
const router_Home = require("./routes/home_router");
const router_Login = require("./routes/login_router");
const router_Aluno = require("./routes/aluno_router");
const router_Admin = require("./routes/admin_router");
const router_Professor = require("./routes/professor_router");
const router_Ano_Letivo = require("./routes/ano_letivo_router");
const router_Disciplina = require("./routes/disciplina_router");
const router_Serie = require("./routes/serie_router");
const router_Atividade = require("./routes/atividade_router");
const router_Turma = require("./routes/turma_router");
const router_Sala = require("./routes/sala_router");
const router_Grade = require("./routes/grade_router");
const router_perfil = require("./routes/perfil_router");
const router_Disciplina_Serie = require("./routes/disciplina_serie_router");
const router_Quadro_Notas = require("./routes/quadro_notas_router");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express_EJS_Layout);
app.set("layout", "./layout_home_view.ejs");

app.use("/",router_Home);
app.use("/login",router_Login);
app.use("/aluno",router_Aluno);
app.use("/admin",router_Admin);
app.use("/professor",router_Professor);
app.use("/ano_letivo",router_Ano_Letivo);
app.use("/disciplina",router_Disciplina);
app.use("/serie",router_Serie);
app.use("/atividade",router_Atividade);
app.use("/turma",router_Turma);
app.use("/sala",router_Sala);
app.use("/grade",router_Grade);
app.use("/perfil", router_perfil);
app.use("/disciplina_serie", router_Disciplina_Serie);
app.use("/quadro_notas", router_Quadro_Notas);


app.listen(5000, ()=>{
    console.log("sistema em execução no localhost:5000");
})