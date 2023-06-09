import React, { useEffect, useState } from 'react';
import { AxiosInstance } from 'axios'
import './signup.css'
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
			<h3>Signup</h3>
			<p className="response">{response}</p>
			<input
				placeholder='Full Name'
				type="text"
				id="fullname"
				value={fullname}
				onChange={(event) => setFullname(event.target.value)}
			/>
			<input
				placeholder='Username'
				type="text"
				id="username"
				value={username}
				onChange={(event) => setUsername(event.target.value)}
			/>
			<input
				placeholder='Password'
				type="password"
				id="password"
				value={password}
				onChange={(event) => setPassword(event.target.value)}
			/>
			<button type="submit">Sign up</button>
			<a href="/">Already have an account</a>
		</form>
	);
}

export default Signup;
