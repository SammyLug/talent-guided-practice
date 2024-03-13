// (*line references are subject to change*)

// npm install and import pg 
  // terminal: npm install pg 
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/talent_db');

// npm install and import uuid 
  // terminal: npm i uuid
const uuid = require('uuid');

// AFTER DATA LAYER IS COMPLETE, WE NEED TO HASH THE PASSWORDS FOR SECURITY 
// npm install and import bcrypt 
  // terminal: npm i bcrypt
// add this to the createUser function to ensure the user will have a secure password (*line 59*)
const bcrypt = require ('bcrypt');
  

// CREATE TABLES AND EXPORT
const createTables = async() => {
  const SQL = `
  DROP TABLE IF EXISTS user_skills;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS skills;

  CREATE TABLE users(
    id UUID PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  );

  CREATE TABLE skills(
    id UUID PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
  );

  CREATE TABLE user_skills(
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    skill_id UUID REFERENCES skills(id) NOT NULL,
    CONSTRAINT user_skill_unique UNIQUE (user_id, skill_id)
  );

  `;
  await client.query(SQL);
};

// FUNCTIONS GO HERE //

// CREATE USER FUNCTION
  // pass in username and password
  // use INSERT INTO to join these parameters into users table 
const createUser = async({username, password}) => {
  const SQL =  `
  INSERT INTO users(id, username, password)
  VALUES($1, $2, $3)
  RETURNING *
  `;

  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash( password, 5)]);
  // since we added a hash to the password, we need to change the VARCHAR in the table from (20) to (255)
  return response.rows[0];
  // export at the bottom of db.js && import this function in index.js(*line 3*)
};


// FETCH USER FUNCTION
  // use SELECT * to get the users FROM the users table
const fetchUsers = async()=> {
  const SQL = `
  SELECT *
  FROM users
  `;
  const response = await client.query(SQL);
  return response.rows;
  // export at the bottom of db.js && import this function in index.js(*line 3*)
  };

// CREATE SKILL FUNCTION
  // pass in name 
  // use INSERT INTO to join these parameters into skills table
    // NOTE: the skills table only needs to take in the unique ID (uuid) and name)
const createSkill = async({ name }) => {
  const SQL = `
  INSERT INTO skills(id, name)
  VALUES($1, $2)
  RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name])
  return response.rows[0];
  // export at the bottom of db.js && import this function in index.js(*line 3*)
};


// FETCH SKILL FUNCTION
  // use SELECT * to get the skills FROM the skills table
const fetchSkills = async()=> {
  const SQL = `
  SELECT *
  FROM skills
  `;
  const response = await client.query(SQL);
  return response.rows;
  // export at the bottom of db.js && import this function in index.js(*line 3*)
};

// CREATE USERSKILL FUNCTION (each users special skill)
  // pass in user_id and skill_id
  // use INSERT INTO to join these parameters into the user_skills table 
const createUserSkill = async({ user_id, skill_id })=> {
  const SQL =`
  INSERT INTO user_skills(id, user_id, skill_id)
  VALUES($1, $2, $3)
  RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, skill_id])
  return response.rows[0];
  // export at the bottom of db.js && import this function in index.js(line 3)
  // add a constraint to user_skills table(line 29) so that user cannot have duplicate skills 
  };

// FETCH USERSKILL FUNCTION 
  // pass in user_id 
  // use SELECT * to get the skills FROM the user_skills table WHERE the user_id = $1
const fetchUserSkills = async(user_id) => {
  const SQL = `
  SELECT *
  FROM user_skills
  WHERE user_id = $1
  `;
  const response = await client.query(SQL, [ user_id ]);
  return response.rows;
  // export at the bottom of db.js && import this function in index.js(line 3)
  };

// CREATE DESTROY SKILL FUNCTION 
  // pass in user_id, id 
  // use DELETE FROM to remove skill from user_skills WHERE id = $1 AND user_id = $2
  const destroyUserSkill = async( {user_id, id}) => {
    const SQL = `
    DELETE FROM user_skills
    WHERE id = $1 AND user_id = $2
    RETURNING *
    `;
    const response = await client.query(SQL, [ id, user_id ]);
    console.log(response.rows);

    // ADD TO DISPLAY ERROR MESSAGE IF SOMEONE TRIES TO DELETE A SKILL THAT DOESNT EXIST 
    // if(!response.rows){
    //   const error = Error('no user skill found');
    //   error.status = 500;
    //   throw error;
    // }
  }

module.exports = {
  client, 
  createTables,
  createUser,
  fetchUsers,
  createSkill,
  fetchSkills,
  createUserSkill,
  fetchUserSkills,
  destroyUserSkill
};