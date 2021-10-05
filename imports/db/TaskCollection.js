import { Mongo } from 'meteor/mongo';

const TaskCollection = new Mongo.Collection('tasks');

export default TaskCollection;
