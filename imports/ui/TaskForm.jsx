import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
const TaskForm = () => {
  const [task, setTask] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();

    Meteor.call('tasks.insert', task);
    setTask('');
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder='Create new tasks here'
      />
      <button type='submit'>submit</button>
    </form>
  );
};

export default TaskForm;
