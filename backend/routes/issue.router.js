import express from 'express';
const issueRouter = express.Router();
import {
    getAllIssues,
    createIssue,
    updateIssueById, 
    deleteIssueById,
    getIssueById,
} from '../controllers/issueController.js';

issueRouter.post('/create', createIssue);
issueRouter.put('/update/:id', updateIssueById);
issueRouter.delete('/delete/:id', deleteIssueById);
issueRouter.get('/all', getAllIssues);
issueRouter.get('/:id', getIssueById);

export default issueRouter;
