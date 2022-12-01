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

app.post('/addMarker', async (req, res) => {
    console.log(req.body);
    const {name, description} = req.body.properties;
    const {coordinates} = req.body.geometry;
    const pool = new Pool({
        user: user,
        password: password,
        host: host,
        port: port,
        database: database
    });
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const queryText = 'INSERT INTO "Marcadores" ("Nombre", "Descripcion", geometry) VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)) RETURNING *';
        const values = [name, description, coordinates[0], coordinates[1]];
        const {rows} = await client
            .query(queryText, values);
        await client.query('COMMIT');
        res.status(201).send(rows[0]);
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
});

app.post('/removeMarkers', async (req, res) => {
    const { coords } = req.body;
    console.log(req.body)
    if (!coords) {
        res.status(400).send('Bad request');
    }
    let wkt = 'POLYGON((';
    for (var i = 0; i < coords[0].length - 1; i++) {
        wkt += coords[0][i][0] + ' ' + coords[0][i][1] + ',';
    }
    wkt += coords[0][0][0] + ' ' + coords[0][0][1] + '))'
    const pool = new Pool({
        user: user,
        password: password,
        host: host,
        port: port,
        database: database
    });
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const queryText = 'DELETE FROM "Marcadores" WHERE ST_Intersects(geometry, ST_GeomFromText($1, 4326))';
        const values = [wkt];
        const {rows} = await client
            .query(queryText, values);
        await client.query('COMMIT');
        res.status(201).send(rows[0]);
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
});
 

app.get('/markers', async (req, res) => {
    const pool = new Pool({
        user: user,
        password: password,
        host: host,
        port: port,
        database: database
        });
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const queryText = 'SELECT *, ST_AsGeoJSON("Marcadores".geometry) as features FROM "Marcadores"';
            const {rows} = await client
                .query(queryText);
            await client.query('COMMIT');
            const features = rows?.map((row) => {
                const { features, geometry, ...properties } = row;
                return {
                    type: 'Feature',
                    geometry: {
                ...JSON.parse(features),
                    },
                    properties
                };
            });
            console.log(features);
            res.status(200).send({type: 'FeatureCollection', features });
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    });

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
    if (layersNames.length>0){
    const pool = new Pool({ 
        user
        , host
        , database
        , password
        , port
    })
    const client = await pool.connect();
    let result = {}
    try {            
        await client.query('BEGIN');
        await Promise.all(layersNames.map(async (layer) => {    
            const initialQuery =  'SELECT *, ST_AsGeoJSON("'+ layer + '".geometry) as features FROM '+ '"'+ layer +'"';
            const query = initialQuery + ' WHERE ST_Intersects(ST_GeomFromText(\'' + wkt + '\', 4326), "' + layer+'".geometry)';
            console.log(query);
            const {rows} = await client.query(query);
            const features = rows?.map((row) => {
                const { features, geometry, ...properties } = row;
                return {
                    type: 'Feature',
                    geometry: {
                ...JSON.parse(features),
                    },
                    properties
                };
            });
            result = { 
                ...result,
                [layer]: 
                {type: 'FeatureCollection', features }
            };
        }));
        console.log(result);
        res.status(200).send(result);
    }
    catch (e) {
        await client.query('ROLLBACK');
        throw e;
    }
    finally {
        client.release();
    }
    } else {
        res.status(200).send({type: 'FeatureCollection', features: [] });
    }
});


module.exports = app;