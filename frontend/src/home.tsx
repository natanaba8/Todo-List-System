import React, { useEffect, useState } from 'react'
import { AxiosInstance } from 'axios'
import './home.css'
import { generateHeader, resumeSession } from './util';

interface HomeProps {
	axios: AxiosInstance;
}

interface PersonalInfo {
	fullname: string;
	username: string;
}

interface TodoItem {
	id: number;
	text: string;
	done: boolean;
	timestamp: Date;
}

enum DoneStatus {
	All = 'All',
	Done = 'Done',
	Pending = 'Pending'
}


const Home: React.FC<HomeProps> = ({ axios }) => {
	const [token, setToken] = useState(atob(localStorage.getItem('todo-token') as string));
	const [username, setUsername] = useState(atob(localStorage.getItem('todo-username') as string));

	const authHeader = {
		headers: {
			Authorization: `Bearer ${generateHeader(username, token)}`
		}
	}

	const [peronsalInfo, setPersonalInfo] = useState({ fullname: '', username: '' })
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState(DoneStatus.All);
	const [newItemText, setNewItemText] = useState("");
	const [todoItemsList, setTodoItemsList] = useState<TodoItem[]>([]);

	const newItemTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewItemText(event.target.value);
	};

	const getPersonalInfo = async (fullname = '', username = ''): Promise<void> => {
		try {
			const response = await axios.get('/api/user', authHeader)
			if (response.data.success) {
				setPersonalInfo(response.data.user)
			} else {
				setPersonalInfo({ fullname, username })
			}
		} catch (err: any) {
			console.error(err)
			setPersonalInfo({ fullname, username })
		}
	}

	const createItem = async () => {
		if (newItemText === "") return

		try {
			await axios.post('/api/todo', { text: newItemText }, authHeader)

			await fetchItems()
			setNewItemText("")
		} catch (err: any) {
			console.error(err)
		}
	}

	const toggleItemCheck = async (id: number, done: boolean) => {
		try {
			await axios.put('/api/todo', { id, done: !done }, authHeader)
			await fetchItems()
		} catch (err: any) {
			console.error(err)
		}
	}

	const removeItem = async (id: number) => {
		try {
			await axios.delete('/api/todo', {
				data: { id },
				...authHeader
			})
			await fetchItems()
		} catch (err: any) {
			console.error(err)
		}
	}

	const todoItems = todoItemsList
		.filter(item => filter === DoneStatus.All ? true : filter === DoneStatus.Done ? item.done : !item.done)
		.map(({ id, text, done }, index) => (
			<div className={`list-item ${done ? 'done' : ''}`} key={index}>
				<input type="checkbox" checked={done} onChange={e => toggleItemCheck(id, done)} />
				<div>
					<p className="text" onClick={e => toggleItemCheck(id, done)}>{text}</p>
				</div>
				<div className="spacer"></div>
				<button className="delete" onClick={e => removeItem(id)}>delete</button>
			</div>
		))

	const fetchItems = async () => {
		let response = await axios.get('/api/todo', authHeader)
		if (response.data.success) {
			setTodoItemsList([...response.data.list])
		}
	}

	const init = () => {
		setLoading(false)
		getPersonalInfo()
		fetchItems()
	}

	const logoutAction = async () => {
		try {
			await axios.post('/api/logout', {}, authHeader)
		} catch (err: any) {
		} finally {
			localStorage.clear()
			window.location.href = '/'
		}
	}

	useEffect(() => {
		setToken(atob(localStorage.getItem('todo-token') as string))
		setUsername(atob(localStorage.getItem('todo-username') as string))

		// resume session
		resumeSession(axios)
			.then(success => {
				if (success) {
					init()
				} else {
					localStorage.clear()
					window.location.href = '/'
				}
			})
			.catch(err => {
				localStorage.clear()
				window.location.href = '/'
			})
	}, [])

	const updateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setFilter(e.target.value as DoneStatus)
	}

	const addItemKeyHandle = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") createItem()
	}

	return loading ? (
		<div className="loading">
			Loading...
		</div>
	) : (
		<div className='home'>
			<div className="header">
				<div className="header-container">
					<p className="fullname">{peronsalInfo.fullname}</p>
					<button onClick={logoutAction}>Logout</button>
				</div>
			</div>


			<div className="add-item">
				<input type="text" placeholder='Add Item...' value={newItemText} onChange={newItemTextChange} onKeyDown={addItemKeyHandle} />
				<button onClick={createItem}>Add Item</button>
			</div>

			<div className="list">
				<div className="list-header">
					<h3>My Todo List</h3>
					<div className="spacer"></div>
					<p>Filter</p>
					<select placeholder="Filter" onChange={updateFilter}>
						<option value={DoneStatus.All}>All</option>
						<option value={DoneStatus.Done}>Done</option>
						<option value={DoneStatus.Pending}>Pending</option>
					</select>
				</div>

				<div className="items">
					{todoItems}
				</div>
			</div>
		</div>
	)
}

export default Home