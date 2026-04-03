import { useState, useEffect } from 'react';
import * as profileApi from '@/lib/api/profile';
 
export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    loadProfile();
  }, []);
 
  async function loadProfile() {
    try {
      setLoading(true);
      const data = await profileApi.getUserProfile();
      setProfile(data || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
 
  async function update(updates) {
    try {
      const updated = await profileApi.updateUserProfile(updates);
      setProfile(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }
 
  return { profile, loading, error, update, reload: loadProfile };
}