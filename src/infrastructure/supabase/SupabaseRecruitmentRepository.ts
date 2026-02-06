import { supabase } from '../supabase/client';
import { JobPost, Candidate } from '../../domain/recruitment/recruitment';
import { IRecruitmentRepository } from '../../domain/recruitment/IRecruitmentRepository';

export class SupabaseRecruitmentRepository implements IRecruitmentRepository {
    async getJobPostsByCompany(companyId: string): Promise<JobPost[]> {
        const { data, error } = await supabase
            .from('recruitments')
            .select('*')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    async getCandidatesByCompany(companyId: string): Promise<Candidate[]> {
        const { data, error } = await supabase
            .from('candidates')
            .select('*, recruitments(title)')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });

        if (error) {
            console.warn("Error fetching candidates:", error.message);
            return [];
        }
        return data || [];
    }

    async updateCandidateStatus(candidateId: string, status: string): Promise<void> {
        const { error } = await supabase
            .from('candidates')
            .update({ status })
            .eq('id', candidateId);

        if (error) throw error;
    }

    async createJobPost(job: Partial<JobPost>): Promise<void> {
        const { error } = await supabase
            .from('recruitments')
            .insert(job);

        if (error) throw error;
    }
}

export const recruitmentRepository = new SupabaseRecruitmentRepository();
