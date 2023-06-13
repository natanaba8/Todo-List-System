import React, { useEffect, useState } from 'react';
import { AxiosInstance } from 'axios'
import './signup.css'
import './login.css'
import { resumeSession } from './util';

interface SignupProps {
	axios: AxiosInstance
}

const Signup: React.FC<SignupProps> = ({ axios }) => {
	const [fullname, setFullname] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(true);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		signupAction(fullname, username, password);
	};

	const signupAction = async (fullname: string, username: string, password: string) => {
		if (fullname === "" || username === "" || password === "") return

		try {
			let result = await axios.post('/api/signup', { fullname, username, password: btoa(password) })
			if (result.data.success) {
				window.location.href = '/?type=1'
			} else {
				setResponse(result.data.message)
			}
		} catch (err: any) {
			setResponse('something went wrong')
			console.error(err)
		}
	}

	useEffect(() => {
		// resume session
		resumeSession(axios)
			.then(success => {
				if (success) {
					window.location.href = '/home'
				} else {
					localStorage.clear()
					setLoading(false)
				}
			})
			.catch(err => {
				setLoading(false)
			})
	}, [])

	return loading ? (
		<div>
			Loading...
		</div>
	) : (
		<form className='form' onSubmit={handleSubmit}>
			<div className="title">Signup</div>
      <div className="subtitle">Let's Create your account!</div>
			<p className="response">{response}</p>
			<div className="input-container ic1">
        <input id="firstname" className="input" placeholder="     " type="text" value={fullname} onChange={(event) => setFullname(event.target.value)}/>
        <div className="cut"></div>
        <label htmlFor="firstname" className="placeholder">Full Name</label>
      </div>
	  <div className="input-container ic1">
        <input id="firstname" className="input" placeholder="     " type="text" value={username} onChange={(event) => setUsername(event.target.value)}/>
        <div className="cut"></div>
        <label htmlFor="firstname" className="placeholder">User Name</label>
      </div>
	  <div className="input-container ic1">
        <input id="firstname" className="input" placeholder="     " type="password" value={password} onChange={(event) => setPassword(event.target.value)}/>
        <div className="cut"></div>
        <label htmlFor="firstname" className="placeholder">Password</label>
      </div>
			<button type="text" className="submit">Sign up</button>
			<a href="/">Already have an account</a>
		</form>
	);
}

export default Signup;
