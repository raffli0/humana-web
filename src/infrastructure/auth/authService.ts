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
        return await supabase
            .from("employees")
            .insert(employee);
    }
}

export const authService = new AuthService();
