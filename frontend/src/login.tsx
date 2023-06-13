import React, { useEffect, useState } from "react";
import { AxiosInstance } from 'axios'
import './login.css'
import { resumeSession } from "./util";

interface LoginFormProps {
  axios: AxiosInstance
}

const Login: React.FC<LoginFormProps> = ({ axios }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(true);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginAction(username, password);
  };

	const loginAction = async (username: string, password: string) => {
		if (username === "" || password === "") return

		try {
			let result = await axios.post('/api/login', { username, password: btoa(password) })
			console.log(result.data)

			if (result.data.success) {
				localStorage.setItem('todo-token', btoa(result.data.token))
				localStorage.setItem('todo-username', btoa(username))
				window.location.href = '/home'
			} else {
				setResponse(result.data.message)
			}
		} catch(err: any) {
			setResponse('something went wrong')
			console.error(err)
		}
	}

	useEffect(() => {
		let params = (new URL(window.location.href)).searchParams
		switch (params.get('type')) {
			case '1': // user completed sign up
				setResponse('Please login to continue')
			default:
		}

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
	},[])

  return loading ? (
		<div id="loading-bar-spinner" className="spinner"><div className="spinner-icon"></div></div>
	) : (
    <form className="form" onSubmit={handleSubmit}>
			<div className="title">Login</div>
      <div className="subtitle">Let's login your account!</div>
			<p className="response">{response}</p>
			<div className="input-container ic1">
        <input id="firstname" className="input" placeholder="     " type="text" value={username} onChange={handleUsernameChange}/>
        <div className="cut"></div>
        <label htmlFor="firstname" className="placeholder">User Name</label>
      </div>
	  <div className="input-container ic1">
        <input id="firstname" className="input" placeholder="     " type="password" value={password} onChange={handlePasswordChange}/>
        <div className="cut"></div>
        <label htmlFor="firstname" className="placeholder">Password</label>
      </div>
      <button type="text" className="submit">Login</button>
			<a href="/signup" className="subtitle">Create an account</a>
    </form>
  );
};

export default Login;
