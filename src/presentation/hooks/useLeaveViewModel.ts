import { useState, useEffect, useCallback } from 'react';
import { leaveRepository } from '../../infrastructure/supabase/SupabaseLeaveRepository';
import { authService } from '../../infrastructure/auth/authService';
import { GetLeaveRequestsUseCase, UpdateLeaveStatusUseCase, CreateLeaveRequestUseCase } from '../../application/leave/LeaveUseCases';
import { LeaveRequest } from '../../domain/leave/leave';

export function useLeaveViewModel() {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getLeaveRequestsUseCase = new GetLeaveRequestsUseCase(leaveRepository);
    const updateLeaveStatusUseCase = new UpdateLeaveStatusUseCase(leaveRepository);
    const createLeaveRequestUseCase = new CreateLeaveRequestUseCase(leaveRepository);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const profile = await authService.getCurrentProfile();
            if (profile?.company_id) {
                const requests = await getLeaveRequestsUseCase.execute(profile.company_id);
                setLeaveRequests(requests);
            }
        } catch (error) {
            console.error("Failed to fetch leave requests:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateStatus = async (leaveId: string, status: 'Approved' | 'Rejected') => {
        setIsSubmitting(true);
        try {
            await updateLeaveStatusUseCase.execute(leaveId, status);
            setLeaveRequests(prev => prev.map(req => req.id === leaveId ? { ...req, status } : req));
        } finally {
            setIsSubmitting(false);
        }
    };

    const createRequest = async (request: Partial<LeaveRequest>) => {
        setIsSubmitting(true);
        try {
            await createLeaveRequestUseCase.execute(request);
            await fetchData(); // Refresh list after creation
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        leaveRequests,
        loading,
        isSubmitting,
        updateStatus,
        createRequest,
        refresh: fetchData
    };
}
