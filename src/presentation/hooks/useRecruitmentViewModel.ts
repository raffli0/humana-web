import { useState, useEffect, useCallback } from 'react';
import { recruitmentRepository } from '../../infrastructure/supabase/SupabaseRecruitmentRepository';
import { authService } from '../../infrastructure/auth/authService';
import { GetJobPostsUseCase, GetCandidatesUseCase, UpdateCandidateStatusUseCase, CreateJobPostUseCase, UpdateJobStatusUseCase, UpdateJobPostUseCase } from '../../application/recruitment/RecruitmentUseCases';
import { JobPost, Candidate, RecruitmentSummary } from '../../domain/recruitment/recruitment';

export function useRecruitmentViewModel() {
    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getJobPostsUseCase = new GetJobPostsUseCase(recruitmentRepository);
    const getCandidatesUseCase = new GetCandidatesUseCase(recruitmentRepository);
    const updateCandidateStatusUseCase = new UpdateCandidateStatusUseCase(recruitmentRepository);
    const createJobPostUseCase = new CreateJobPostUseCase(recruitmentRepository);
    const updateJobStatusUseCase = new UpdateJobStatusUseCase(recruitmentRepository);
    const updateJobPostUseCase = new UpdateJobPostUseCase(recruitmentRepository);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const profile = await authService.getCurrentProfile();
            if (profile?.company_id) {
                const [jobs, apps] = await Promise.all([
                    getJobPostsUseCase.execute(profile.company_id),
                    getCandidatesUseCase.execute(profile.company_id)
                ]);
                setJobPosts(jobs);
                setCandidates(apps);
            }
        } catch (error) {
            console.error("Failed to fetch recruitment data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateStatus = async (candidateId: string, status: string) => {
        setIsSubmitting(true);
        try {
            await updateCandidateStatusUseCase.execute(candidateId, status);
            setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status } : c));
        } finally {
            setIsSubmitting(false);
        }
    };

    const createJob = async (job: Partial<JobPost>) => {
        setIsSubmitting(true);
        try {
            const profile = await authService.getCurrentProfile();
            if (!profile?.company_id) {
                throw new Error("Company ID not found");
            }

            await createJobPostUseCase.execute({
                ...job,
                company_id: profile.company_id
            });
            await fetchData();
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateJobStatus = async (jobId: string, status: string) => {
        setIsSubmitting(true);
        try {
            await updateJobStatusUseCase.execute(jobId, status);
            setJobPosts(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateJobPost = async (jobId: string, job: Partial<JobPost>) => {
        setIsSubmitting(true);
        try {
            await updateJobPostUseCase.execute(jobId, job);
            await fetchData();
        } finally {
            setIsSubmitting(false);
        }
    };

    const summary: RecruitmentSummary = {
        open_jobs: jobPosts.filter(j => j.status === 'Open').length,
        total_candidates: candidates.length,
        new_candidates: candidates.filter(c => c.status === 'New').length
    };

    return {
        jobPosts,
        candidates,
        summary,
        loading,
        isSubmitting,
        updateStatus,
        createJob,
        updateJobStatus,
        updateJobPost,
        refresh: fetchData
    };
}
