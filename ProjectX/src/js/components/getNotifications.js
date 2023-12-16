
import io from "socket.io-client";
const getNotifications = () => {
    const sock = io('http://localhost:3001');
    
    console.log("Vanakkam da");
    sock.on('getNotifications', data => {
        console.log(data);
    })

    document.addEventListener('alpine:init', () => {
        Alpine.store('darkMode', {
            
        })
    })
}

export default getNotifications;