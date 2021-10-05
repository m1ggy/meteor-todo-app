import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import TaskCollection from '/imports/db/TaskCollection';
import '/imports/api/tasksMethods';
import '/imports/api/tasksPublications';

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

const insertTask = (taskText, user) =>
  TaskCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });
Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  if (TaskCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task',
    ].forEach(insertTask);
  }
});
