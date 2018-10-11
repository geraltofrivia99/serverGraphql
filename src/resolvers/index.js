import userResolvers from '../resolvers/user';
import messageResolvers from '../resolvers/message';
import fileResolvers from '../resolvers/file';
import directMessageResolvers from './directMessage';

export default [userResolvers, messageResolvers, fileResolvers, directMessageResolvers];