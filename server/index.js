
// CONNECT TO THE DATABASE
const { 
  client, 
  createTables,
  createUser,
  fetchUsers,
  createSkill,
  fetchSkills,
  createUserSkill,
  fetchUserSkills,
  destroyUserSkill
} = require('./db');

// BUILDING BRIDGE TO FRONTEND

// AFTER DATA LAYER IS COMPLETE, CREATE A EXPRESS SERVER 
// npm install and import express 
  // npm i express 
const express = require('express');
const app = express();


// CRUD FUNCTIONS GO HERE - this is completed after data layer //

// CREATE GET SKILLS FUNCTION 
  //  ue .get to fetch skills 
app.get('/api/skills', async(req, res, next) => {
  try {
    res.send(await fetchSkills());
  }
  catch (ex){
    next(ex)
  }
  // curl test this function (console.log) at (*line 33*)
});

// CREATE GET USERS FUNCTION 
  // use .get to fetch users
app.get('/app/users', async(req, res, next) => {
  try {
    res.send(await fetchUsers());
  }
  catch (ex){
    next(ex)
  }
  // curl test this function (console.log) at (*line 34*)
});





// CONSOLE LOG AWAITING ITEMS TO ENSURE IT IS CONNECTING PROPERLY - remove later 
const init = async()=> {
  console.log('connecting to database');
  
  await client.connect();
  console.log('connected to database');
  
  await createTables();
  console.log('tables created');
  
  // createUser Data (seed)
  const [moe, lucy, cam, jumping, spinning, splitting] = await Promise.all([
    createUser({ username: 'sam', password: '123'}),
    createUser({ username: 'pam', password: '321'}),
    createUser({ username: 'cam', password: '456'}),

    createSkill({ name: 'jumping'}),
    createSkill({ name: 'spinning'}),
    createSkill({ name: 'splitting'}),
  ]);
  console.log(await fetchUsers());
  console.log(await fetchSkills());

  // CREATE USER SKILL FOR CAM (test)
  const [camSplits, camSpins] = await Promise.all([
    createUserSkill({ user_id: cam.id, skill_id: splitting.id}),
    createUserSkill({ user_id: cam.id, skill_id: spinning.id}),
  ]);
  console.log(await fetchUserSkills(cam.id))

   // DESTROY USER SKILL FOR CAM (test)
  await destroyUserSkill(camSpins);
  console.log(await fetchUserSkills(cam.id));

  // ANOTHER DESTROY EXAMPLE WOULD BE: 
  // await destroyUserSkill(camSplits);
  // console.log(await fetchUserSkills(cam.id));

  // set up listening port 
const port = process.env.PORT || 3000;
app.listen(port, ()=> {
  console.log(`listening on port ${port}`);
  console.log(`curl localhost:${port}/api/skills`);
  console.log(`curl localhost:${port}/api/users`)
});
   
};

init();