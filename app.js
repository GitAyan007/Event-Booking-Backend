const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql')
const { connectDB } = require('./utils/feature.js')
const dotenv = require('dotenv')

const graphQLSchemas = require('./graphql/schema/index.js')
const graphQLResolvers = require('./graphql/resolver/index.js');
const isAuth = require('./middleware/is-auth.js');

dotenv.config({
    path: "./.env",
});


const app = express();




// middleware ------------------->
app.use(bodyParser.json());

app.use((req, res, next) => {
    // this ensures every host/client can send a request to this server
    res.setHeader('Access-Control-Allow-Origin', '*');

    //  granting access to evry client location/domain, and controls which kind of request can be sent  
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')

    // controls which kind of headers can be set for the request before sending it to the server
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // to handle options request
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
})


// authentication check
app.use(isAuth);




// graphql middleware -------------->
app.use('/graphql', graphqlHTTP({
    // here i will tell where the schema is and in the rootValue where the resolver is 
    schema: graphQLSchemas,
    // it points to the object which has all the resolver functions in it
    rootValue: graphQLResolvers,
    graphiql: true,
}));




// database connection ---------------------->
const uri = process.env.MONGO_URI;
const PORT = process.env.PORT 
connectDB(uri);

// server listening
app.listen(PORT, (req, res) => {
    console.log("Server listening on 8000");
})
