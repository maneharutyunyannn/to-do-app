import React, { useEffect, useState } from 'react';
import { fetchTasks, addTask, completeTask, deleteTask, editTask } from './auth';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null); 

    const fetchAllTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchTasks();
            setTasks(response);
        } catch (err) {
            setError('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to add tasks.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await addTask(taskName, taskDescription);
            setTaskName('');
            setTaskDescription('');
            fetchAllTasks();
        } catch (err) {
            setError('Failed to add task: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditTask = async () => {
        setLoading(true);
        setError(null);
        try {
            await editTask(editingTaskId, taskName, taskDescription); 
            setEditingTaskId(null); 
            setTaskName('');
            setTaskDescription('');
            fetchAllTasks();
        } catch (err) {
            setError('Failed to edit task: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteTask = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const updatedTask = await completeTask(id);
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task.id === updatedTask.id ? { ...task, is_completed: updatedTask.is_completed } : task
                )
            );
        } catch (err) {
            setError('Failed to complete task');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteTask(id);
            fetchAllTasks();
        } catch (err) {
            setError('Failed to delete task');
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (task) => {
        setTaskName(task.title);
        setTaskDescription(task.description);
        setEditingTaskId(task.id);
    };

    useEffect(() => {
        fetchAllTasks();
    }, []);

    return (
        <div>
            <h2 className='text-center mb-4'>Tasks</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className='row mb-5'>
                <div className='col-md-12'>
                    <input
                        type="text" className='form-control mb-3'
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="Task Title"
                    />
                </div>
                <div className='col-md-12'>
                    <input
                        type="text" className='form-control mb-3'
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder="Task Description"
                    />
                </div>
                <div className='col-md-12'>
                    {editingTaskId ? (
                        <button className='btn btn-secondary w-25' onClick={handleEditTask} disabled={loading}>Save Changes</button>
                    ) : (
                        <button className='btn btn-secondary w-25' onClick={handleAddTask} disabled={loading}>Add Task</button>
                    )}
                </div>
            </div>
            {tasks.map(task => (
                <div key={task.id} className='row mb-2'>
                    <div className='col-md-2'>
                        #{task.id}
                    </div>
                    <div className='col-md-5'>
                        <span className='d-block text-start text-dark'>
                            Title: {task.title}
                        </span>
                        <span className='d-block text-dark'>
                            Description: {task.description}
                        </span>
                    </div>
                    <div className='col-md-5 d-flex justify-content-between align-items-center'>
                    <button className='btn btn-primary py-0 ' onClick={() => startEditing(task)} disabled={loading}>
                            Edit
                        </button>
                        <button className='btn btn-danger py-0' onClick={() => handleDeleteTask(task.id)} disabled={loading}>Delete</button>
                        {task.is_completed ? (
                            <span className='text-success'>Completed!</span>
                        ) : (
                            <button className='btn btn-secondary py-0' onClick={() => handleCompleteTask(task.id)} disabled={loading}>
                                Complete
                            </button>
                        )}
                    </div>
                    
                </div>
            ))}
        </div>
    );

};

export default TaskManager;
