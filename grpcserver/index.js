const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'adder.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const adder_proto = grpc.loadPackageDefinition(packageDefinition).adder;

const server = new grpc.Server();

server.addService(adder_proto.AdderService.service, {
  Add: (call, callback) => {
    const { num1, num2 } = call.request;
    const result = num1 + num2;
    callback(null, { result });
  },
});

const PORT = 'localhost:50051';
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(`Error binding to ${PORT}: ${err}`);
    return;
  }
  console.log(`gRPC Server listening on ${PORT}`);
  server.start();
});
