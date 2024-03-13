
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
   
};

init();