import { IRecruitmentRepository } from '../../domain/recruitment/IRecruitmentRepository';
import { JobPost, Candidate } from '../../domain/recruitment/recruitment';

export class GetJobPostsUseCase {
    constructor(private recruitmentRepo: IRecruitmentRepository) { }

    async execute(companyId: string): Promise<JobPost[]> {
        return await this.recruitmentRepo.getJobPostsByCompany(companyId);
    }
}

export class GetCandidatesUseCase {
    constructor(private recruitmentRepo: IRecruitmentRepository) { }

    async execute(companyId: string): Promise<Candidate[]> {
        return await this.recruitmentRepo.getCandidatesByCompany(companyId);
    }
}

export class UpdateCandidateStatusUseCase {
    constructor(private recruitmentRepo: IRecruitmentRepository) { }

    async execute(candidateId: string, status: string): Promise<void> {
        await this.recruitmentRepo.updateCandidateStatus(candidateId, status);
    }
}

export class CreateJobPostUseCase {
    constructor(private recruitmentRepo: IRecruitmentRepository) { }

    async execute(job: Partial<JobPost>): Promise<void> {
        await this.recruitmentRepo.createJobPost(job);
    }
}

export class UpdateJobStatusUseCase {
    constructor(private recruitmentRepo: IRecruitmentRepository) { }

    async execute(jobId: string, status: string): Promise<void> {
        await this.recruitmentRepo.updateJobStatus(jobId, status);
    }
}

export class UpdateJobPostUseCase {
    constructor(private recruitmentRepo: IRecruitmentRepository) { }

    async execute(jobId: string, job: Partial<JobPost>): Promise<void> {
        await this.recruitmentRepo.updateJobPost(jobId, job);
    }
}
