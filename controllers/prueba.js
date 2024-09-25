const { response, request } = require('express')
const { Personas } = require('../models/personas');
const { bdmysql } = require('../database/MariaDbConnection');

const personasGet = async (req, res = response) => {


    const query = req.query;


    //Desestructuracion de argumentos
    const { q, nombre = 'No name', apikey, page = 1, limit = 10 } = req.query;




    //console.log("Datos",q,nombre);
    try {
        const unasPersonas = await Personas.findAll();
        res.json({
            ok: true,
            msg: 'get API - Controller Funciono',
            query,
            q,
            nombre,
            apikey,
            page,
            limit,
            data: unasPersonas
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error
        })


    }


}

const personaByIdGet = async (req = request, res = response) => {


    const { id } = req.params;
   //const { _id, password, google, correo, ...resto } = req.body;


    try {


        const unaPersona = await Personas.findByPk(id);


        if (!unaPersona) {
            return res.status(404).json({ok:false,
                msg: 'No existe una Persona con el id: ' + id
            })
        }


        res.json({
            ok:true,
            data:unaPersona});
   


    } catch (error) {
        console.log(error);
        res.status(500).json({ok:false,
            msg: 'Hable con el Administrador',
            err: error
        })


    }
}



const personasComoGet = async (req = request, res = response) => {
    const { termino } = req.params;

    try {
        // Ajuste aquí: Eliminamos el desestructurado y tomamos el arreglo completo
        const results = await bdmysql.query(
            "SELECT * FROM persona WHERE nombres LIKE :searchTerm OR apellidos LIKE :searchTerm ORDER BY nombres",
            {
                replacements: { searchTerm: `%${termino}%` },
                type: bdmysql.QueryTypes.SELECT
            }

            
        );

        res.json({
            ok: true,
            data: results
        });
    } catch (error) {
        console.error('Error al buscar personas:', error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
            err: error.message
        });
    }
};




module.exports = {
    personasGet,
    personaByIdGet,
    personasComoGet
}
