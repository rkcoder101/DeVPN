const express  = require('express');
const app = express();
app.use(express.json());
// hardcoded providers
const providers = [
    { id: '0xProvider1', ip: 'localhost', port: 1080, bandwidth: '100 Mbps' },
    { id: '0xProvider2', ip: '192.168.1.2', port: 1080, bandwidth: '50 Mbps' }
]

// Hardcoded payment status
const payment = {
    '0xConsumer1': true,  // Consumer 1 has paid
    '0xConsumer2': false  // Consumer 2 has not paid
  };

app.get('/providers', (req, res) => {
    res.json(providers);
});
app.post('/connect',(req,res) =>{
    const {consumerAddress,providerAddress} = req.body;
    const isPaid = payment[consumerAddress];
    if (!isPaid){
        return res.status(402),json({error:'payment required'});        
    }
    const provider = providers.find(p => p.id === providerAddress);
    res.json({
        ip : provider.id,
        port : provider.port,
        bandwidth : provider.bandwidth
    })
});
app.listen(3000,()=>{
    console.log(`backend api listening on port 3000`);
})