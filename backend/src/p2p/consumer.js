const SocksClient = require('socks').SocksClient;

// Hardcoded Provider details
const providerIP = 'localhost'; // Replace with actual IP in real setup
const providerPort = 1080;

const consumerConfig = {
    proxy: {
        host : providerIP,
        port : providerPort, 
        type : 5,        
    },
    command : 'connect',
    destination:{
        host : 'httpbin.org',
        port : 80
    }
};
const connectToProvider = async () =>{
    try{
        const {socket} = await SocksClient.createConnection(consumerConfig);
        console.log('connected to provider');
        socket.write('GET / HTTP/1.1\r\nHost: httpbin.org\r\n\r\n');
        socket.on('data', (data) => {
            console.log('Received:', data.toString());
        });
        socket.on('end', () => {
            console.log('Connection closed');
        });
    }
    catch(error){
        console.log('Connection failed: ',error);
    }
}
connectToProvider();