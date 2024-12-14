            // import  { useEffect, useState } from 'react';
            // import io from 'socket.io-client';

            // const socket = io('http://localhost:9000');

            function Home() {
              // const [messages, setMessages] = useState<string[]>([]);
              // const [input, setInput] = useState('');

              // useEffect(() => {
              //   socket.on('message', (message: string) => {
              //     setMessages((prevMessages) => [...prevMessages, message]);
              //   });

              //   return () => {
              //     socket.off('message');
              //   };
              // }, []);

              // const sendMessage = () => {
              //   if (input.trim()) {
              //     socket.emit('message', input);
              //     setInput('');
              //   }
              // };

              return (
                <>
                  <div className="h-[100vh]">
                    <div>
                      {/* <div className="messages">
                        {messages.map((message, index) => (
                          <div key={index}>{message}</div>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        
                      />
                      <button onClick={sendMessage}>Send</button> */}
                    </div>
                  </div>
                </>
              );
            }

            export default Home;
