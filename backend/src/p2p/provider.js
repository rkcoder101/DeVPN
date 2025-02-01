const socks5 = require('socksv5');
const verifyPayment = async (consumerAddress,providerAddress) =>{
    // for now we return true
    return true;
}
const server = socks5.createServer((info, accept, deny) => {
    console.log(`Incoming connection from ${info.srcAddr}:${info.srcPort}`);   
   
    const consumerAddress = "consumer_wallet_address";
    const providerAddress = "provider_wallet_address";
    
    verifyPayment(consumerAddress, providerAddress).then(isPaid => {
        if (isPaid) {
            console.log("Payment verified, allowing connection.");
            accept();
        } else {
            console.log("Payment not verified, rejecting connection.");
            deny();
        }
    }).catch(err => {
        console.error("Error verifying payment:", err);
        deny();
    });
});
server.useAuth(socks5.auth.None());
server.listen(1080, '0.0.0.0', () => {
    console.log("SOCKS5 proxy server running on port 1080");
});
