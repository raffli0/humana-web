import { supabase } from '../supabase/client';
import { Profile } from '../../domain/employee/profile';

export class AuthService {
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    }

    async getCurrentProfile(): Promise<Profile | null> {
        const user = await this.getCurrentUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return data;
    }

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    async signIn(email: string, password: string) {
        return await supabase.auth.signInWithPassword({
            email,
            password,
        });
    }

    async getInvitationByToken(token: string) {
        return await supabase
            .from("invitations")
            .select(`
                id,
                email,
                full_name,
                company_id,
                role,
                token,
                department_id,
                position_id
            `)
            .eq("token", token)
            .is("used_at", null)
            .gt("expires_at", new Date().toISOString())
            .single();
    }

    async markInvitationAsUsed(invitationId: string) {
        return await supabase
            .from("invitations")
            .update({ used_at: new Date().toISOString() })
            .eq("id", invitationId);
    }

    async signUp(email: string, password: string) {
        return await supabase.auth.signUp({
            email,
            password,
        });
    }

    async createProfile(profile: Profile) {
        return await supabase
            .from("profiles")
            .insert(profile);
    }

    async createEmployee(employee: any) {
        let employeeCode = null;

        if (employee.company_id) {
            try {
                // 1. Get Company Code
                const { data: company } = await supabase
                    .from('companies')
                    .select('code, name')
                    .eq('id', employee.company_id)
                    .single();

                let prefix = company?.code;

                // Fallback: Generate generic prefix if not set
                if (!prefix && company?.name) {
                    prefix = company.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
                }

                if (prefix) {
                    // 2. Get Sequence
                    const { count } = await supabase
                        .from('employees')
                        .select('*', { count: 'exact', head: true })
                        .eq('company_id', employee.company_id);

                    const sequence = (count || 0) + 1;
                    const year = new Date().getFullYear().toString().slice(-2);
                    // Format: CODE + YY + 0001
                    employeeCode = `${prefix}${year}${sequence.toString().padStart(4, '0')}`;
                }
            } catch (e) {
                console.error("Failed to generate employee code", e);
            }
        }

        return await supabase
            .from("employees")
            .insert({
                ...employee,
                employee_code: employeeCode
            });
    }
}

export const authService = new AuthService();
