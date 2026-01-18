import { JobPost, Candidate } from './recruitment';

export interface IRecruitmentRepository {
    getJobPostsByCompany(companyId: string): Promise<JobPost[]>;
    getCandidatesByCompany(companyId: string): Promise<Candidate[]>;
    updateCandidateStatus(candidateId: string, status: string): Promise<void>;
    createJobPost(job: Partial<JobPost>): Promise<void>;
}
