const express = require('express');

const app = express();

const helmet = require('helmet');

const cors = require('cors');

const {Pool} = require('pg');

app.use(helmet());

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

const user = 'admingis';
const password = 'admingis';
const host = 'localhost';
const port = 5432;
const database = 'tpigis';

app.post('/intersect', async (req, res) => {
    const { layers, coords } = req.body;
    const layersNames = [] = layers.map((layer) => layer.sourceName);
    let wkt = ''
    if (coords.length == 2) {
        //es un punto [lon,lat]
        wkt = 'POINT(' + coords[0] + ' ' + coords[1] + ')';
    } else {
        //es un poligono en la forma [ [ [lon,lat],[lon,lat],....] ]
        wkt = 'POLYGON((';
        for (var i = 0; i < coords[0].length - 1; i++) {
            wkt += coords[0][i][0] + ' ' + coords[0][i][1] + ',';
        }
        wkt += coords[0][0][0] + ' ' + coords[0][0][1] + '))'
    }
    const initialQuery = layersNames.reduce((acc, layer) => acc + layer, 'SELECT * FROM')
    const query = 'SELECT ST_AsGeoJSON(ST_AsText(geometry)) as features FROM ' + '"Provincias"' + ' WHERE ST_Intersects(ST_GeomFromText(\'' + wkt + '\', 4326), geometry)';
    console.log(query);
    const pg = new Pool({ 
        user
        , host
        , database
        , password
        , port
    }).query(query, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send(err
            );
        }
        const geometry = JSON.parse(results.rows[0].features)
        res.status(200).send({type: 'FeatureCollection', features: [{type: 'Feature',geometry}]});
    });

});

module.exports = app;