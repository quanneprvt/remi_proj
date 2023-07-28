import config from "config";
import app from "../app";
import connectDB from "../utils/connectDB";

const server = app.server;
const socket = app.socket;

beforeEach(async () => {
  const port = config.get<number>("port");
  server.listen(port, () => {
    console.log(`Server started on port: ${port}`);
    // 👇 call the connectDB function here
    connectDB();
  });
});

afterEach((done) => {
  async function closeServer() {
    await server.close(done);
    await socket.close();
    // setTimeout(() => {
    //   process.exit(1);
    // }, 1000);
    console.log("afterAll");
    done();
  }
  closeServer();
});
