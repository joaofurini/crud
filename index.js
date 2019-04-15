const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
var cors = require('cors')
const mongoose = require('mongoose')
const Data = require('./data')

const API_PORT = 3001;
const app = express()
app.use(cors())
const router = express.Router()

//Instanciando a URL do nosso bancode dados, Isso deve ser feito em uma pagina separa por questoes de segurança
const dbRoute = "mongodb+srv://furini:furini76@clustercrud-nkeey.mongodb.net/test?retryWrites=true"

mongoose.connect(dbRoute, {useNewUrlParser: true})

let db = mongoose.connection;

db.once('open', ()=> console.log("Connected to the Database"))
db.on('error', ()=> console.error.bind(console, "MongoDB conection error"))

//Transforma o body da pagina em json
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(logger("dev"))

//Esse metodo retorna todos os dados do nosso banco de dados quando a rota for requisitada
router.get("/getData", (req, res)=>{
    Data.find((err, data)=>{
        if(err) return res.json({succes: false, error: err})
        return res.json({succes: true, data: data})
    })
})

//Esse é o metodo que atualiza os dados do nosso banco de dados
router.post("/updateData", (req, res)=>{
    const {id, update} = req.body
    Data.findOneAndUpdate(id, update, err =>{
        if(err) return res.json({succes: false, error: err})
        return res.json({succes: true})
    })
})

//Esse é o metodo que deleta os dados do banco de dados
router.delete("/deleteData", (req, res)=>{
    const {id} = req.body
    Data.findOneAndDelete(id, err =>{
        if(err) return res.json({succes:false, error:err})
        return res.json({succes:true})
    })
})

//Esse metodo adiciona coisas no nosso banco de dados 
router.post('/putData', (req, res)=>{
    let data = new Data();
    const {id, message} = req.body

    if((!id && id!==0) || !message){
        return res.json({succes: false, error: "INVALID INPUTS"})
    }

    data.message = message
    data.id = id
    data.save(err =>{
        if(err) return res.json({succes: false, error: err})
        return res.json({succes: true})
    })
})

app.use('/api', router)

app.listen(API_PORT, ()=> console.log(`Listening on port ${API_PORT}`))