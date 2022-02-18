const express = require('express')
const sql = require('./db.js')
const bcrypt = require('bcrypt')
const cors = require('cors')
const app = express()
const morgan = require('morgan');             // log requests to the console (express4)
const bodyParser = require('body-parser');    // pull information from HTML POST (express4)
const methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
const port = 3000
const corsOptions = {
    origin: ["http://localhost:3000","http://localhost:8080"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
}
app.use(cors(corsOptions))
app.options('*', cors())

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));         // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

app.post('/api/login', async (req, res) => {
    const username = parseInt(req.body.username);
    const password = req.body.password;
    const hashedPassword = await sql`select password from public.hr_guys where identifier = ${username};`;
    if(hashedPassword.count == 0){
        res.type("json");
        res.status(200);
        res.send({ success: false ,
        message: 'User not found!'});
    }
    else {
        bcrypt.compare(password, hashedPassword[0].password)
        .then(result => {
            res.type("json");
            res.status(200);
            res.send({ success: result ,
            message: result?'Logged in!':'Password incorrect!'});
        });
    }
});

app.post('/api/getInvitations', async (req, res) => {
    const id = parseInt(req.body.id);
    const result = await sql`select * from public.candidate where hr_guy_id = ${id};`;
    res.type("text");
    res.status(200);
    res.send({ success: true ,
        message: result.count })
});


app.post('/api/createUser', async (req, res) => {
    const username = parseInt(req.body.username);
    let password = req.body.password;
    const admin = parseInt(req.body.admin);

    // Check first if id exists
    const exists = await sql`
    select 
        count(*) > 0 as existing
    from public.hr_guys
    where 
        identifier = ${ username }
        `
    if(exists[0].existing){
        res.status(200)
        res.send({ success: false,
                message: 'ID already exists'})
        return;
    }
    password = await bcrypt.hash(password, 10)
    .then(hash => {
        return hash;
    });
    const user = {
        identifier: username,
        name: 'name',
        first_name: 'first_name',
        email_address: 'email@example.com',
        company: 'company',
        password: password,
        quota_left: 10,
        admin_id: admin,
        request_open: false
        }
    try{
        const result = await sql`
            insert into public.hr_guys ${
              sql(user, 'identifier', 'name', 'first_name', 'email_address', 'company', 'password', 'quota_left', 'admin_id', 'request_open')
            }
            `;
            res.status(200);
            res.send({ success: true,
                message: 'HR Guy created!'})
        }
    catch(e) {
        console.log(e);
        res.status(200);
        res.send({ success: false,
            message: 'Unknown error'})
    }
});

app.post('/api/getHrGuys', async (req, res) => {
    let id = parseInt(req.body.admin_id);
    try{
        const users = await sql`
        select * from hr_guys where admin_id = ${id};`
        res.status(200);
        res.send(users)
    }
    catch(e){
        console.log(e);
        res.status(200);
        res.send('Unknown error');
    }
});

app.post('/api/showQuotaRequests', async (req, res) => {
    let id = parseInt(req.body.admin_id);
    try{
        const users = await sql`
        select * from hr_guys where admin_id = ${id} and request_open;`
        res.status(200);
        res.send(users)
    }
    catch(e){
        console.log(e);
        res.status(200);
        res.send('Unknown error');
    }
});

app.post('/api/getPersonalData', async (req, res) => {
    let id = parseInt(req.body.id);
    try{
        const data = await sql`
        select name, first_name, company, email_address, quota_left, request_open from hr_guys where identifier = ${id};`
        if(data[0]){
            found = data[0]
        }
        else {
            found = "Not found"
        }
        res.status(200);
        res.send(found)
    }
    catch(e){
        console.log(e);
        res.status(200);
        res.send('Unknown error');
    }
});

app.post('/api/getSurvey', async (req, res) => {
    const id = parseInt(req.body.id);
    try{
        const data = await sql`
        select * from candidate where id = ${id};`
        res.status(200);
        res.send(data[0])
    }
    catch(e){
        console.log(e);
        res.status(200);
        res.send('Unknown error');
    }
});

app.post('/api/getTeamMembers', async (req, res) => {
    const hr_guy_id = parseInt(req.body.hr_guy_id)
    const team_id = parseInt(req.body.team_id)
    try{
        const data = await sql`
        select id, name, first_name, email_address, filled::text from candidate where hr_guy_id = ${hr_guy_id} and team_id = ${team_id};`
        res.status(200);
        res.send(data)
    }
    catch(e){
        console.log(e);
        res.status(200);
        res.send('Unknown error');
    }
});

app.post('/api/getTeamStats', async (req, res) => {
    const hr_guy_id = parseInt(req.body.hr_guy_id)
    const team_id = parseInt(req.body.team_id)
    const metric = req.body.metric
    try{
        const data = await sql`
        select ${sql(metric)}::text, count(*) as cnt from candidate where hr_guy_id = ${hr_guy_id} and team_id = ${team_id} and ${sql(metric)}::text is not null
        group by 1;`
        res.status(200);
        res.send(data)
    }
    catch(e){
        console.log(e);
        res.status(200);
        res.send('Unknown error');
    }
});

app.post('/api/getTeams', async (req, res) => {
    let id = parseInt(req.body.id);
    try{
        const data = await sql`
        select teams.id, teams.name, count(distinct(candidate.id)) as team_size from teams 
        left join candidate on teams.id = candidate.team_id and teams.hr_guy_id = candidate.hr_guy_id where teams.hr_guy_id = ${id}
        group by 1,2;`
        res.status(200);
        res.send(data)
    }
    catch(e){
        console.log(e);
        res.status(200);
        res.send('Unknown error');
    }
});

app.post('/api/updatePersonalData', async (req, res) => {
    try{
        const user = req.body
        sql`
            update public.hr_guys set ${
              sql(user,'name','first_name','company','email_address')
            } where 
              identifier = ${ user.identifier }
        `
        res.status(200);
        res.send({ success: true,
            message: 'Updated!'})
    }
    catch(e){
        console.log(e);
        res.status(200);
        res.send({ success: false,
            message: 'Unknown error'})
    }
});

app.post('/api/sendSurvey', async (req, res) => {
    try{
        const survey = req.body
        sql`
            update public.candidate set ${
              sql(survey,'age','sex','married','siblings','children','experience','filled')
            } where 
              id = ${ survey.id }
        `
        res.status(200);
        res.send({ success: true,
            message: 'Updated!'})
    }
    catch(e){
        console.log(e);
        res.status(200);
        res.send({ success: false,
            message: 'Unknown error'})
    }
});

app.post('/api/sendInvite', async (req, res) => {
    try{
        let teamId = undefined
        const team = req.body.team
        const hr_guy_id = req.body.hr_guy_id
        // Does the team already exist?
        const teamFound = await sql`
        select 
            id
        from public.teams
        where 
            hr_guy_id = ${ hr_guy_id }
            and name = ${ team }
            `
        if (teamFound.count == 0){
            const teamObject = {
                hr_guy_id: hr_guy_id,
                name: team
            }
            // Create a team
            const teamInserted = await sql`
            insert into public.teams ${
              sql(teamObject, 'hr_guy_id', 'name')
            }
            `;

            const teamFoundSecond = await sql`
            select 
                id
            from public.teams
            where 
                hr_guy_id = ${ hr_guy_id }
                and name = ${ team }
                `
            teamId = teamFoundSecond[0].id
        }
        else {
            teamId = teamFound[0].id
        }

        // Insert into the candidate DB
        let candidateObject = req.body
        candidateObject.team_id = teamId
        const result = await sql` 
            insert into public.candidate ${
              sql(candidateObject, 'name', 'first_name', 'email_address', 'team_id', 'hr_guy_id')
            }
            `;
        console.log('Candidate result: ',result);

        // Deduct a quota
        quotaObject = { quota_left: req.body.quota_left - 1 }
        sql`
        update public.hr_guys set ${
          sql(quotaObject, 'quota_left')
        } where 
          identifier = ${ hr_guy_id }
        `
        res.status(200);
        res.send({ success: true,
            message: 'Sent!'})
    }
    catch(e){
        console.log(e);
        res.status(200);
        res.send({ success: false,
            message: 'Unknown error'})
    }
});

app.post('/api/denyQuotaRequest', async (req, res) => {
    let id = parseInt(req.body.hr_guy_id);
    try{
        const user = {
            id: id,
            request_open: false
        }  
        sql`
            update public.hr_guys set ${
              sql(user, 'request_open')
            } where 
              identifier = ${ user.id }
        `
        res.status(200);
        res.send({ success: true,
            message: 'Denied!'})
    }
    catch(e){
        console.log(e);
        res.status(200);
        res.send({ success: false,
            message: 'Unknown error'})
    }
});

app.post('/api/sendQuotaRequest', async (req, res) => {
    let id = parseInt(req.body.hr_guy_id);
    try{
        const user = {
            id: id,
            request_open: true
        }  
        sql`
            update public.hr_guys set ${
              sql(user, 'request_open')
            } where 
              identifier = ${ user.id }
        `
        res.status(200);
        res.send({ success: true,
            message: 'Sent!'})
    }
    catch(e){
        console.log(e);
        res.status(200);
        res.send({ success: false,
            message: 'Unknown error'})
    }
});

app.post('/api/acceptQuotaRequest', async (req, res) => {
    let id = parseInt(req.body.hr_guy_id);
    let quota = parseInt(req.body.quota)
    try{
        const user = {
            id: id,
            request_open: false,
            quota_left: quota + 10
        }  
        sql`
            update public.hr_guys set ${
              sql(user, 'request_open', 'quota_left')
            } where 
              identifier = ${ user.id }
        `
        res.status(200);
        res.send({ success: true,
            message: 'Accepted!'})
    }
    catch(e){
        console.log(e);
        res.status(200);
        res.send({ success: false,
            message: 'Unknown error'})
    }
});
  
  