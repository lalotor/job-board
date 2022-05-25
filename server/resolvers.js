import { Company, Job } from './db.js'

function rejectIf(condition, message) {
  if (condition) {
    throw new Error(message);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const resolvers = {
  Query: {
    job: (_root, { id }) => Job.findById(id),
    jobs: () => Job.findAll(),
    company: (_root, { id }) => Company.findById(id),
  },

  Mutation: {
    createJob: async (_root, { input }, { user }) => {
      rejectIf(!user, 'Unathorized');
      // await delay(2000);
      return Job.create({ ...input, companyId: user.companyId })
    },
    deleteJob: async (_root, { id }, { user }) => {
      rejectIf(!user, 'Unathorized');
      const job = await Job.findById(id);
      rejectIf(!job, 'Job does not exist');
      rejectIf(job.companyId !== user.companyId, 'You cannot delete jobs from others companies');
      return Job.delete(id);
    },
    updateJob: async (_root, { input }, { user }) => {
      rejectIf(!user, 'Unathorized');
      const job = await Job.findById(input.id);
      rejectIf(!job, 'Job does not exist');
      rejectIf(job.companyId !== user.companyId, 'You cannot update jobs from others companies');
      return Job.update({ ...input, companyId: user.companyId });
    },
  },

  Company: {
    jobs: (company) => Job.findAll((job) => job.companyId === company.id),
  },

  Job: {
    company: (job) => Company.findById(job.companyId),
  },
};
