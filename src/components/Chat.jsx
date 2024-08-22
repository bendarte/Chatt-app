import React, { useState, useEffect } from 'react';

// Function to sanitize message text
const sanitizeText = (text) => {
  const element = document.createElement('div');
  element.innerText = text;
  return element.innerHTML;
};

const Chat = ({ token }) => {
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [activeConversation, setActiveConversation] = useState(localStorage.getItem('conversationId') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [userId] = useState(localStorage.getItem('userId') || '');
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState(JSON.parse(localStorage.getItem('conversations')) || []);

  // Lägger in fejkdata
  const [fakeChat, setFakeChat] = useState([
    {
      "text": "Shoo Osman, hur mår du?",
      "avatar": "https://i.pravatar.cc/100",
      "username": "Sebbe",
      "userId": "fakeId1",  // Fejkad användar-id
      "conversationId": null
    },
    {
      "text": "Hallå!! Svara då!!",
      "avatar": "https://i.pravatar.cc/100",
      "username": "Sebbe",
      "userId": "fakeId1",  // Fejkad användar-id
      "conversationId": null
    },
    {
      "text": "Hej Sebbe, jag mår bra! Är jag godkänd?",
      "avatar": "https://i.pravatar.cc/101",
      "username": username,
      "userId": userId,  // Användarens id
      "conversationId": null
    }
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://chatify-api.up.railway.app/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Kunde inte hämta användare');

        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        setError('Kunde inte hämta användare');
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`https://chatify-api.up.railway.app/messages?conversationId=${activeConversation}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Kunde inte hämta meddelanden');

        const messagesData = await response.json();
        setMessages(messagesData);
        localStorage.setItem('messages', JSON.stringify(messagesData));

        const conversationExists = conversations.some((convo) => convo.id === activeConversation);
        if (!conversationExists) {
          const newConversation = {
            id: activeConversation,
            name: 'Ny konversation',
          };
          const updatedConversations = [...conversations, newConversation];
          setConversations(updatedConversations);
          localStorage.setItem('conversations', JSON.stringify(updatedConversations));
        }
      } catch (error) {
        setError('Kunde inte hämta meddelanden');
      }
    };

    fetchMessages();
  }, [activeConversation, token, conversations]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('https://chatify-api.up.railway.app/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sanitizeText(newMessage),
          conversationId: activeConversation,
        }),
      });

      if (!response.ok) throw new Error('Meddelandet kunde inte skickas');

      const { latestMessage } = await response.json();
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, { ...latestMessage, userId, username }];
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      setNewMessage('');
    } catch (error) {
      setError('Meddelandet kunde inte skickas');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(`https://chatify-api.up.railway.app/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Meddelandet kunde inte raderas');

      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.filter((message) => message.id !== messageId);
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    } catch (error) {
      setError('Meddelandet kunde inte raderas');
    }
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation.id);
    localStorage.setItem('conversationId', conversation.id);
  };

  return (
    <div className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center" style={{ backgroundImage: "url('/src/components/Assets/ChatBackground.svg')" }}>
      <div className="flex w-full max-w-4xl">
        <div className="fixed right-2 top-1 bottom-2 min-w-[15rem] bg-white bg-opacity-60 backdrop-blur-lg rounded-lg shadow-lg p-5 overflow-auto">
          <h3 className="text-xl font-light text-center mb-4 text-gray-800">Användare</h3>
          <ul className="max-h-[75vh] overflow-y-scroll list-none p-0 m-0">
            {users.map((user) => (
              <li key={user.userId} className="flex items-center mb-2">
                <span className="mr-2 text-gray-800">{user.username}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 flex flex-col ml-[15rem] p-4">
          <h2 className="text-2xl font-light mb-4 text-gray-800">Chat: {conversations.find((convo) => convo.id === activeConversation)?.name || ''}</h2>
          <div className="flex-1 overflow-auto bg-white bg-opacity-60 backdrop-blur-lg rounded-lg shadow-lg p-4">
            <div className="flex flex-col space-y-2">
              {/* Visa fakeChat meddelanden */}
              {fakeChat.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start mb-2 ${message.userId?.toString() === userId?.toString() ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 ${message.userId?.toString() === userId?.toString() ? 'flex-row-reverse' : ''}`}>
                    <img src={message.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                    <div className={`max-w-xs p-2 rounded-lg ${message.userId?.toString() === userId?.toString() ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>
                      <div className="text-sm font-semibold">{message.username}</div>
                      <p className="text-sm" dangerouslySetInnerHTML={{ __html: sanitizeText(message.text) }}></p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Visa riktiga meddelanden */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start mb-2 ${message.userId?.toString() === userId?.toString() ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 ${message.userId?.toString() === userId?.toString() ? 'flex-row-reverse' : ''}`}>
                    <img src={message.avatar || 'https://i.pravatar.cc/100'} alt="avatar" className="w-8 h-8 rounded-full" />
                    <div className={`max-w-xs p-2 rounded-lg ${message.userId?.toString() === userId?.toString() ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>
                      <div className="text-sm font-semibold">{message.username}</div>
                      <p className="text-sm" dangerouslySetInnerHTML={{ __html: sanitizeText(message.text) }}></p>
                      {message.userId?.toString() === userId?.toString() && (
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          Radera
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center mt-4">
            <input
              id="newMessageInput"
              name="newMessage"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Skriv ett meddelande..."
              className="flex-1 p-3 border border-gray-300 rounded-full bg-gray-800 text-white placeholder-gray-400"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              Skicka
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;



