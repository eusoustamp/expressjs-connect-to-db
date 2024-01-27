const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const dotenv = require('dotenv')
const cors = require('cors')
const { swaggerSpec, swaggerUi } = require('./swagger');

const app = express()
const PORT = 3000

app.use(bodyParser.json())
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

dotenv.config()
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

/**
 * @swagger
 *  /products/{id}:
 *    get:
 *      summary: Get a product by id
 *      description: Get a product by id
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: integer
 *          required: true
 *          description: Numeric ID of the product to get
 *      responses:
 *          200:
 *            description: A product object
 *            content:
 *             application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Product'
 *          404:
 *            description: The product was not found
 *          500:
 *            description: Some error happened
 * 
 * components:
 *  schemas:
 *    Product:
 *       type: object
 *       properties:
 *        id:
 *          type: integer         　   
 *        ProdName:
 *          type: string
 *        price:
 *       　  type: number　
 *               　  
 */


app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM Products'
    
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ message:'Error occured while fetching products', error:err})
        } else if (result.length ===0) {
            res.status(404).json({ message: 'Product not found'})
        } else {
             res.status(200).json({message: 'Product retrieved successfully.', data:result})
        }
    })
})
/**
 * @swagger
 * /products:
 *      get:
 *        summary: Get all products
 *        description: Get all products
 *        responses:
 *          200:
 *            description: A list of products
 *            content:
 *             application/json:
 *              schema:
 *               type: array
 *               items:
 *                
 *                 
 *          500:
 *            description: Some error happened
 */


app.get('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const sql = "SELECT  * FROM Products WHERE id = ?"
    db.query(sql, [id], (err, result) => {
        if(err) {
            res.status(500).json({message: 'Error occurred while retrieving product.', error: err})
        } else {
            if (result.length === 0) {
                res.status(404).json({ message: 'Product not found'})
            } else {
                res.status(200).json({message: 'Product retrieved successfully.', data:result})
            }
        }
    })
})

/**
 * @swagger
 * /products:
 *      post:
 *        summary: Post a product
 *        description: Post a product
 *        responses:
 *          201:
 *            description: Product created
 *            content:
 *             application/json:
 *              schema:
 *               type: array
 *               items: '#/components/schemas/Product'
 *                
 *                 
 *          500:
 *            description: Error occurred while inserting product
 */

app.post('/products', (req, res) => {
    const product = req.body;
    const sql = 'INSERT INTO Products (prodName, price, discount, review_count, img_url) VALUES (?,?,?,?,?)'
    db.query(sql, [product.name, product.price, product.discount, product.review_count, product.img_url], (err, result) => {
        if (err) {
            res.status(500).json({message: 'Error occurred while inserting product', error: err})
        } else {
            res.status(201).json({message: 'Product created successfully'})
        }
    })
})
/**
 * @swagger
 * /products:
 *      put:
 *        summary: Update a product
 *        description: Update a product
 *        responses:
 *          200:
 *            description: Product updated
 *            content:
 *             application/json:
 *              schema:
 *               type: array
 *               items:
 *                
 *                 
 *          500:
 *            description: Error occurred
 */

app.put('/products/:id', (req, res) => {
      const id = Number(req.params.id);
    const product = req.body;
    const sql = 'UPDATE Products SET ProdName = ?, price = ?, discount = ?, review_count = ?, img_url = ? WHERE id = ?';
    db.query(sql, [product.name, product.price, product.discount, product.review_count, product.image_url, id], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error occurred while updating product.', error: err });
        } else {
            res.status(200).json({ message: 'Product updated successfully.' });
        }
    });
})

/**
 * @swagger
 * /products:
 *      delete:
 *        summary: Delete a product
 *        description: Delete a product
 *        responses:
 *          200:
 *            description: Product deleted
 *            content:
 *             application/json:
 *              schema:
 *               type: array
 *               items:
 *                
 *                 
 *          500:
 *            description: Error occurred 
 */

app.delete('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const sql = 'DELETE FROM Products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error occurred while deleting product.', error: err });
        } else {
            res.status(200).json({ message: 'Product deleted successfully.' });
        }
    });
})

app.listen(PORT, () => {
    console.log('Server is up and running')
 })