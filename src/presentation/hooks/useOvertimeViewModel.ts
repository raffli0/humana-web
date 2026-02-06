import { useState, useEffect, useCallback } from 'react';
import { overtimeRepository } from '../../infrastructure/supabase/SupabaseOvertimeRepository';
import { authService } from '../../infrastructure/auth/authService';
import { OvertimeRequest } from '../../domain/overtime/overtime';

export function useOvertimeViewModel() {
    const [requests, setRequests] = useState<OvertimeRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [companyId, setCompanyId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const profile = await authService.getCurrentProfile();
            if (profile?.company_id) {
                setCompanyId(profile.company_id);
                const data = await overtimeRepository.getOvertimeRequests(profile.company_id);
                setRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch overtime requests:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateStatus = async (id: string, status: 'approved' | 'rejected', adminNote?: string) => {
        try {
            await overtimeRepository.updateOvertimeStatus(id, status, adminNote);
            setRequests(prev => prev.map(req =>
                req.id === id ? { ...req, status, admin_note: adminNote } : req
            ));
        } catch (error) {
            console.error(`Failed to ${status} request:`, error);
            throw error;
        }
    };

    return {
        requests,
        loading,
        updateStatus,
        refresh: fetchData
    };
}
