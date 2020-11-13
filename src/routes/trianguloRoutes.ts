import {Request, Response, Router } from 'express'
import { Triangulos } from '../model/triangulo'
import { db } from '../database/database'

class TrianguloRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getTriangulos = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query = await Triangulos.find()
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
            console.log(mensaje)
        })

        db.desconectarBD()
    }
  

    private nuevoTrianguloPost = async (req: Request, res: Response) => {
        console.log(req.body)
        // Observar la diferencia entre req.body (para POST) 
        // y req.params (para GET con los parámetros en la URL
        const { nombre, base, altura, lado1, lado2 } = req.body

        console.log(nombre)
        console.log(base)
        console.log(lado2)
        console.log(lado1)
        console.log(altura)


        const dSchema = {
            _nombre: nombre,
            _base: parseInt(base),
            _lado2: parseInt(lado1),
            _lado3: parseInt(lado2),
            _altura: parseInt(altura)
        }
        console.log(dSchema)
        const oSchema = new Triangulos(dSchema)
        await db.conectarBD()
        await oSchema.save()
        .then( (doc) => {
            console.log('Salvado Correctamente: '+ doc)
            res.json(doc)
        })
        .catch( (err: any) => {
            console.log('Error: '+ err)
            res.send('Error: '+ err)
        }) 
        // concatenando con cadena muestra sólo el mensaje
        await db.desconectarBD()
    }     

    private nuevoTrianguloGet = async (req: Request, res: Response) => {
        const { nombre, base, altura, lado1, lado2 } = req.params
        console.log(req.params)

        await db.conectarBD()
        const dSchema = {
            _nombre: nombre,
            _base: parseInt(base),
            _lado2: parseInt(lado1),
            _lado3: parseInt(lado2),
            _altura: parseInt(altura)
        }
        const oSchema = new Triangulos(dSchema)
        await oSchema.save()
        .then( (doc) => {
            console.log('Salvado Correctamente: '+ doc)
            res.json(doc)
        })
        .catch( (err: any) => {
            console.log('Error: '+ err)
            res.send('Error: '+ err)
        }) 
        // concatenando con cadena muestra sólo el mensaje
        await db.desconectarBD()
    }  

    misRutas(){
        this._router.get('/', this.getTriangulos)
        this._router.get('/nuevoG/:nombre&:base&:altura&:lado1&:lado2', this.nuevoTrianguloGet)
        this._router.post('/nuevoP', this.nuevoTrianguloPost)
    }
}

const obj = new TrianguloRoutes()
obj.misRutas()
export const trianguloRoutes = obj.router
