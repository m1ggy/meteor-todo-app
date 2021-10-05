import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import TaskCollection from '../db/TaskCollection.js';
import Task from './Task.jsx';
import TaskForm from './TaskForm.jsx';
import LoginForm from './LoginForm.jsx';
import { Meteor } from 'meteor/meteor';

const toggleChecked = ({ _id, isChecked }) => {
  Meteor.call('tasks.setIsChecked', _id, !isChecked);
};

const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id);

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);
  const user = useTracker(() => Meteor.user());

  const hideCompletedFilter = { isChecked: { $ne: true } };
  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  const { tasks, pendingTasksCount, isLoading } = useTracker(() => {
    const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('tasks');

    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const tasks = TaskCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        sort: { createdAt: -1 },
      }
    ).fetch();
    const pendingTasksCount = TaskCollection.find(pendingOnlyFilter).count();

    return { tasks, pendingTasksCount };
  });

  const pendingTasksTitle = `${
    pendingTasksCount ? ` (${pendingTasksCount})` : ''
  }`;
  const logout = () => Meteor.logout();
  return (
    <div className='app'>
      <header>
        <div className='app-bar'>
          <div className='app-header'>
            <h1>📝️ To Do List {pendingTasksTitle}</h1>
          </div>
        </div>
      </header>

      <div className='main'>
        {user ? (
          <>
            <div className='user' onClick={logout}>
              {user.username} 🚪
            </div>
            <TaskForm user={user} />
            <div className='filter'>
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? 'Show All' : 'Hide Completed'}
              </button>
            </div>

            {isLoading && <div className='loading'>loading...</div>}

            <ul className='tasks'>
              {tasks.map((task) => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={toggleChecked}
                  onDeleteClick={deleteTask}
                />
              ))}
            </ul>
          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};
