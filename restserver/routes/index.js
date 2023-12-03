var express = require('express');
var router = express.Router();
const path = require('path');

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, 'adder.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const adder_proto = grpc.loadPackageDefinition(packageDefinition).adder;
const grpcClient = new adder_proto.AdderService('localhost:50051', grpc.credentials.createInsecure());

router.get('/', function(req, res, next) {
  const num1 = req.query.num1;
  const num2 = req.query.num2;
  
  const grpcRequest = { num1 , num2 };

  grpcClient.Add(grpcRequest, (error, response) => {
    if (!error) {
      res.json({ result: response.result });
    } else {
      console.error('gRPC Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

module.exports = router;
