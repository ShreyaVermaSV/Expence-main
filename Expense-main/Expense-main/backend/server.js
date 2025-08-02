import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import pg from 'pg';
import bcrypt from 'bcryptjs';
// import auth from './middleware/auth.js';
import cron from 'node-cron';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
     
});
const Port = process.env.PORT || 3001;
const jwtKey = process.env.JWT_SECRET_KEY;
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:3000', // Specify the frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable cookies to be sent across domains
    optionsSuccessStatus: 204,
  };
  
  app.use(cors(corsOptions)); // Use the cors middleware with options
  app.use(bodyParser.json());


  const addDefaultCategories = async (userId) => {
    const defaultCategories = [
        { category: 'Food'},
        { category: 'Groceries'},
        { category: 'Rent'},
        { category: 'EMI'},
    ];

    const queries = defaultCategories.map(item => {
        return pool.query('INSERT INTO categories (user_id, category) VALUES ($1, $2)', [userId, item.category]);
    });

    await Promise.all(queries);
};

const calculateRemainingBudget = async () => {
    const client = await pool.connect();
    try{
        const now = new Date();
        const prevMonth = now.getMonth()==0?11:now.getMonth();
        const year = now.getMonth() == 0? now.getFullYear()-1:now.getFullYear();
        
        // console.log('prevmonth and year', prevMonth, year);
        const userIds = await client.query('SELECT id FROM users');
        // console.log(userIds.rows);
        for(let i in userIds.rows){
            const userId = userIds.rows[i].id 
            // console.log(userIds.rows[i].id)
            const resIncome = await client.query('SELECT income from income where user_id=$1', [userId]);
            const income = resIncome.rows.length>0?resIncome.rows[0].income:0;
            // console.log("income",income);
            const resTotalExpense = await client.query('SELECT SUM(amount) from transactions where user_id=$1 and EXTRACT(MONTH FROM transaction_date)=$2 and EXTRACT(YEAR FROM transaction_date)=$3', [userId, prevMonth, year]);
            const totalExpense = resTotalExpense.rows[0].sum?resTotalExpense.rows[0].sum:0;
            // console.log("expense",totalExpense);
            const resBudget = await client.query('SELECT monthly_budget from monthly_budget where user_id=$1 and month=$2 and year=$3', [userId, prevMonth, year]);
            const budget = resBudget.rows.length>0?resBudget.rows[0].monthly_budget:0;
            // console.log("budget",budget);
            if(!income){
                continue;
            }
            if(!totalExpense) continue;
            let remainingBudget = parseInt(income) - parseInt(totalExpense);
            // console.log(remainingBudget)
            if(remainingBudget < 0 || !remainingBudget){
                remainingBudget = 0;
            }
            const addBudget = await client.query('Update monthly_budget set remaining_budget=$1 where user_id=$2 and month=$3 and year=$4', [remainingBudget, userId, prevMonth, year]);
            // console.log("remaining budget",addBudget.rows);
        }
    }catch(err){
        console.log('Error calculating remaining budget', err);
    }finally{
        client.release();
    }
}

// 0thhr 0thmin 1stday *everymonth *eveyweek
cron.schedule('0 0 1 * *', () => {
    console.log('Running scheduled task to calculate remaining budget...');
    calculateRemainingBudget();
});



app.post("/signup", async (req, res) => {
    const userData = req.body;
    if (!(userData.name&&userData.username&&userData.email&&userData.password)){
        return res.status(400).send("All data fields are compulsory");
    } 

    const encryptedpassword = await bcrypt.hash(userData.password, 10);

    const client = await pool.connect(); 
    const existingUser = await client.query(`SELECT email from users where email=$1`, [userData.email]); 
    if(existingUser.rows.length > 0){
        client.release();
        console.log("User already exists");
        return res.status(400).send("User already exists"); 
    }
    // console.log("Checking arror",userData);
    try {
        const query = `INSERT INTO users (name, username, email, hashedpassword) 
               VALUES ($1, $2, $3, $4) 
               RETURNING *;`;
        const values = [userData.name, userData.username, userData.email, encryptedpassword];
        const result = await client.query(query, values);
        const userId = result.rows[0].id;
        // console.log("Default categories",userId);
        await addDefaultCategories(userId);
        client.release();

        // console.log(result.rows[0], "Data added to database successfully");
        delete userData.password;

        res.status(201).send({ message: "User created successfully", userData: userData});
       
    } catch (err) {
        console.log("Error adding to the database", err);
        res.status(500).send("Error adding to the database");
    }
})


app.post('/login', async (req, res) => {
    await calculateRemainingBudget();
    const { email, password } = req.body;
    if(!(email && password)){
        return res.status(400).send('All data fields are compulsory');
    }
    const client = await pool.connect();
    try{
        const result = await client.query(`SELECT * from users where email=$1`,[email]);
        if(result.rows.length === 0){
            return res.status(401).send('Invalid email or password');
        }
        const loginUser = result.rows[0];
        const isValidPass = await bcrypt.compare(password, loginUser.hashedpassword);
        if(!(email && isValidPass)){
            res.status(401).send("Invali email or password");
        }
        const token = Jwt.sign({
            email: loginUser.email,
            id: loginUser.id,
            username: loginUser.username,
            name: loginUser.name,    
            },
            jwtKey,
            {
                expiresIn: "1h"
            });
       
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
        });
        delete loginUser.hashedpassword;
        loginUser.token = token;
        // console.log("Token set in cookie", token);
        res.status(200).send({ message: "Login Successful", loginUser });

    }catch(err){
        console.log("Error while logging in", err);
    }finally{
        client.release();
    }
})


app.post('/spending', async (req, res) => {
    const expenseData = req.body;

    if(!expenseData){
        return res.status(400).send("Expense data not found");
    } 

    const client = await pool.connect();
    try{
        const query = `INSERT INTO transactions (user_id, amount, category, transaction_date, description) 
               VALUES ($1, $2, $3, $4, $5) 
               RETURNING *;`;
        const values = [expenseData.id ,expenseData.cost, expenseData.category, expenseData.date, expenseData.description];
        const result = await client.query(query, values);
        // console.log(result.rows[0], "Data added to database successfully");
        res.status(201).send({ message: "Expense added successfully", expenseData: expenseData});
    }catch(err){
        console.log("Error adding to the database", err);
    }finally{
        client.release();
    
    }
});


app.post('/income', async(req, res) => {
    const val = req.body;
    // console.log("income", val);
    const client = await pool.connect();
    try{
        const query = `INSERT INTO income(user_id, income)
        VALUES ($1, $2)
        RETURNING *;`;
    const values = [val.userId, val.income];
    const result = await client.query(query, values);
    // console.log(result.rows[0], "income sent succesfully");
    res.status(201).send({message: "Income added succesfully", income: val})

    }catch(err){
        console.log('Error addingg income');
    }finally{
        client.release();
    }
})

app.post('/budgets', async (req, res) => {
    const val = req.body;
    const client = await pool.connect();
    try{
        const query = `INSERT INTO budgets(user_id, category_id, month, year,amount)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`;
    const values = [val.id, val.category_id, val.month, val.year, val.amount];
    const result = await client.query(query, values);
    res.status(201).send({message: "Budget added successfully", budget: val});
    }catch(err){
        console.log("Error adding budget");
    }finally{
        client.release();
    }
})

app.post('/monthly_budget', async (req, res) => {
    const val = req.body;
    // console.log("monthlyubudget", val);
    const client = await pool.connect();
    try{
        const query = `INSERT INTO monthly_budget(user_id, income_id, month, year, monthly_budget)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`;
        const values = [val.id, val.income_id, val.month, val.year, val.monthlyBudget];
        const result = await client.query(query, values);
        // console.log(result.rows[0], "Monthly budget added successfully")
        res.status(201).send({message: "Monthly budget added successfully", monthlyBudget: val});

    }catch(err){
        console.log('Error adding monthly budget');
    }finally{
        client.release();
     
    }
})


app.post('/categories', async (req, res) => {
    const val = req.body;
    const client = await pool.connect();

    const existingCategory = await client.query(`SELECT category from categories where category=$1 and user_id=$2`, [val.category, val.id]); 
    if(existingCategory.rows.length > 0){
        client.release();
        console.log("Category already exists");
        return res.status(400).send("Category already exists"); 
    }

    try{
        const query = `INSERT INTO categories(user_id, category)
        VALUES ($1, $2)
        RETURNING *;`;
    const values = [val.id, val.category];
    const result = await client.query(query, values);
    // console.log(result.rows[0]);
    
    }catch(err){
        console.log('Error adding category');
    }finally{
        client.release();
    }
})

app.get('/categories', async (req, res) => {
    const client = await pool.connect();

    try{
        const result = await client.query(`SELECT * FROM categories where user_id=$1`, [req.query.id]);
        return res.send(result);
    }catch(err){
        console.log('Something went wrong');
    }finally{
        client.release();
    }
})


app.get('/spending', async (req, res) => {
    // console.log("send response",req.query.id)

    const client = await pool.connect();
    try{
        const result = await client.query(`SELECT * FROM transactions where user_id=$1`,[req.query.id]);
        // console.log("Data I got",result);
        return res.send(result);
    
    }catch(err){
           console.log('Something went wrong',err);  
    }finally{
        client.release();
    }
})



app.get('/monthly_budget', async (req, res) => {
    // console.log("montly budget",req.query.id)
    const client = await pool.connect();

    try{
        const result = await client.query(`SELECT * FROM monthly_budget where user_id=$1 and (month=$2 or month=$4) and year=$3`, [req.query.id, req.query.month, req.query.year, req.query.prevMonth]);
        console.log(result);
        return res.send(result);
    }catch(err){
        console.log('Something went wrong fetching monthly budget');
    }finally{
        client.release();
    }

});


app.get('/income', async (req, res) => {
    const client = await pool.connect();
    
    // console.log("Im in income",req.query.id);
    try{
        const result = await client.query(`SELECT * FROM income where user_id=$1`, [req.query.id]);
        // console.log('Income fetched', result)
        return res.send(result.rows[0]);
    }catch(err){
        console.log('Something went wrong fetching income');
    }finally{
        client.release();
    }
})

app.get('/budgets', async (req, res) => {
    const client = await pool.connect();
    // console.log("id here",req.query.id)

    try{
        const result = await client.query(`SELECT * FROM budgets where user_id=$1`, [req.query.id]);
        // console.log('hahahahah', result.rows)
        return res.send(result.rows);
    }catch(err){
        console.log('Somthing went wrong in fetching budget');
    }finally{
        client.release();
    }

})




app.get('/login', (req, res) => {
    res.send('Hello from server');
    // console.log(req);
})
app.get('/dashboard', async (req, res) => {
    // console.log("TEMP",req.user);
    // console.log("send response",req.query.id)

    const client = await pool.connect();
    try{
        const result = await client.query(`SELECT * FROM transactions where user_id=$1`,[req.query.id]);
        // console.log("Data I got for dashboard",result);
    
        return res.send(result);
    
    }catch(err){
           console.log('Something went wrong',err);  
    }finally{
        client.release();
    }
})

app.get('/user', async (req, res) => {
    // console.log("TEMP",req.query.id);   
    const client = await pool.connect();
    try{
        const result = await client.query(`SELECT * FROM users where id=$1`, [req.query.id]);
        delete result.rows[0].hashedpassword;
        console.log(result.rows[0]);

        return res.send(result.rows[0]);
    }catch(err){
        console.log('Error fetching user data');
    }finally{
        client.release();
    }
})


app.patch('/spending', async (req, res) => {
    // console.log('dont what is error');
    const entry = req.body
    const client = await pool.connect();
    try{
        const result = await client.query(`UPDATE transactions 
        SET amount=$1,
        category=$2,
        transaction_date=$3,
        description=$4
        where id=$5`, [entry.amount, entry.category, entry.date, entry.description, entry.id]);
        return res.status(200).send(result);
    }catch(err){
        console.log('Error updating entry', err);
    }finally{
        client.release();
    }
})

app.patch('/income',async (req, res) => {
    const val = req.body;
    // console.log("income", val);
    const client = await pool.connect();
    try{
    const result = await client.query('UPDATE income SET income=$1 WHERE user_id=$2', [val.income, val.userId]);
    // console.log(result.rows[0], "income sent succesfully");
    res.status(201).send({message: "Income updated succesfully", income: val})

    }catch(err){
        console.log('Error addingg income');
    }finally{
        client.release();
    }
})

app.patch('/budget', async (req, res) => {
    const val = req.body;
    console.log(val);
    const client = await pool.connect();
    try{
        const result = await client.query('UPDATE budgets SET amount=$1, category_id=$2 WHERE id=$3 and user_id=$4', [val.amount, val.category_id, val.budget_id, val.user_id]);
        return res.status(200).send('Budget updated successfully');
    }catch(err){
        console.log('Error updating budget');
    }finally{
        client.release();
    }
})

app.patch('/user', async (req, res) => {
    const user = req.body;
    // console.log(user.id)
    const client = await pool.connect();

    try {
        const userData = await client.query('SELECT * FROM users WHERE id=$1', [user.id]);
        const currentUserData = userData.rows[0];
        // console.log(currentUserData)
        let result;
        // console.log(user.oldPassword,user.newPassword,user.confirmPassword)
        if(user.oldPassword&&user.newPassword&&user.confirmPassword){
            console.log('haa',currentUserData.hashedpassword, user.oldPassword);
            const isValidPass = await bcrypt.compare(user.oldPassword, currentUserData.hashedpassword);
            // console.log(isValidPass);
            if(!isValidPass){
                return res.status(401).send('Old password does not match');
            }
            const encryptedpassword = await bcrypt.hash(user.newPassword, 10);
            result = await client.query(
                'UPDATE users SET hashedpassword=$1 WHERE id=$2',
                [encryptedpassword, user.id]
            );
        }
        else if (user.email) {
            result = await client.query(
                'UPDATE users SET email=$1 WHERE id=$2',
                [user.email, user.userId]
            );
        } else if (user.name) {
            result = await client.query(
                'UPDATE users SET name=$1 WHERE id=$2',
                [user.name, user.userId]
            );
        } else if (user.username) {
            result = await client.query(
                'UPDATE users SET username=$1 WHERE id=$2',
                [user.username, user.userId]
            );
        }
    
        res.status(200).send({ result });
    } catch (err) {
        console.log('Error updating entry', err);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
});



app.delete('/spending', async (req, res) => {
    const id = req.body.id;
    // console.log('adsfgh',id);
    const client = await pool.connect();
    try{
        await client.query(`DELETE FROM transactions where id=$1`, [id]);
        return res.status(200).send('Entry deleted successfully');
    }catch(err){
        console.log('Error deleting entry');
    }finally{
        client.release();
    }
})


app.delete('/budget', async (req, res) => {
    const id = req.body;
    // console.log(id);
    const client = await pool.connect();
    try{
        await client.query(`DELETE FROM budgets where id=$1 and user_id=$2`, [id.budget_id, id.user_id]);
        return res.status(200).send('Budget deleted successfully');
    }catch(err){
        console.log('Error deleting budget');
    }finally{
        client.release();
    }
})



app.listen(Port, () => {
    console.log("Server connected to the port", Port);
});