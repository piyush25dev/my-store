// components/TestTokenComponent.jsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestTokenComponent() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkTokenOnMount();
  }, []);

  const checkTokenOnMount = async () => {
    console.log('=== TOKEN CHECK ON MOUNT ===');
    
    // Check localStorage
    const storedToken = localStorage.getItem('access_token');
    console.log('1. localStorage.getItem("access_token"):', storedToken ? '✅ FOUND' : '❌ NOT FOUND');
    if (storedToken) {
      console.log('   Token preview:', storedToken.substring(0, 50) + '...');
    }

    // Check Supabase session
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('2. supabase.auth.getSession():', session ? '✅ FOUND' : '❌ NOT FOUND');
      if (session?.access_token) {
        console.log('   Token preview:', session.access_token.substring(0, 50) + '...');
      }
    } catch (error) {
      console.log('2. supabase.auth.getSession() ERROR:', error.message);
    }

    // Check all localStorage keys
    console.log('3. All localStorage keys:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(`   - ${key}`);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    console.log('\n=== DIRECT FETCH TEST ===');
    
    try {
      // Get token
      const token = localStorage.getItem('access_token');
      console.log('Token found:', !!token);

      if (!token) {
        setResult({ error: 'No token in localStorage' });
        setLoading(false);
        return;
      }

      // Create headers object
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      console.log('Headers being sent:', {
        'Content-Type': headers['Content-Type'],
        'Authorization': headers['Authorization'].substring(0, 40) + '...',
      });

      // Make fetch request
      console.log('Fetching /api/orders...');
      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: headers,
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      setResult(data);
    } catch (error) {
      console.error('Test error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testWithSessionToken = async () => {
    setLoading(true);
    console.log('\n=== TEST WITH SESSION TOKEN ===');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setResult({ error: 'No session token' });
        setLoading(false);
        return;
      }

      const token = session.access_token;
      console.log('Session token found');
      console.log('Token preview:', token.substring(0, 50) + '...');

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      console.log('Fetching /api/orders with session token...');
      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: headers,
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      setResult(data);
    } catch (error) {
      console.error('Test error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const saveTokenManually = async () => {
    console.log('\n=== SAVE TOKEN MANUALLY ===');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        localStorage.setItem('access_token', session.access_token);
        console.log('✅ Token saved to localStorage');
        console.log('Token preview:', session.access_token.substring(0, 50) + '...');
        setResult({ message: 'Token saved to localStorage' });
      } else {
        console.log('❌ No session token to save');
        setResult({ error: 'No session token available' });
      }
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: error.message });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🔧 Token Diagnostic Tool</h2>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Step 1: Check what&apos;s stored</h3>
        <p>Check the browser console (F12) for token info above ☝️</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Step 2: Try to fetch with each method</h3>
        
        <button 
          onClick={saveTokenManually}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            marginBottom: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          1. Save Token from Session to localStorage
        </button>

        <button 
          onClick={testDirectFetch}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            marginBottom: '10px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          2. Test Fetch (localStorage token)
        </button>

        <button 
          onClick={testWithSessionToken}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            marginBottom: '10px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          3. Test Fetch (session token)
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '5px' }}>
        <h3>Result:</h3>
        {loading ? (
          <p>Loading...</p>
        ) : result ? (
          <pre style={{ overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        ) : (
          <p>Click a button above to test</p>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3e0', borderRadius: '5px' }}>
        <h4>Instructions:</h4>
        <ol>
          <li>Open browser DevTools (F12)</li>
          <li>Click &quot;Console&quot; tab</li>
          <li>Read the logs from &quot;TOKEN CHECK ON MOUNT&quot; section</li>
          <li>Click &quot;Save Token from Session&quot; button</li>
          <li>Click &quot;Test Fetch&quot; button</li>
          <li>Check both the result box below AND the console</li>
        </ol>
      </div>
    </div>
  );
}