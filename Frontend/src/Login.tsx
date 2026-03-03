import { useState } from 'react';

function Login({ onLogin }: { onLogin: (user: any) => void }) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')

    const handleSubmit = async () => {
        const res = await fetch(`http://localhost:5000/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email })
        });
        const data = await res.json();
        if (data.error) {
            alert(`User not found!`)
            return
        }
        onLogin(data)
    }

    return (
        <div>
            <div>
                <input
                    placeholder='Username'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input
                    placeholder='Email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div>
                <button onClick={handleSubmit}>Login</button>
            </div>
        </div>
    )
}

/**
 * test1 username: swiftie2026
 * test1 email: tayfan@example.com
 * 
 * test2 username: armyforever
 * test2 email: btslover@example.com
 * 
 * test 3 username: weekndvibes
 * test 3 email: abelmusic@example.com
 */

export default Login