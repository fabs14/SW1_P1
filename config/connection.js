import pg from "pg";
const { Pool } = pg;

const DATABASE_URL = "postgresql://postgres:XEtBXewtUqDcopCFOwqUiJYxTTMkYoSy@maglev.proxy.rlwy.net:49544/railway";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

export default pool;