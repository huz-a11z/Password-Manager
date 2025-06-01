import { MongoClient, ServerApiVersion } from "mongodb";

const ATLAS_URI='mongodb+srv://husainkc24:husi2001@projects.rk9hjgd.mongodb.net/?retryWrites=true&w=majority&appName=Projects'

const uri = ATLAS_URI || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log(
   "Pinged your deployment. You successfully connected to MongoDB!"
  );
} catch(err) {
  console.error(err);
}

let db = client.db("employees");

export default db;