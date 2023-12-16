import io from "socket.io-client";
const getNotifications = () => {
    const sock = io('http://localhost:3001');
    
    console.log("Vanakkam da");
    sock.on('getNotifications', data => {
        console.log(data);
    })
    
        document.addEventListener('alpine:init', () => {
            Alpine.store('notification', {
                messages: Alpine.$persist([])
            })
            console.log(Alpine.store('notification').messages);
        })
}

export default getNotifications;