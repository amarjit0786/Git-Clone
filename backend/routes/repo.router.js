import express from 'express';
const repoRouter = express.Router();
import {
    createRepository,
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositorsForCurrentUser,
    updateRepositoryById,
    toggleRepositoryVisibilityById,
    deleteRepositoryById,
    toggleStarRepository
} from '../controllers/repoController.js';




// Routes inside `repoRouter` no longer need "/repo" prefix
repoRouter.post('/create', createRepository);
repoRouter.get('/all', getAllRepositories);
repoRouter.get('/:id', fetchRepositoryById);
repoRouter.get('/name/:name', fetchRepositoryByName);
repoRouter.get('/user/:userId', fetchRepositorsForCurrentUser);
repoRouter.put('/update/:id', updateRepositoryById);
repoRouter.put('/toggle/:id', toggleRepositoryVisibilityById);
repoRouter.delete('/delete/:id', deleteRepositoryById);
repoRouter.put('/star/:repoId',toggleStarRepository);

export default repoRouter;
