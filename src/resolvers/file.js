import { combineResolvers } from 'graphql-resolvers';
import { createWriteStream } from 'fs';

const storeUpload = ({stream, filename}) => new Promise((resolve, reject) => 
  stream
    .pipe(createWriteStream(`files/${filename}`))
    .on("finish", () => resolve())
    .on("error", reject)
);

export default {
  Query: {
    file: async (parent, { id }, { models }) => {
      return await models.File.findById(id);
    },
    files: async (parent, args, { models }) => {
      return await models.File.findAll();
    },
    userFiles: async (parent, args, { models, me }) => {
      return await models.File.findAll({
        where: {userId: me.id}
      });
    },
    uploads: async (parent, args, { models }) => {
      // Return the record of files uploaded from your DB or API or filesystem.
    }
  },
  Mutation: {
    createFile: async (parent, { url, userId, type, name }, { models }) => {
      return await models.File.create({
        url,
        userId,
        type,
        name
      });
    },
    deleteFile: combineResolvers(
      // isAuthenticated,
      // isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.File.destroy({ where: { id } });
      },
    ),
    singleUpload: async (parent, { file }, {models, me}) => {
      const { stream, filename, mimetype } = await file;
      console.log(file)
      await storeUpload({stream, filename});
      
      const url = `http://localhost:8000/files/${filename}`
      await models.File.create({
        url,
        userId: me.id,
        filename,
        type: mimetype
      });
      // 1. Validate file metadata.

      // 2. Stream file contents into local filesystem or cloud storage:
      // https://nodejs.org/api/stream.html

      // 3. Record the file upload in your DB.
      // const id = await recordFile( … )

      return { filename, mimetype };
    }
  },

  File: {
    user: async (file, args, { models }) => {
      console.log(file.userId)
      return await models.User.findById(file.userId);
    },
  },
};