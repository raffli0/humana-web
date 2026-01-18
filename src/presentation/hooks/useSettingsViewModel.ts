import { useState, useCallback, useEffect } from "react";
import { CompanySettings, Department, Position, ISettingsRepository } from "../../domain/company/ISettingsRepository";
import { settingsRepository } from "../../infrastructure/settings/SupabaseSettingsRepository";
import { authService } from "../../infrastructure/auth/authService";

export function useSettingsViewModel(repository: ISettingsRepository = settingsRepository) {
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [settings, setSettings] = useState<CompanySettings>({
        office_latitude: null,
        office_longitude: null,
        office_radius_meters: 100,
        office_address: null,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const profile = await authService.getCurrentProfile();
            if (!profile?.company_id) {
                setLoading(false);
                return;
            }

            setCompanyId(profile.company_id);

            const [depts, pos, settingsData] = await Promise.all([
                repository.getDepartments(profile.company_id),
                repository.getPositions(profile.company_id),
                repository.getSettings(profile.company_id)
            ]);

            setDepartments(depts);
            setPositions(pos);
            if (settingsData) {
                setSettings(settingsData);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [repository]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addDepartment = async (name: string) => {
        if (!companyId || !name.trim()) return;
        try {
            await repository.addDepartment(companyId, name.trim());
            await fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const deleteDepartment = async (id: string) => {
        if (!confirm("Delete this department? Positions in this department will be unlinked.")) return;
        try {
            await repository.deleteDepartment(id);
            await fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const addPosition = async (name: string, departmentId?: string) => {
        if (!companyId || !name.trim()) return;
        try {
            await repository.addPosition(companyId, name.trim(), departmentId);
            await fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const deletePosition = async (id: string) => {
        if (!confirm("Delete this position?")) return;
        try {
            await repository.deletePosition(id);
            await fetchData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const updateLocationSettings = useCallback((updates: Partial<CompanySettings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    }, []);

    const updatePositionPayroll = async (positionId: string, updates: Partial<Position>) => {
        try {
            await repository.updatePosition(positionId, updates);
            setPositions(prev => prev.map(p => p.id === positionId ? { ...p, ...updates } : p));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const saveLocationSettings = async () => {
        if (!companyId) return;
        setSaving(true);
        setError(null);
        try {
            await repository.saveSettings(companyId, settings);
            alert("Settings saved successfully!");
        } catch (err: any) {
            setError(err.message);
            alert("Failed to save settings: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    return {
        companyId,
        departments,
        positions,
        settings,
        loading,
        saving,
        error,
        addDepartment,
        deleteDepartment,
        addPosition,
        deletePosition,
        updateLocationSettings,
        saveLocationSettings,
        updatePositionPayroll,
        refresh: fetchData
    };
}
